import { createHash } from "crypto";

export type GeocodingResult = {
  latitude: number;
  longitude: number;
  countryCode: string;
  regionName?: string;
  municipalityName?: string;
  districtName?: string;
  formattedAddress?: string;
  provider: string;
  rawResult: unknown;
};

export function hashAddress(address: string): string {
  const normalized = address.trim().toLowerCase().replace(/\s+/g, " ");
  return createHash("sha256").update(normalized).digest("hex");
}

export async function geocodeAddress(
  address: string,
): Promise<GeocodingResult | null> {
  const provider = process.env.GEOCODING_PROVIDER ?? "nominatim";

  if (provider === "nominatim") {
    return geocodeNominatim(address);
  }

  throw new Error(`Unsupported geocoding provider: ${provider}`);
}

async function geocodeNominatim(
  address: string,
): Promise<GeocodingResult | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", address);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "Pizdit/0.1 (civic-tech; https://github.com/milnikov/pizdit)",
    },
  });

  if (!response.ok) return null;

  const results = (await response.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
    address?: {
      country_code?: string;
      state?: string;
      city?: string;
      town?: string;
      municipality?: string;
      suburb?: string;
    };
  }>;

  const first = results[0];
  if (!first) return null;

  const addr = first.address ?? {};

  return {
    latitude: parseFloat(first.lat),
    longitude: parseFloat(first.lon),
    countryCode: (addr.country_code ?? "").toUpperCase(),
    regionName: addr.state,
    municipalityName: addr.city ?? addr.town ?? addr.municipality,
    districtName: addr.suburb,
    formattedAddress: first.display_name,
    provider: "nominatim",
    rawResult: first,
  };
}
