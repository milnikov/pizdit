import { createHash, randomUUID } from "crypto";
import { getServiceClient } from "@pizdit/db";

const CHUNK_SIZE = 1500;
const CHUNK_OVERLAP = 200;

export async function ingestSourceUrl(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Pizdit/0.1 (civic-tech; https://github.com/milnikov/pizdit)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const rawHtml = await response.text();
  const rawText = stripHtml(rawHtml);
  const contentHash = createHash("sha256").update(rawText).digest("hex");

  const supabase = getServiceClient();

  const { data: existing } = await supabase
    .from("source_snapshots")
    .select("id")
    .eq("content_hash", contentHash)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: snapshot, error } = await supabase
    .from("source_snapshots")
    .insert({
      url,
      content_hash: contentHash,
      raw_text: rawText,
      raw_html: rawHtml.slice(0, 500000),
    })
    .select("id")
    .single();

  if (error) throw error;

  const chunks = chunkText(rawText);
  const chunkRows = chunks.map((text, index) => ({
    source_snapshot_id: snapshot.id,
    chunk_index: index,
    chunk_text: text,
    token_count: Math.ceil(text.length / 4),
  }));

  if (chunkRows.length > 0) {
    const { error: chunkError } = await supabase
      .from("source_chunks")
      .insert(chunkRows);
    if (chunkError) throw chunkError;
  }

  return snapshot.id;
}

export async function getRelevantChunks(
  snapshotIds: string[],
  query: string,
  limit = 5,
): Promise<string[]> {
  if (snapshotIds.length === 0) return [];

  const supabase = getServiceClient();
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 10);

  const { data, error } = await supabase
    .from("source_chunks")
    .select("chunk_text")
    .in("source_snapshot_id", snapshotIds)
    .limit(50);

  if (error || !data) return [];

  const scored = data
    .map((row) => ({
      text: row.chunk_text as string,
      score: keywords.reduce(
        (sum, kw) =>
          sum + ((row.chunk_text as string).toLowerCase().includes(kw) ? 1 : 0),
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((s) => s.text);
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    chunks.push(text.slice(start, end));
    start = end - CHUNK_OVERLAP;
    if (start >= text.length - CHUNK_OVERLAP) break;
  }

  return chunks.length > 0 ? chunks : [text];
}

export async function ingestCandidateSources(
  candidateId: string,
): Promise<string[]> {
  const supabase = getServiceClient();

  const { data: sources, error } = await supabase
    .from("candidate_sources")
    .select("url")
    .eq("candidate_id", candidateId);

  if (error) throw error;

  const snapshotIds: string[] = [];
  for (const source of sources ?? []) {
    try {
      const id = await ingestSourceUrl(source.url);
      snapshotIds.push(id);
    } catch (e) {
      console.error(`Failed to ingest ${source.url}:`, e);
    }
  }

  return snapshotIds;
}
