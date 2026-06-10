import {
  getCandidateById,
  getCandidateVerdict,
  getPublishedClaimChecksForCandidate,
} from "@pizdit/db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const candidate = await getCandidateById(id);
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    const [verdict, claimChecks] = await Promise.all([
      getCandidateVerdict(id),
      getPublishedClaimChecksForCandidate(id),
    ]);

    return NextResponse.json({ candidate, verdict, claimChecks });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch candidate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
