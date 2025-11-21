# Test Trace From Ledger - Design Test Strategy Using ACs and Traceability

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and adapt deeply to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>

<workflow>

<step n="0" goal="Load Spec Ledger">
<action>Check if {spec_ledger_file} exists</action>
<check if="ledger file does not exist">
  <output>⚠️ Spec Ledger not found at {spec_ledger_file}

Please run *analyst-kickoff or *brd-to-spec-ledger first.</output>
  <action>Exit workflow</action>
</check>
<action>Load {spec_ledger_file} JSON</action>
<action>Load ACs sheet</action>
<action>Load Traceability sheet</action>
<action>Load User_Stories sheet</action>
<action>Load Requirements sheet</action>
<action>Load Workflows sheet</action>
</step>

<step n="1" goal="Map ACs to test cases">
<action>For each AC entry:
- Extract AC type (positive, negative, edge_case)
- Map to test approach:
  - Positive ACs → Happy path tests
  - Negative ACs → Error/validation tests
  - Edge case ACs → Boundary/edge case tests
- Link AC to related requirements, workflows, entities, APIs
</action>
<action>Group ACs by workflow for test organization</action>
</step>

<step n="2" goal="Generate test strategy">
<action>Generate test strategy document:
- Test approach per workflow
- Test cases mapped to ACs
- Test coverage matrix (ACs → Test cases)
- Test levels (unit, integration, e2e) based on AC scope
- Test priorities based on requirement priorities
- Traceability: Requirements → ACs → Test cases
</action>
<action>Save to {default_output_file}</action>
<output>Test strategy generated from Spec Ledger!

Test Coverage:
- ACs mapped: {{acs_mapped_count}}
- Test cases proposed: {{test_cases_count}}
- Workflows covered: {{workflows_covered_count}}

Strategy saved to: {default_output_file}

Use this strategy to design and implement test cases with full traceability to requirements and ACs.
</output>
</step>

</workflow>

