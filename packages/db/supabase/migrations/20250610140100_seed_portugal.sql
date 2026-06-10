-- Portugal seed data for MVP demo

insert into countries (iso_code, name, default_language, supported_languages, official_election_source_urls, adapter_status)
values (
  'PT',
  'Portugal',
  'pt',
  array['pt', 'en'],
  array['https://www.cne.pt/', 'https://www.portaldasfinancas.gov.pt/'],
  'BETA'
);

insert into electoral_districts (country_code, region_name, municipality_name, district_name, district_code, source_urls)
values
  ('PT', 'Porto', 'Porto', 'Cedofeita', 'PT-PORTO-CED', array['https://www.cne.pt/']),
  ('PT', 'Porto', 'Porto', 'Bonfim', 'PT-PORTO-BON', array['https://www.cne.pt/']),
  ('PT', 'Porto', 'Porto', 'Campanhã', 'PT-PORTO-CAM', array['https://www.cne.pt/']),
  ('PT', 'Porto', 'Porto', 'Paranhos', 'PT-PORTO-PAR', array['https://www.cne.pt/']);

insert into elections (country_code, name, region_name, municipality_name, election_level, ballot_type, election_date, polling_place_url, source_urls)
values (
  'PT',
  'Municipal Council Election',
  'Porto',
  'Porto',
  'municipal',
  'candidate',
  '2026-10-12',
  'https://www.cne.pt/',
  array['https://www.cne.pt/']
);

-- Store election id for subsequent inserts
do $$
declare
  v_election_id uuid;
  v_party_ps uuid;
  v_party_psd uuid;
  v_party_be uuid;
  v_cand_anna uuid;
  v_cand_joao uuid;
  v_cand_maria uuid;
  v_cand_carlos uuid;
  v_claim1 uuid;
  v_claim2 uuid;
  v_claim3 uuid;
  v_claim4 uuid;
  v_claim5 uuid;
  v_ra1 uuid;
  v_ra2 uuid;
  v_rb1 uuid;
  v_rb2 uuid;
  v_audit1 uuid;
  v_audit2 uuid;
  v_trace1 uuid;
  v_trace2 uuid;
