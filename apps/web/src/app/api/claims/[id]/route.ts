import { getClaimById, getPublishedClaimCheck } from "@pizdit/db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const claim = await getClaimById(id);
    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    const claimCheck = await getPublishedClaimCheck(id);
    if (!claimCheck) {
      return NextResponse.json(
        { error: "No published check for this claim" },
        { status: 404 },
      );
    }

    return NextResponse.json({ claim, claimCheck });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch claim";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
