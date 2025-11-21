# Propose BMad Stories From Ledger - Generate Story Files from User_Stories Sheet

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and adapt deeply to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>FULL TRACEABILITY: Each story must include links to requirement_ids_ref, api_ids_ref, entities_ref, ac_ids_ref</critical>
<critical>PRESERVE EXISTING: If story file exists, update it with ledger references, don't overwrite implementation details</critical>

<workflow>

<step n="0" goal="Load Spec Ledger and check story location">
<action>Check if {spec_ledger_file} exists</action>
<check if="ledger file does not exist">
  <output>⚠️ Spec Ledger not found at {spec_ledger_file}

Please run *analyst-kickoff or *brd-to-spec-ledger first.</output>
  <action>Exit workflow</action>
</check>
<action>Load {spec_ledger_file} JSON</action>
<action>Load User_Stories sheet</action>
<action>Load Requirements sheet (for traceability)</action>
<action>Load APIs sheet (for traceability)</action>
<action>Load Entities sheet (for traceability)</action>
<action>Load ACs sheet (for traceability)</action>
<action>Check if {stories_folder} exists, create if needed</action>
</step>

<step n="1" goal="Filter candidate stories">
<action>Filter User_Stories where status = "candidate" or status = "drafted"</action>
<action>Group stories by workflow_id for epic organization</action>
<action>Present to user: "Found {{story_count}} stories to propose. Group by workflow/epic?"</action>
</step>

<step n="2" goal="Generate or update story files">
<action>For each User_Stories entry with status = candidate or drafted:</action>
<action>Generate story filename: story-{{story_id}}.md (or use existing naming convention)</action>
<check if="story file exists">
  <action>Load existing story file</action>
  <action>Update story with ledger references:
    - Add story_id from ledger
    - Add requirement_ids_ref links
    - Add api_ids_ref links
    - Add entities_ref links
    - Add ac_ids_ref links
    - Add workflow_id reference
    - Preserve existing implementation details
  </action>
</check>
<check if="story file does not exist">
  <action>Create new story file with structure:
    - Story ID: {{story_id}}
    - Title: {{title}}
    - Narrative: {{narrative}}
    - Role: {{role_name}}
    - Goal: {{goal}}
    - Benefit: {{benefit}}
    - Preconditions: {{preconditions}}
    - Trigger: {{trigger}}
    - Postconditions: {{postconditions}}
    
    ## Traceability
    - Requirements: {{requirement_ids_ref}}
    - APIs: {{api_ids_ref}}
    - Entities: {{entities_ref}}
    - Acceptance Criteria: {{ac_ids_ref}}
    - Workflow: {{workflow_id}}
    - Pages: {{pages_ref}}
    - Action: {{action_id}}
    
    ## Implementation Notes
    (To be filled during development)
  </action>
</check>
<action>Save story file</action>
</step>

<step n="3" goal="Group stories into epics">
<action>Group stories by workflow_id</action>
<action>For each workflow/epic:
  - Check if epic file exists
  - If not, create epic file with workflow reference
  - Add story references to epic
  - Link epic to workflow_id in ledger
</action>
<action>Save epic files</action>
</step>

<step n="4" goal="Update story status in ledger">
<action>For each story file created/updated:
  - Update User_Stories.status to "drafted" (if was "candidate")
  - Keep "drafted" status if already drafted
</action>
<action>Save ledger</action>
</step>

<step n="5" goal="Generate proposal summary">
<action>Create summary:
- Stories proposed: {{stories_proposed_count}}
- Stories updated: {{stories_updated_count}}
- Epics created/updated: {{epics_count}}
- Traceability links added: {{traceability_links_count}}
</action>
<action>List all story files created/updated</action>
<action>Save summary to {default_output_file}</action>
<output>Stories proposed from Spec Ledger!

Summary:
- Stories proposed: {{stories_proposed_count}}
- Stories updated: {{stories_updated_count}}
- Epics: {{epics_count}}

All stories include full traceability to:
- Requirements (req_id)
- APIs (api_id)
- Entities (entity_id)
- Acceptance Criteria (ac_id)
- Workflows (workflow_id)

Story files saved to: {stories_folder}

Next steps:
1. Review proposed stories
2. Update story status in ledger as needed
3. Use *create-story-context to prepare stories for development
</output>
</step>

</workflow>

