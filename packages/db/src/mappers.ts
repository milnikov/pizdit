import type {
  Candidate,
  CandidateVerdict,
  ClaimCheck,
  Country,
  Election,
  ElectoralDistrict,
  PoliticalClaim,
} from "@pizdit/core";

function toIso(v: string | null | undefined): string {
  return v ?? new Date().toISOString();
}

export const mapRow = {
  country(row: Record<string, unknown>): Country {
    return {
      id: row.id as string,
      isoCode: row.iso_code as string,
      name: row.name as string,
      defaultLanguage: row.default_language as string,
      supportedLanguages: (row.supported_languages as string[]) ?? [],
      electionSystemNotes: row.election_system_notes as string | undefined,
      legalRiskNotes: row.legal_risk_notes as string | undefined,
      officialElectionSourceUrls:
        (row.official_election_source_urls as string[]) ?? [],
      adapterStatus: row.adapter_status as Country["adapterStatus"],
      createdAt: toIso(row.created_at as string),
      updatedAt: toIso(row.updated_at as string),
    };
  },

  election(row: Record<string, unknown>): Election {
    return {
      id: row.id as string,
      countryCode: row.country_code as string,
      name: row.name as string,
      regionName: row.region_name as string | undefined,
      municipalityName: row.municipality_name as string | undefined,
      districtName: row.district_name as string | undefined,
      electionLevel: row.election_level as Election["electionLevel"],
      ballotType: row.ballot_type as Election["ballotType"],
      electionDate: row.election_date as string,
      registrationDeadline: row.registration_deadline as string | undefined,
      pollingPlaceUrl: row.polling_place_url as string | undefined,
      sourceUrls: (row.source_urls as string[]) ?? [],
      createdAt: toIso(row.created_at as string),
      updatedAt: toIso(row.updated_at as string),
    };
  },

  electoralDistrict(row: Record<string, unknown>): ElectoralDistrict {
    return {
      id: row.id as string,
      countryCode: row.country_code as string,
      regionName: row.region_name as string | undefined,
      municipalityName: row.municipality_name as string | undefined,
      districtName: row.district_name as string,
      districtCode: row.district_code as string | undefined,
      boundaryGeoJson: row.boundary_geojson,
      sourceUrls: (row.source_urls as string[]) ?? [],
      createdAt: toIso(row.created_at as string),
      updatedAt: toIso(row.updated_at as string),
    };
  },

  candidate(row: Record<string, unknown>): Candidate {
    return {
      id: row.id as string,
      electionId: row.election_id as string,
      countryCode: row.country_code as string,
      fullName: row.full_name as string,
      partyName: row.party_name as string | undefined,
      partyId: row.party_id as string | undefined,
      isIndependent: (row.is_independent as boolean) ?? false,
      photoUrl: row.photo_url as string | undefined,
      officialWebsiteUrl: row.official_website_url as string | undefined,
      socialUrls: (row.social_urls as string[]) ?? [],
      shortBio: row.short_bio as string | undefined,
      currentRole: row.current_role as string | undefined,
      previousRoles: (row.previous_roles as string[]) ?? [],
      districtName: row.district_name as string | undefined,
      sourceLanguage: row.source_language as string | undefined,
      createdAt: toIso(row.created_at as string),
      updatedAt: toIso(row.updated_at as string),
    };
  },

  politicalClaim(row: Record<string, unknown>): PoliticalClaim {
    return {
      id: row.id as string,
      candidateId: row.candidate_id as string | undefined,
      partyId: row.party_id as string | undefined,
      electionId: row.election_id as string,
      countryCode: row.country_code as string,
      claimText: row.claim_text as string,
      originalLanguage: row.original_language as string,
      translatedText: row.translated_text as string | undefined,
      claimType: row.claim_type as PoliticalClaim["claimType"],
      claimSourceUrl: row.claim_source_url as string,
      claimSourceTitle: row.claim_source_title as string | undefined,
      claimDate: row.claim_date as string | undefined,
      context: row.context as string | undefined,
      jurisdictionLevel: row.jurisdiction_level as PoliticalClaim["jurisdictionLevel"],
      createdAt: toIso(row.created_at as string),
      updatedAt: toIso(row.updated_at as string),
    };
  },

  claimCheck(row: Record<string, unknown>): ClaimCheck {
    return {
      id: row.id as string,
      claimId: row.claim_id as string,
      candidateId: row.candidate_id as string | undefined,
      partyId: row.party_id as string | undefined,
      finalRating: row.final_rating as ClaimCheck["finalRating"],
      confidenceScore: Number(row.confidence_score),
      shortExplanation: row.short_explanation as string,
      detailedExplanation: row.detailed_explanation as string,
      evidenceUrls: (row.evidence_urls as string[]) ?? [],
      conflictingEvidenceUrls:
        (row.conflicting_evidence_urls as string[]) ?? [],
      tags: (row.tags as ClaimCheck["tags"]) ?? [],
      researchAgentAResultId: row.research_agent_a_result_id as string,
      researchAgentBResultId: row.research_agent_b_result_id as string,
      auditResultId: row.audit_result_id as string,
      auditStatus: row.audit_status as ClaimCheck["auditStatus"],
      traceId: row.trace_id as string,
      isPublished: (row.is_published as boolean) ?? false,
      createdAt: toIso(row.created_at as string),
      updatedAt: toIso(row.updated_at as string),
    };
  },

  candidateVerdict(row: Record<string, unknown>): CandidateVerdict {
    return {
      id: row.id as string,
      candidateId: row.candidate_id as string,
      electionId: row.election_id as string,
      verdict: row.verdict as CandidateVerdict["verdict"],
      confidenceScore: Number(row.confidence_score),
      summary: row.summary as string,
      topConcerns: (row.top_concerns as string[]) ?? [],
      reasonableProposals: (row.reasonable_proposals as string[]) ?? [],
      tags: (row.tags as CandidateVerdict["tags"]) ?? [],
      checkedClaimsCount: (row.checked_claims_count as number) ?? 0,
      problematicClaimsCount: (row.problematic_claims_count as number) ?? 0,
      lastCalculatedAt: toIso(row.last_calculated_at as string),
    };
  },
};
