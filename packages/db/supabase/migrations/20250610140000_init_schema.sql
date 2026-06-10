-- Enable extensions
create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- Countries
create table countries (
  id uuid primary key default gen_random_uuid(),
  iso_code text unique not null,
  name text not null,
  default_language text not null,
  supported_languages text[] default '{}',
  election_system_notes text,
  legal_risk_notes text,
  official_election_source_urls text[] default '{}',
  adapter_status text not null default 'NOT_STARTED',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Elections
create table elections (
  id uuid primary key default gen_random_uuid(),
  country_code text not null,
  name text not null,
  region_name text,
  municipality_name text,
  district_name text,
  election_level text not null,
  ballot_type text not null default 'unknown',
  election_date date not null,
  registration_deadline date,
  polling_place_url text,
  source_urls text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Electoral districts
create table electoral_districts (
  id uuid primary key default gen_random_uuid(),
  country_code text not null,
  region_name text,
  municipality_name text,
  district_name text not null,
  district_code text,
  boundary_geojson jsonb,
  source_urls text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Parties
create table parties (
  id uuid primary key default gen_random_uuid(),
  country_code text not null,
  name text not null,
  short_name text,
  official_website_url text,
  social_urls text[] default '{}',
  ideology_description text,
  source_urls text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Candidates
create table candidates (
  id uuid primary key default gen_random_uuid(),
  election_id uuid references elections(id) on delete cascade,
  country_code text not null,
  full_name text not null,
  party_name text,
  party_id uuid references parties(id),
  is_independent boolean default false,
  photo_url text,
  official_website_url text,
  social_urls text[] default '{}',
  short_bio text,
  "current_role" text,
  previous_roles text[] default '{}',
  district_name text,
  source_language text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Candidate sources
create table candidate_sources (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidates(id) on delete cascade,
  url text not null,
  title text,
  publisher text,
  country_code text not null,
  language text,
  source_type text not null,
  reliability_level text not null,
  added_at timestamptz default now()
);

-- Source snapshots
create table source_snapshots (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  title text,
  publisher text,
  country_code text,
  language text,
  content_hash text,
  raw_text text,
  raw_html text,
  captured_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Source chunks
create table source_chunks (
  id uuid primary key default gen_random_uuid(),
  source_snapshot_id uuid references source_snapshots(id) on delete cascade,
  chunk_index integer not null,
  chunk_text text not null,
  token_count integer,
  embedding vector(1536),
  metadata jsonb,
  created_at timestamptz default now()
);

-- Political claims
create table political_claims (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidates(id) on delete cascade,
  party_id uuid references parties(id) on delete cascade,
  election_id uuid references elections(id) on delete cascade,
  country_code text not null,
  claim_text text not null,
  original_language text not null,
  translated_text text,
  claim_type text not null,
  claim_source_url text not null,
  claim_source_title text,
  claim_date date,
  context text,
  jurisdiction_level text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Research agent results
create table research_agent_results (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid references political_claims(id) on delete cascade,
  agent_name text not null,
  prompt_version text not null,
  model_name text not null,
  rating text not null,
  confidence_score numeric not null,
  summary text not null,
  reasoning_summary text not null,
  concerns text[] default '{}',
  missing_data text[] default '{}',
  raw_output jsonb,
  input_tokens integer,
  output_tokens integer,
  estimated_cost_usd numeric,
  created_at timestamptz default now()
);

-- Evidence items
create table evidence_items (
  id uuid primary key default gen_random_uuid(),
  research_agent_result_id uuid references research_agent_results(id) on delete cascade,
  url text not null,
  title text,
  publisher text,
  country_code text,
  language text,
  published_at date,
  accessed_at timestamptz default now(),
  source_type text not null,
  relevant_excerpt text,
  relevance_score numeric not null,
  supports_claim boolean,
  contradicts_claim boolean,
  created_at timestamptz default now()
);

-- Audit agent results
create table audit_agent_results (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid references political_claims(id) on delete cascade,
  agent_a_result_id uuid references research_agent_results(id),
  agent_b_result_id uuid references research_agent_results(id),
  prompt_version text not null,
  model_name text not null,
  agreement_level text not null,
  final_rating text not null,
  final_confidence_score numeric not null,
  publish_status text not null,
  audit_summary text not null,
  public_explanation text not null,
  internal_concerns text[] default '{}',
  required_human_review_reason text,
  raw_output jsonb,
  input_tokens integer,
  output_tokens integer,
  estimated_cost_usd numeric,
  created_at timestamptz default now()
);

-- Claim check traces
create table claim_check_traces (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid references political_claims(id) on delete cascade,
  agent_a_result_id uuid references research_agent_results(id),
  agent_b_result_id uuid references research_agent_results(id),
  audit_result_id uuid references audit_agent_results(id),
  source_snapshot_ids uuid[] default '{}',
  model_names text[] default '{}',
  prompt_versions text[] default '{}',
  input_tokens integer default 0,
  output_tokens integer default 0,
  estimated_cost_usd numeric,
  created_at timestamptz default now()
);

-- Claim checks
create table claim_checks (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid references political_claims(id) on delete cascade,
  candidate_id uuid references candidates(id) on delete cascade,
  party_id uuid references parties(id) on delete cascade,
  final_rating text not null,
  confidence_score numeric not null,
  short_explanation text not null,
  detailed_explanation text not null,
  evidence_urls text[] default '{}',
  conflicting_evidence_urls text[] default '{}',
  tags text[] default '{}',
  research_agent_a_result_id uuid references research_agent_results(id),
  research_agent_b_result_id uuid references research_agent_results(id),
  audit_result_id uuid references audit_agent_results(id),
  trace_id uuid references claim_check_traces(id),
  audit_status text not null,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Candidate verdicts
create table candidate_verdicts (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid unique references candidates(id) on delete cascade,
  election_id uuid references elections(id) on delete cascade,
  verdict text not null,
  confidence_score numeric not null,
  summary text not null,
  top_concerns text[] default '{}',
  reasonable_proposals text[] default '{}',
  tags text[] default '{}',
  checked_claims_count integer default 0,
  problematic_claims_count integer default 0,
  last_calculated_at timestamptz default now()
);

-- Geocoding cache
create table geocoding_cache (
  id uuid primary key default gen_random_uuid(),
  normalized_address_hash text unique not null,
  country_code text not null,
  region_name text,
  municipality_name text,
  district_name text,
  latitude numeric,
  longitude numeric,
  provider text,
  raw_result jsonb,
  created_at timestamptz default now()
);

-- Pipeline runs
create table pipeline_runs (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  pipeline_type text not null,
  status text not null default 'pending',
  error_message text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz default now()
);

-- Human review queue (schema only, post-MVP)
create table human_review_queue (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid references political_claims(id) on delete cascade,
  audit_result_id uuid references audit_agent_results(id),
  reason text not null,
  status text default 'pending',
  reviewer_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Manual overrides
create table manual_overrides (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  previous_value jsonb,
  new_value jsonb not null,
  reason text not null,
  reviewer_id text,
  created_at timestamptz default now()
);

-- Prompt versions
create table prompt_versions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  version text not null,
  prompt_text text not null,
  created_at timestamptz default now(),
  unique(name, version)
);

-- Model configs
create table model_configs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  provider text not null,
  model_name text not null,
  role text not null,
  input_cost_per_million_tokens numeric,
  output_cost_per_million_tokens numeric,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Token usage logs
create table token_usage_logs (
  id uuid primary key default gen_random_uuid(),
  pipeline_run_id uuid references pipeline_runs(id),
  entity_type text not null,
  entity_id uuid not null,
  model_name text not null,
  prompt_version text,
  input_tokens integer not null,
  output_tokens integer not null,
  estimated_cost_usd numeric,
  created_at timestamptz default now()
);

-- Indexes
create index idx_elections_country on elections(country_code);
create index idx_elections_date on elections(election_date);
create index idx_candidates_election on candidates(election_id);
create index idx_claims_candidate on political_claims(candidate_id);
create index idx_claim_checks_published on claim_checks(is_published) where is_published = true;
create index idx_geocoding_hash on geocoding_cache(normalized_address_hash);
create index idx_districts_country on electoral_districts(country_code);

-- RLS
alter table countries enable row level security;
alter table elections enable row level security;
alter table electoral_districts enable row level security;
alter table parties enable row level security;
alter table candidates enable row level security;
alter table candidate_sources enable row level security;
alter table political_claims enable row level security;
alter table claim_checks enable row level security;
alter table candidate_verdicts enable row level security;
alter table source_snapshots enable row level security;
alter table source_chunks enable row level security;
alter table research_agent_results enable row level security;
alter table audit_agent_results enable row level security;
alter table evidence_items enable row level security;
alter table claim_check_traces enable row level security;
alter table geocoding_cache enable row level security;
alter table pipeline_runs enable row level security;
alter table human_review_queue enable row level security;
alter table manual_overrides enable row level security;
alter table prompt_versions enable row level security;
alter table model_configs enable row level security;
alter table token_usage_logs enable row level security;

-- Public read policies
create policy "Public read countries" on countries for select using (true);
create policy "Public read elections" on elections for select using (true);
create policy "Public read districts" on electoral_districts for select using (true);
create policy "Public read parties" on parties for select using (true);
create policy "Public read candidates" on candidates for select using (true);
create policy "Public read claims" on political_claims for select using (true);
create policy "Public read published claim checks" on claim_checks for select using (is_published = true);
create policy "Public read verdicts" on candidate_verdicts for select using (true);
create policy "Public read traces" on claim_check_traces for select using (true);

-- Service role full access (via service role key bypasses RLS)
