import { registerAdapter } from "@pizdit/adapters";
import { geocodeAddress, hashAddress } from "@pizdit/adapters";
import { portugalAdapter } from "@pizdit/adapter-pt";
import { getGeocodingCache, getElections, setGeocodingCache } from "@pizdit/db";
import { NextResponse } from "next/server";

registerAdapter(portugalAdapter);

export async function POST(request: Request) {
  try {
    const { address } = (await request.json()) as { address?: string };

    if (!address?.trim()) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    const hash = hashAddress(address);

    let geo = await getGeocodingCache(hash).catch(() => null);

    if (!geo) {
      const result = await geocodeAddress(address);
      if (!result) {
        return NextResponse.json(
          { error: "Could not geocode address" },
          { status: 404 },
        );
      }

      await setGeocodingCache({
        normalizedAddressHash: hash,
        countryCode: result.countryCode,
        regionName: result.regionName,
        municipalityName: result.municipalityName,
        districtName: result.districtName,
        latitude: result.latitude,
        longitude: result.longitude,
        provider: result.provider,
        rawResult: result.rawResult,
      });

      geo = {
        country_code: result.countryCode,
        region_name: result.regionName,
        municipality_name: result.municipalityName,
        district_name: result.districtName,
      };
    }

    const elections = await getElections({
      countryCode: geo.country_code,
      regionName: geo.region_name ?? undefined,
      municipalityName: geo.municipality_name ?? undefined,
      districtName: geo.district_name ?? undefined,
    });

    return NextResponse.json({
      countryCode: geo.country_code,
      regionName: geo.region_name,
      municipalityName: geo.municipality_name,
      districtName: geo.district_name,
      elections,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Geocoding failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
