import type {
  Candidate,
  CandidateSource,
  Election,
  ElectoralDistrict,
} from "@pizdit/core";

export interface CountryAdapter {
  countryCode: string;
  getUpcomingElections(input: {
    regionName?: string;
    municipalityName?: string;
    districtName?: string;
  }): Promise<Election[]>;
  getDistrictForAddress(input: {
    address?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<ElectoralDistrict | null>;
  getCandidatesForElection(electionId: string): Promise<Candidate[]>;
  getOfficialSourcesForCandidate(
    candidateId: string,
  ): Promise<CandidateSource[]>;
  getOfficialSourcesForParty?(
    partyId: string,
  ): Promise<CandidateSource[]>;
  normalizeAddress?(address: string): Promise<string>;
  getPollingPlaceUrl?(input: {
    address?: string;
    districtId?: string;
  }): Promise<string | null>;
}

export type AdapterRegistry = Record<string, CountryAdapter>;
