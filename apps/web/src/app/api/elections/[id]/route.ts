import { getElectionById, getCandidatesForElection } from "@pizdit/db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const election = await getElectionById(id);
    if (!election) {
      return NextResponse.json({ error: "Election not found" }, { status: 404 });
    }

    const candidates = await getCandidatesForElection(id);
    return NextResponse.json({ election, candidates });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch election";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
