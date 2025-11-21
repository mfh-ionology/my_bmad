# Sync Ledger to BMad Artifacts - Merge Ledger Content into PRD/Architecture/Frontend Spec

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and adapt deeply to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>MERGE NOT OVERWRITE: Augment existing PRD/architecture using existing patterns - do NOT hard-overwrite</critical>
<critical>LOAD ONLY RELEVANT SLICES: Retrieve only relevant subsets of the ledger, not load everything blindly</critical>
<critical>PRESERVE EXISTING CONTENT: Keep existing PRD/architecture content and add ledger references</critical>

<workflow>

<step n="0" goal="Load Spec Ledger and existing artifacts">
<action>Check if {spec_ledger_file} exists</action>
<check if="ledger file does not exist">
  <output>⚠️ Spec Ledger not found at {spec_ledger_file}

Please run *analyst-kickoff or *brd-to-spec-ledger first.</output>
  <action>Exit workflow</action>
</check>
<action>Load {spec_ledger_file} JSON</action>
<action>Check for existing artifacts:
- {prd_file}
- {architecture_file}
- Epic files in {output_folder}
</action>
</step>

<step n="1" goal="Update PRD with precise requirements">
<check if="PRD file exists">
  <action>Load {prd_file}</action>
  <action>Load Requirements sheet from ledger (only this sheet)</action>
  <action>For each requirement in ledger:
    - Check if requirement is already in PRD (by title or description match)
    - If not present, add requirement section with req_id reference
    - If present, add req_id reference to existing section
    - Update requirements section with precise ledger entries
  </action>
  <action>Add Spec Ledger reference section:
    - Note that requirements are tracked in Spec Ledger
    - Link to spec-ledger-master.md
    - List req_ids for traceability
  </action>
  <action>Save updated PRD</action>
</check>
<check if="PRD file does not exist">
  <output>PRD not found. Will create requirements section from ledger.</output>
  <action>Create PRD structure with requirements from ledger</action>
</check>
</step>

<step n="2" goal="Suggest architecture hints">
<action>Load Entities sheet from ledger</action>
<action>Load State_Model sheet from ledger</action>
<action>Load APIs sheet from ledger</action>
<action>Load Events sheet from ledger</action>
<action>Load External_Systems sheet from ledger</action>
<check if="architecture file exists">
  <action>Load {architecture_file}</action>
  <action>Add architecture hints section:
    - Data model hints (entities, fields, relationships)
    - State model patterns
    - API surface hints
    - Event-driven architecture hints
    - External system integration points
  </action>
  <action>Reference ledger IDs (entity_id, api_id, event_id) for traceability</action>
  <action>Save updated architecture</action>
</check>
<check if="architecture file does not exist">
  <output>Architecture file not found. Creating architecture hints document.</output>
  <action>Create architecture-hints.md with:
    - Entities and data model
    - State models
    - API surface
    - Events and integrations
    - All referenced by ledger IDs
  </action>
</check>
</step>

<step n="3" goal="Suggest or refine frontend spec">
<action>Load Pages sheet from ledger</action>
<action>Load Page_Fields sheet from ledger</action>
<action>Load Actions sheet from ledger</action>
<action>Load Page_Actions_Roles sheet from ledger</action>
<action>Create or update frontend-spec.md:
  - Pages with routes and descriptions
  - Page fields with control types and validation
  - Actions available on each page
  - Role-based permissions (Page_Actions_Roles)
  - All referenced by ledger IDs (page_id, action_id)
</action>
<action>Save frontend spec</action>
</step>

<step n="4" goal="Ensure BMad Epics/Stories alignment">
<action>Load Workflows sheet from ledger</action>
<action>Load User_Stories sheet from ledger</action>
<action>Check for epic files in {output_folder}</action>
<check if="epic files exist">
  <action>For each epic file:
    - Load epic content
    - Match workflows from ledger to epic stories
    - Add workflow_id references to stories
    - Ensure stories align with ledger Requirements & Workflows
    - Add ledger traceability comments
  </action>
  <action>Save updated epic files</action>
</check>
<check if="epic files do not exist">
  <output>Epic files not found. Stories will be created by *propose-stories-from-ledger or *create-epics-and-stories.</output>
</check>
</step>

<step n="5" goal="Generate sync summary">
<action>Create sync summary:
- PRD updated: {{prd_updated}}
- Architecture hints added: {{arch_hints_count}}
- Frontend spec created/updated: {{frontend_spec_updated}}
- Epics aligned: {{epics_aligned_count}}
- Ledger entries referenced: {{ledger_refs_count}}
</action>
<action>Save summary to {default_output_file}</action>
<output>Sync complete! Spec Ledger content merged into BMad artifacts.

Summary:
- PRD: {{prd_status}}
- Architecture: {{arch_status}}
- Frontend Spec: {{frontend_status}}
- Epics: {{epics_status}}

All artifacts now reference Spec Ledger IDs for traceability.

Next steps:
1. Review updated artifacts
2. Run *propose-stories-from-ledger to generate story files
3. Continue with implementation workflows
</output>
</step>

</workflow>