begin
  select id into v_election_id from elections where municipality_name = 'Porto' limit 1;

  insert into parties (country_code, name, short_name, official_website_url)
  values ('PT', 'Partido Socialista', 'PS', 'https://www.ps.pt/')
  returning id into v_party_ps;

  insert into parties (country_code, name, short_name, official_website_url)
  values ('PT', 'Partido Social Democrata', 'PSD', 'https://www.psd.pt/')
  returning id into v_party_psd;

  insert into parties (country_code, name, short_name, official_website_url)
  values ('PT', 'Bloco de Esquerda', 'BE', 'https://www.bloco.pt/')
  returning id into v_party_be;

  insert into candidates (election_id, country_code, full_name, party_name, party_id, is_independent, short_bio, current_role, source_language)
  values (v_election_id, 'PT', 'Ana Silva', 'Partido Socialista', v_party_ps, false, 'Former city councillor focused on housing policy.', 'City Councillor', 'pt')
  returning id into v_cand_anna;

  insert into candidates (election_id, country_code, full_name, party_name, party_id, is_independent, short_bio, current_role, source_language)
  values (v_election_id, 'PT', 'João Costa', 'Partido Social Democrata', v_party_psd, false, 'Business owner and transport policy advocate.', 'Entrepreneur', 'pt')
  returning id into v_cand_joao;

  insert into candidates (election_id, country_code, full_name, party_name, party_id, is_independent, short_bio, current_role, source_language)
  values (v_election_id, 'PT', 'Maria Santos', 'Bloco de Esquerda', v_party_be, false, 'Housing rights activist and community organizer.', 'Community Organizer', 'pt')
  returning id into v_cand_maria;

  insert into candidates (election_id, country_code, full_name, is_independent, short_bio, current_role, source_language)
  values (v_election_id, 'PT', 'Carlos Mendes', true, 'Independent candidate focused on fiscal transparency.', 'Accountant', 'pt')
  returning id into v_cand_carlos;

  -- Claims for Ana Silva
  insert into political_claims (candidate_id, election_id, country_code, claim_text, original_language, claim_type, claim_source_url, claim_source_title, jurisdiction_level)
  values (v_cand_anna, v_election_id, 'PT', 'Vamos reduzir os preços da habitação em 50% num ano.', 'pt', 'promise', 'https://example.com/ana-program', 'Programa Eleitoral Ana Silva', 'municipal')
  returning id into v_claim1;

  insert into political_claims (candidate_id, election_id, country_code, claim_text, original_language, claim_type, claim_source_url, claim_source_title, jurisdiction_level)
  values (v_cand_anna, v_election_id, 'PT', 'O desemprego no Porto diminuiu 40% durante o meu mandato.', 'pt', 'statistical', 'https://example.com/ana-debate', 'Debate Municipal', 'municipal')
  returning id into v_claim2;

  -- Claims for João Costa
  insert into political_claims (candidate_id, election_id, country_code, claim_text, original_language, claim_type, claim_source_url, claim_source_title, jurisdiction_level)
  values (v_cand_joao, v_election_id, 'PT', 'Vamos construir 5000 casas novas sem aumentar impostos.', 'pt', 'promise', 'https://example.com/joao-program', 'Programa João Costa', 'municipal')
  returning id into v_claim3;

  insert into political_claims (candidate_id, election_id, country_code, claim_text, original_language, claim_type, claim_source_url, claim_source_title, jurisdiction_level)
  values (v_cand_joao, v_election_id, 'PT', 'O metro do Porto é o mais eficiente da Europa.', 'pt', 'statistical', 'https://example.com/joao-interview', 'Entrevista RTP', 'municipal')
  returning id into v_claim4;

  -- Claim for Maria Santos
  insert into political_claims (candidate_id, election_id, country_code, claim_text, original_language, claim_type, claim_source_url, claim_source_title, jurisdiction_level)
  values (v_cand_maria, v_election_id, 'PT', 'O orçamento municipal destina 30% a habitação acessível.', 'pt', 'statistical', 'https://example.com/maria-program', 'Programa Maria Santos', 'municipal')
  returning id into v_claim5;

  -- Pre-seeded claim checks for Ana Silva claim 1 (housing 50%)
  insert into research_agent_results (claim_id, agent_name, prompt_version, model_name, rating, confidence_score, summary, reasoning_summary)
  values (v_claim1, 'RESEARCH_AGENT_A', 'v1.0', 'seed', 'UNSUPPORTED', 0.85, 'No budget or legal mechanism provided.', 'Municipal authority cannot unilaterally reduce market prices by 50% in one year.')
  returning id into v_ra1;

  insert into research_agent_results (claim_id, agent_name, prompt_version, model_name, rating, confidence_score, summary, reasoning_summary)
  values (v_claim1, 'RESEARCH_AGENT_B', 'v1.0', 'seed', 'UNSUPPORTED', 0.82, 'Claim lacks implementation plan.', 'Housing market interventions require detailed budget and timeline.')
  returning id into v_rb1;

  insert into audit_agent_results (claim_id, agent_a_result_id, agent_b_result_id, prompt_version, model_name, agreement_level, final_rating, final_confidence_score, publish_status, audit_summary, public_explanation)
  values (v_claim1, v_ra1, v_rb1, 'v1.0', 'seed', 'HIGH', 'UNSUPPORTED', 0.84, 'APPROVED', 'Both agents agree claim is unsupported.', 'The candidate does not provide a budget, legal mechanism, implementation timeline, or market intervention plan. Available housing data does not support the feasibility of this scale of reduction within one year.')
  returning id into v_audit1;

  insert into claim_check_traces (claim_id, agent_a_result_id, agent_b_result_id, audit_result_id, model_names, prompt_versions)
  values (v_claim1, v_ra1, v_rb1, v_audit1, array['seed'], array['v1.0'])
  returning id into v_trace1;

  insert into claim_checks (claim_id, candidate_id, final_rating, confidence_score, short_explanation, detailed_explanation, evidence_urls, tags, research_agent_a_result_id, research_agent_b_result_id, audit_result_id, trace_id, audit_status, is_published)
  values (v_claim1, v_cand_anna, 'UNSUPPORTED', 0.84, 'No budget or legal mechanism for 50% price reduction.', 'The candidate does not provide a budget, legal mechanism, implementation timeline, or market intervention plan.', array['https://www.ine.pt/'], array['NO_BUDGET', 'NO_IMPLEMENTATION_PLAN', 'VAGUE_PROMISE'], v_ra1, v_rb1, v_audit1, v_trace1, 'PASSED', true);

  -- Pre-seeded claim check for Ana Silva claim 2 (unemployment)
  insert into research_agent_results (claim_id, agent_name, prompt_version, model_name, rating, confidence_score, summary, reasoning_summary)
  values (v_claim2, 'RESEARCH_AGENT_A', 'v1.0', 'seed', 'MISLEADING', 0.78, 'Statistics misrepresent the timeframe.', 'Official labor statistics show a smaller decline than claimed.')
  returning id into v_ra2;

  insert into research_agent_results (claim_id, agent_name, prompt_version, model_name, rating, confidence_score, summary, reasoning_summary)
  values (v_claim2, 'RESEARCH_AGENT_B', 'v1.0', 'seed', 'MISLEADING', 0.75, 'Selective use of statistics.', 'The 40% figure uses a non-standard baseline period.')
  returning id into v_rb2;

  insert into audit_agent_results (claim_id, agent_a_result_id, agent_b_result_id, prompt_version, model_name, agreement_level, final_rating, final_confidence_score, publish_status, audit_summary, public_explanation)
  values (v_claim2, v_ra2, v_rb2, 'v1.0', 'seed', 'HIGH', 'MISLEADING', 0.77, 'APPROVED_WITH_WARNINGS', 'Both agents agree on misleading statistics.', 'The claim uses selective framing. Official labor statistics from INE show a smaller decline than the 40% figure cited.')
  returning id into v_audit2;

  insert into claim_check_traces (claim_id, agent_a_result_id, agent_b_result_id, audit_result_id, model_names, prompt_versions)
  values (v_claim2, v_ra2, v_rb2, v_audit2, array['seed'], array['v1.0'])
  returning id into v_trace2;

  insert into claim_checks (claim_id, candidate_id, final_rating, confidence_score, short_explanation, detailed_explanation, evidence_urls, tags, research_agent_a_result_id, research_agent_b_result_id, audit_result_id, trace_id, audit_status, is_published)
  values (v_claim2, v_cand_anna, 'MISLEADING', 0.77, 'Uses misleading statistics about unemployment.', 'Official labor statistics show a smaller decline than the 40% figure cited, using a non-standard baseline period.', array['https://www.ine.pt/'], array['MISLEADING_STATISTICS'], v_ra2, v_rb2, v_audit2, v_trace2, 'PASSED_WITH_WARNINGS', true);

  -- Candidate verdicts
  insert into candidate_verdicts (candidate_id, election_id, verdict, confidence_score, summary, top_concerns, reasonable_proposals, tags, checked_claims_count, problematic_claims_count)
  values (v_cand_anna, v_election_id, 'LIKELY_YES', 0.81, 'Several important checked claims lack clear evidence, budget details, or implementation mechanisms.', array['no budget', 'misleading statistics', 'vague promise'], array[]::text[], array['NO_BUDGET', 'MISLEADING_STATISTICS', 'VAGUE_PROMISE'], 2, 2);

  insert into candidate_verdicts (candidate_id, election_id, verdict, confidence_score, summary, top_concerns, reasonable_proposals, tags, checked_claims_count, problematic_claims_count)
  values (v_cand_joao, v_election_id, 'INSUFFICIENT_DATA', 0, 'Not enough checked claims to produce a stable verdict.', array[]::text[], array[]::text[], array['INSUFFICIENT_DATA'], 0, 0);

  insert into candidate_verdicts (candidate_id, election_id, verdict, confidence_score, summary, top_concerns, reasonable_proposals, tags, checked_claims_count, problematic_claims_count)
  values (v_cand_maria, v_election_id, 'INSUFFICIENT_DATA', 0, 'Not enough checked claims to produce a stable verdict.', array[]::text[], array[]::text[], array['INSUFFICIENT_DATA'], 0, 0);

  insert into candidate_verdicts (candidate_id, election_id, verdict, confidence_score, summary, top_concerns, reasonable_proposals, tags, checked_claims_count, problematic_claims_count)
  values (v_cand_carlos, v_election_id, 'INSUFFICIENT_DATA', 0, 'Not enough checked claims to produce a stable verdict.', array[]::text[], array[]::text[], array['INSUFFICIENT_DATA'], 0, 0);

  -- Prompt versions
  insert into prompt_versions (name, version, prompt_text) values
    ('claim-extraction', 'v1.0', 'Extract checkable political claims from source text.'),
    ('research-agent-a', 'v1.0', 'Independently verify the provided political claim.'),
    ('research-agent-b', 'v1.0', 'Verify the same claim independently from another angle.'),
    ('audit-agent', 'v1.0', 'Compare both research results and decide publishability.');

  -- Model configs
  insert into model_configs (name, provider, model_name, role, is_active) values
    ('research-default', 'openai', 'gpt-4o-mini', 'research', true),
    ('audit-default', 'openai', 'gpt-4o', 'audit', true);
end $$;
