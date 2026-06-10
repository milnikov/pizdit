import { ingestCandidateSources } from "@pizdit/ai";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const candidateId = searchParams.get("candidateId");

  if (!candidateId) {
    return NextResponse.json({ error: "candidateId required" }, { status: 400 });
  }

  try {
    const snapshotIds = await ingestCandidateSources(candidateId);
    return NextResponse.redirect(new URL("/candidates", request.url));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ingestion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { candidateId } = (await request.json()) as { candidateId?: string };

  if (!candidateId) {
    return NextResponse.json({ error: "candidateId required" }, { status: 400 });
  }

  try {
    const snapshotIds = await ingestCandidateSources(candidateId);
    return NextResponse.json({ success: true, snapshotIds });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ingestion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
