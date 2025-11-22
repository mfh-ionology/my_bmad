# Lint Spec Ledger - Validate Spec Ledger Quality

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and adapt deeply to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>READ-ONLY: This workflow does NOT modify the Spec Ledger - it only reads and reports issues</critical>

<workflow>

<step n="0" goal="Load Spec Ledger and Schema">
<action>Check if {spec_ledger_file} exists</action>
<check if="ledger file does not exist">
  <output>⚠️ Spec Ledger not found at {spec_ledger_file}

Please run *analyst-kickoff or *brd-to-spec-ledger first.</output>
  <action>Exit workflow</action>
</check>
<action>Load {spec_ledger_file} JSON</action>
<action>Load {spec_ledger_schema} to understand expected structure</action>
</step>

<step n="1" goal="Check for duplicate IDs">
<action>For each sheet that uses an *_id as a key, check for duplicates:
- Requirements: Check req_id duplicates
- Workflows: Check workflow_id duplicates
- Entities: Check entity_id duplicates
- Fields: Check field_id duplicates
- Pages: Check page_id duplicates
- Actions: Check action_id duplicates
- APIs: Check api_id duplicates
- ACs: Check ac_id duplicates
- User_Stories: Check story_id duplicates
- State_Model: Check state_model_id duplicates
- Errors: Check error_id duplicates
- Analytics_KPIs: Check kpi_id duplicates
- External_Systems: Check external_system_id duplicates
- Reference_Data: Check ref_data_id duplicates
- Background_Jobs: Check job_id duplicates
</action>
<action>Collect all duplicate IDs with their sheet names</action>
</step>

<step n="2" goal="Check for orphan references - Actions">
<action>Load Actions sheet</action>
<action>Load Page_Actions_Roles sheet</action>
<action>For each action_id in Actions:
- Check if it appears in Page_Actions_Roles.action_id
- If not found, flag as orphan (action exists but not used on any page)
</action>
<action>Collect orphan action IDs</action>
</step>

<step n="3" goal="Check for orphan references - APIs">
<action>Load APIs sheet</action>
<action>Load Entities sheet</action>
<action>Load Workflows sheet</action>
<action>Load Actions sheet</action>
<action>For each API:
- Check if api_id has meaningful links:
  - If entity_id is present and exists in Entities → OK
  - If action_id_ref is present and exists in Actions → OK
  - If neither entity_id nor action_id_ref exist → Flag as orphan API
  - If entity_id exists but entity not found in Entities → Flag as broken reference
  - If action_id_ref exists but action not found in Actions → Flag as broken reference
</action>
<action>Collect orphan and broken API references</action>
</step>

<step n="4" goal="Check for orphan references - ACs">
<action>Load ACs sheet</action>
<action>Load Requirements sheet</action>
<action>Load Workflows sheet</action>
<action>For each AC:
- Check requirement_ids_ref: If present, verify all IDs exist in Requirements
- Check workflow_id_ref: If present, verify it exists in Workflows
- If AC has no requirement_ids_ref AND no workflow_id_ref → Flag as orphan AC
- If requirement_ids_ref contains non-existent IDs → Flag as broken reference
- If workflow_id_ref exists but workflow not found → Flag as broken reference
</action>
<action>Collect orphan ACs and broken AC references</action>
</step>

<step n="5" goal="Check for orphan references - User Stories">
<action>Load User_Stories sheet</action>
<action>Load Requirements sheet</action>
<action>Load APIs sheet</action>
<action>Load Entities sheet</action>
<action>Load Pages sheet</action>
<action>Load ACs sheet</action>
<action>For each User Story:
- Check requirement_ids_ref: Verify all IDs exist in Requirements
- Check api_ids_ref: Verify all IDs exist in APIs
- Check entities_ref: Verify all IDs exist in Entities
- Check pages_ref: Verify all IDs exist in Pages
- Check ac_ids_ref: Verify all IDs exist in ACs
- Collect all broken references
</action>
<action>Collect broken User Story references</action>
</step>

<step n="6" goal="Check basic coverage">
<action>Load Coverage_Matrix sheet (if exists)</action>
<action>Load Uncovered_Aspects sheet (if exists)</action>
<action>Load Workflows sheet</action>
<action>Load Entities sheet</action>
<action>Load Pages sheet</action>
<action>Load APIs sheet</action>
<action>Load ACs sheet</action>
<check if="Coverage_Matrix exists and has entries">
  <action>For each workflow in Workflows:
    - Count how many have associated entities (via entities_ref)
    - Count how many have associated pages (via pages_ref)
    - Count how many have associated APIs (via APIs.entity_id or APIs.action_id_ref linked to workflow)
    - Count how many have associated ACs (via ACs.workflow_id_ref)
  </action>
  <action>Calculate coverage percentages per workflow</action>
</check>
<check if="Coverage_Matrix does not exist or is empty">
  <action>Note as warning: Coverage_Matrix not found or empty - coverage checks skipped</action>
</check>
<check if="Uncovered_Aspects exists and has entries">
  <action>Count unresolved/unclear entries (if status field exists)</action>
  <action>Group by severity (critical, high, medium, low)</action>
</check>
</step>

<step n="7" goal="Check BRD_Parse_Log status">
<action>Load BRD_Parse_Log sheet (if exists)</action>
<check if="BRD_Parse_Log exists">
  <action>Count total entries</action>
  <action>Count entries with confidence = "low"</action>
  <action>Check for any status field indicating "unresolved" or "unclear" entries</action>
  <action>Summarize parse log status</action>
</check>
<check if="BRD_Parse_Log does not exist">
  <action>Note: BRD_Parse_Log not found (this is OK if BRD parsing was not used)</action>
</check>
</step>

<step n="8" goal="Calculate statistics">
<action>Count totals:
- Total APIs
- Total Entities
- Total Pages
- Total Actions
- Total User Stories
- Total ACs
- Total Requirements
- Total Workflows
</action>
<action>Count issues:
- Duplicate IDs count
- Orphan Actions count
- Orphan APIs count
- Orphan ACs count
- Broken references count
- Unresolved parse log entries count
</action>
</step>

<step n="9" goal="Generate lint report">
<action>Generate markdown report with sections:

## Spec Ledger Lint Report

Generated: {{date}}

### Summary Statistics
- APIs: {{api_count}}
- Entities: {{entity_count}}
- Pages: {{page_count}}
- Actions: {{action_count}}
- User Stories: {{story_count}}
- ACs: {{ac_count}}
- Requirements: {{req_count}}
- Workflows: {{workflow_count}}

### Errors (Must Fix Before Development)

#### Duplicate IDs
{{duplicate_ids_list}}

#### Broken References
{{broken_references_list}}

### Warnings (Nice to Address)

#### Orphan Actions
{{orphan_actions_list}}

#### Orphan APIs
{{orphan_apis_list}}

#### Orphan ACs
{{orphan_acs_list}}

### Coverage Summary
{{coverage_summary}}

### BRD Parse Log Status
{{brd_parse_log_summary}}

### Recommendations
{{recommendations}}
</action>
<action>Save report to {lint_report_file}</action>
<output>Spec Ledger lint report generated!

Errors: {{error_count}}
Warnings: {{warning_count}}

Report saved to: {lint_report_file}

Review the report and fix errors before proceeding to development.
</output>
</step>

</workflow>

