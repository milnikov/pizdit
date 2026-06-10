import { getElections } from "@pizdit/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get("countryCode") ?? undefined;
  const regionName = searchParams.get("regionName") ?? undefined;
  const municipalityName = searchParams.get("municipalityName") ?? undefined;
  const districtName = searchParams.get("districtName") ?? undefined;

  try {
    const elections = await getElections({
      countryCode,
      regionName,
      municipalityName,
      districtName,
    });
    return NextResponse.json(elections);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch elections";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
