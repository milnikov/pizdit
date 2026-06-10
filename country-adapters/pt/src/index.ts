import type { CountryAdapter } from "@pizdit/adapters";
import {
  getCandidatesForElection as dbGetCandidates,
  getDistricts,
  getElections,
  getServiceClient,
} from "@pizdit/db";

export const portugalAdapter: CountryAdapter = {
  countryCode: "PT",

  async getDistrictForAddress(input) {
    if (input.latitude && input.longitude) {
      const districts = await getDistricts({
        countryCode: "PT",
        municipalityName: "Porto",
      });

      if (districts.length > 0) {
        return districts[0];
      }
    }

    if (input.address) {
      const normalized = input.address.toLowerCase();
      const districts = await getDistricts({
        countryCode: "PT",
        municipalityName: normalized.includes("porto") ? "Porto" : undefined,
      });

      for (const d of districts) {
        const districtName = d.districtName.toLowerCase();
        if (normalized.includes(districtName)) {
          return d;
        }
      }

      if (normalized.includes("porto") && districts.length > 0) {
        return districts[0];
      }
    }

    return null;
  },

  async getUpcomingElections(input) {
    return getElections({
      countryCode: "PT",
      regionName: input.regionName,
      municipalityName: input.municipalityName ?? "Porto",
      districtName: input.districtName,
    });
  },

  async getCandidatesForElection(electionId) {
    return dbGetCandidates(electionId);
  },

  async getOfficialSourcesForCandidate(candidateId) {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("candidate_sources")
      .select("*")
      .eq("candidate_id", candidateId);

    if (error) throw error;

    return (data ?? []).map((r) => ({
      id: r.id,
      candidateId: r.candidate_id,
      url: r.url,
      title: r.title,
      publisher: r.publisher,
      countryCode: r.country_code,
      language: r.language,
      sourceType: r.source_type,
      reliabilityLevel: r.reliability_level,
      addedAt: r.added_at,
    }));
  },

  async getPollingPlaceUrl() {
    return "https://www.cne.pt/";
  },

  async normalizeAddress(address) {
    return address.trim().replace(/\s+/g, " ");
  },
};
