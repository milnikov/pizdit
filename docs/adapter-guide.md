# Country Adapter Guide

Each country should implement the `CountryAdapter` interface from `@pizdit/adapters`.

## Required Methods

- `getUpcomingElections` — elections for a region/district
- `getDistrictForAddress` — map address/coordinates to electoral district
- `getCandidatesForElection` — ballot candidates
- `getOfficialSourcesForCandidate` — source URLs for fact-checking

## Adapter Documentation

Each adapter README should document:

- Official election authority
- Data source URLs
- Supported election levels and languages
- Known limitations and legal risks

## Status Levels

`NOT_STARTED` → `PLANNED` → `IN_PROGRESS` → `BETA` → `SUPPORTED` → `DEPRECATED`

Portugal (`country-adapters/pt`) is at **BETA** for MVP.
