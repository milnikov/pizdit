import { getCountries } from "@pizdit/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const countries = await getCountries();
    return NextResponse.json(countries);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch countries";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
