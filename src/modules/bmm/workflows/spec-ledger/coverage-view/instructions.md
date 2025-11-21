# Coverage View - Inspect Coverage and Traceability

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
</step>

<step n="1" goal="Calculate coverage statistics">
<action>Load Coverage_Matrix sheet</action>
<action>Load Uncovered_Aspects sheet</action>
<action>Load Requirements sheet</action>
<action>Load Workflows sheet</action>
<action>Load User_Stories sheet</action>
<action>Load ACs sheet</action>
<action>Load Traceability sheet</action>
<action>Calculate:
- Requirements coverage: (requirements with implementations / total requirements)
- Workflows coverage: (workflows with all components / total workflows)
- User Stories coverage: (stories with ACs / total stories)
- ACs coverage: (ACs linked to tests / total ACs)
- NFR coverage: (NFRs with validation / total NFRs)
</action>
</step>

<step n="2" goal="Generate coverage report">
<action>Generate coverage report with:
- Coverage statistics (percentages)
- Coverage matrix table
- Uncovered aspects list with severity
- Gaps by category (requirements, workflows, stories, ACs, NFRs)
- Recommendations for improving coverage
</action>
<action>Save to {default_output_file}</action>
<output>Coverage report generated!

Coverage Statistics:
- Requirements: {{requirements_coverage}}%
- Workflows: {{workflows_coverage}}%
- User Stories: {{stories_coverage}}%
- ACs: {{acs_coverage}}%
- NFRs: {{nfrs_coverage}}%

Report saved to: {default_output_file}

Review uncovered aspects and improve traceability as needed.
</output>
</step>

</workflow>

