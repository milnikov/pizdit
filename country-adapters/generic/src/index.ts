import type { CountryAdapter } from "@pizdit/adapters";

export const genericAdapter: CountryAdapter = {
  countryCode: "GENERIC",

  async getUpcomingElections() {
    return [];
  },

  async getDistrictForAddress() {
    return null;
  },

  async getCandidatesForElection() {
    return [];
  },

  async getOfficialSourcesForCandidate() {
    return [];
  },
};
