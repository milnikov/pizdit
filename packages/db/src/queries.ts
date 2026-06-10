import type {
  Candidate,
  CandidateVerdict,
  ClaimCheck,
  Country,
  Election,
  PoliticalClaim,
} from "@pizdit/core";
import { getServiceClient, getSupabaseClient } from "./client";
import { mapRow } from "./mappers";

export async function getCountries(): Promise<Country[]> {
  const { data, error } = await getSupabaseClient()
    .from("countries")
    .select("*")
    .order("name");
  if (error) throw error;
  return (data ?? []).map((r) => mapRow.country(r));
}

export async function getCountryByCode(isoCode: string): Promise<Country | null> {
  const { data, error } = await getSupabaseClient()
    .from("countries")
    .select("*")
    .eq("iso_code", isoCode.toUpperCase())
    .single();
  if (error) return null;
  return mapRow.country(data);
}

export async function getElections(filters: {
  countryCode?: string;
  regionName?: string;
  municipalityName?: string;
  districtName?: string;
}): Promise<Election[]> {
  let query = getSupabaseClient()
    .from("elections")
    .select("*")
    .gte("election_date", new Date().toISOString().split("T")[0])
    .order("election_date");

  if (filters.countryCode) query = query.eq("country_code", filters.countryCode);
  if (filters.regionName) query = query.eq("region_name", filters.regionName);
  if (filters.municipalityName)
    query = query.eq("municipality_name", filters.municipalityName);
  if (filters.districtName) query = query.eq("district_name", filters.districtName);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((r) => mapRow.election(r));
}

export async function getElectionById(id: string): Promise<Election | null> {
  const { data, error } = await getSupabaseClient()
    .from("elections")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return mapRow.election(data);
}

export async function getCandidatesForElection(
  electionId: string,
): Promise<Candidate[]> {
  const { data, error } = await getSupabaseClient()
    .from("candidates")
    .select("*")
    .eq("election_id", electionId)
    .order("full_name");
  if (error) throw error;
  return (data ?? []).map((r) => mapRow.candidate(r));
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  const { data, error } = await getSupabaseClient()
    .from("candidates")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return mapRow.candidate(data);
}

export async function getCandidateVerdict(
  candidateId: string,
): Promise<CandidateVerdict | null> {
  const { data, error } = await getSupabaseClient()
    .from("candidate_verdicts")
    .select("*")
    .eq("candidate_id", candidateId)
    .order("last_calculated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return mapRow.candidateVerdict(data);
}

export async function getPublishedClaimChecksForCandidate(
  candidateId: string,
): Promise<ClaimCheck[]> {
  const { data, error } = await getSupabaseClient()
    .from("claim_checks")
    .select("*")
    .eq("candidate_id", candidateId)
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => mapRow.claimCheck(r));
}

export async function getClaimById(id: string): Promise<PoliticalClaim | null> {
  const { data, error } = await getSupabaseClient()
    .from("political_claims")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return mapRow.politicalClaim(data);
}

export async function getPublishedClaimCheck(
  claimId: string,
): Promise<ClaimCheck | null> {
  const { data, error } = await getSupabaseClient()
    .from("claim_checks")
    .select("*")
    .eq("claim_id", claimId)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return mapRow.claimCheck(data);
}

export async function getGeocodingCache(hash: string) {
  const { data } = await getServiceClient()
    .from("geocoding_cache")
    .select("*")
    .eq("normalized_address_hash", hash)
    .maybeSingle();
  return data;
}

export async function setGeocodingCache(entry: {
  normalizedAddressHash: string;
  countryCode: string;
  regionName?: string;
  municipalityName?: string;
  districtName?: string;
  latitude?: number;
  longitude?: number;
  provider: string;
  rawResult: unknown;
}) {
  const { error } = await getServiceClient().from("geocoding_cache").upsert({
    normalized_address_hash: entry.normalizedAddressHash,
    country_code: entry.countryCode,
    region_name: entry.regionName,
    municipality_name: entry.municipalityName,
    district_name: entry.districtName,
    latitude: entry.latitude,
    longitude: entry.longitude,
    provider: entry.provider,
    raw_result: entry.rawResult,
  });
  if (error) throw error;
}

export async function getClaimCheckTrace(traceId: string) {
  const { data, error } = await getSupabaseClient()
    .from("claim_check_traces")
    .select("model_names, prompt_versions, created_at")
    .eq("id", traceId)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

export async function getDistricts(filters: {
  countryCode: string;
  municipalityName?: string;
  regionName?: string;
}) {
  let query = getServiceClient()
    .from("electoral_districts")
    .select("*")
    .eq("country_code", filters.countryCode);

  if (filters.municipalityName)
    query = query.ilike("municipality_name", `%${filters.municipalityName}%`);
  if (filters.regionName)
    query = query.ilike("region_name", `%${filters.regionName}%`);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((r) => mapRow.electoralDistrict(r));
}
