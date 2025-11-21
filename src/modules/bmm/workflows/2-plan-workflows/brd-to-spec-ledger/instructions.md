# BRD to Spec Ledger Pipeline - Parse BRD into Structured Ledger

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and adapt deeply to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>ITERATIVE Q&A: When BRD is ambiguous or conflicts, ask targeted clarification questions, then update only relevant ledger rows without wiping confirmed information</critical>
<critical>PRESERVE EXISTING DATA: Never overwrite confirmed ledger entries - only add new or update ambiguous fields</critical>

<workflow>

<step n="0" goal="Load BRD documents and initialize ledger">
<action>Ask user: "Please provide the path(s) to your BRD document(s) (markdown or text format)"</action>
<action>Load BRD document(s) - support multiple files if provided</action>
<action>Load {spec_ledger_schema} to understand ledger structure</action>
<action>Check if {spec_ledger_file} exists</action>
<check if="ledger file exists">
  <action>Load existing ledger JSON</action>
  <action>Preserve all existing confirmed data</action>
  <output>Found existing Spec Ledger. Will add/update entries from BRD without destroying confirmed fields.</output>
</check>
<check if="ledger file does not exist">
  <action>Create new ledger structure with empty arrays for all sheets</action>
  <action>Initialize BRD_Parse_Log array</action>
</check>
</step>

<step n="1" goal="Segment BRD into analyzable chunks">
<action>Parse BRD document(s) into segments:
- Split by paragraphs, sections, bullet points
- Assign § references (e.g., §1.1, §1.2, §2.1)
- Preserve section hierarchy and context
</action>
<action>Create BRD_Parse_Log entries for each segment:
- log_id: LOG-001, etc.
- brd_segment_ref: § reference
- confidence: "high" (will update based on classification)
- classification: TBD
- mapped_to: TBD
</action>
<action>Save ledger incrementally</action>
</step>

<step n="2" goal="Classify each BRD segment">
<action>For each BRD segment, classify as:
- FR (Functional Requirement)
- NFR (Non-Functional Requirement)
- UI (UI Requirement)
- API (API Requirement)
- BR (Business Rule)
- Misc (Miscellaneous)
- Actor/Role definition
- Workflow description
- Entity/Data model
- State transition
- Error/Validation
- KPI/Analytics
- Integration/External system
</action>
<action>Update BRD_Parse_Log with classification and confidence:
- confidence: "high" if clear, "medium" if somewhat clear, "low" if ambiguous
- classification: Assigned type
</action>
<action>For ambiguous segments, flag for user clarification</action>
<action>Save ledger incrementally</action>
</step>

<step n="3" goal="Extract and create Requirements entries">
<action>For segments classified as FR/NFR/UI/API/BR/Misc:
- Create or update Requirements entries
- req_id: REQ-XXX (use next available or match existing)
- type: Classified type
- title: Extract from segment
- description: Full segment text
- source_ref: BRD segment reference (§X.X)
- status: "draft"
- priority: Extract if mentioned, else ask user
</action>
<action>Update BRD_Parse_Log.mapped_to with requirement IDs</action>
<action>Save ledger incrementally</action>
</step>

<step n="4" goal="Extract actors, workflows, and steps">
<action>For segments describing workflows or user actions:
- Extract primary actor and other actors
- Extract workflow steps
- Extract preconditions and postconditions
- Create or update Workflows entries:
  - workflow_id: WF-XXX
  - name: Extract workflow name
  - description: Full workflow description
  - primary_actor: Extracted actor
  - steps: Array of steps
  - preconditions/postconditions
  - source_ref: BRD segment reference
</action>
<action>Link workflows to requirements via Traceability</action>
<action>Update BRD_Parse_Log.mapped_to with workflow IDs</action>
<action>Save ledger incrementally</action>
</step>

<step n="5" goal="Extract entities and fields">
<action>For segments describing data models or entities:
- Extract entity names and descriptions
- Extract fields with data types
- Create or update Entities entries:
  - entity_id: ENT-XXX
  - name: Entity name
  - description: Entity description
- Create or update Fields entries:
  - field_id: FLD-XXX
  - entity_id: Parent entity
  - name: Field name
  - data_type: Infer or ask user
  - nullable: Extract from description
  - validation_rules: Extract constraints
</action>
<action>Map entities with confidence scores (high/medium/low)</action>
<action>For low-confidence mappings, ask user: "Is [entity_name] referring to [candidate_entity] or a new entity?"</action>
<action>Update BRD_Parse_Log with entity mappings</action>
<action>Save ledger incrementally</action>
</step>

<step n="6" goal="Extract state models">
<action>For segments describing state transitions:
- Extract state names and codes
- Extract allowed transitions
- Extract guards/rules
- Create or update State_Model entries:
  - state_model_id: SM-XXX
  - entity_id: Related entity
  - state_name: State name
  - state_code: State code
  - allowed_from_states: Array
  - guards: Business rules
</action>
<action>Link state models to entities</action>
<action>Update BRD_Parse_Log</action>
<action>Save ledger incrementally</action>
</step>

<step n="7" goal="Generate acceptance criteria">
<action>For each requirement and workflow, generate ACs:
- Positive ACs: What should happen
- Negative ACs: What should not happen
- Edge case ACs: Boundary conditions
- Create ACs entries:
  - ac_id: AC-XXX
  - title: AC title
  - description: Detailed AC
  - type: positive, negative, edge_case
  - workflow_id_ref: Related workflow
  - requirement_ids_ref: Related requirements
</action>
<action>Link ACs to requirements, workflows, entities via Traceability</action>
<action>Save ledger incrementally</action>
</step>

<step n="8" goal="Wire traceability">
<action>Create Traceability entries:
- BRD segments → Requirements
- Requirements → Workflows
- Workflows → Entities, Pages, APIs
- ACs → Requirements, Workflows
- Use relation_type: implements, depends_on, triggers, validates, uses, references
</action>
<action>Save ledger incrementally</action>
</step>

<step n="9" goal="Handle ambiguities and conflicts">
<action>Review BRD_Parse_Log for low-confidence mappings</action>
<action>For each ambiguity:
- Present to user: "BRD segment §X.X says '[segment_text]' - is this [interpretation_a] or [interpretation_b]?"
- Wait for clarification
- Update ledger accordingly without destroying other fields
</action>
<action>For conflicts (e.g., same entity described differently):
- Ask user: "I found conflicting descriptions for [entity]. Which is correct: [option_a] or [option_b]?"
- Update ledger with confirmed information
</action>
<action>Save ledger incrementally</action>
</step>

<step n="10" goal="Finalize parse log and save">
<action>Generate BRD_Parse_Log summary:
- Total segments processed
- High confidence: {{high_count}}
- Medium confidence: {{medium_count}}
- Low confidence: {{low_count}}
- Ambiguities resolved: {{resolved_count}}
- Conflicts resolved: {{conflicts_resolved}}
</action>
<action>Save final ledger to {spec_ledger_file}</action>
<action>Generate parse log document at {default_output_file}</action>
<output>BRD to Spec Ledger parsing complete!

Parse Summary:
- Segments processed: {{total_segments}}
- Requirements created/updated: {{req_count}}
- Workflows created/updated: {{workflow_count}}
- Entities created/updated: {{entity_count}}
- ACs generated: {{ac_count}}
- Ambiguities requiring clarification: {{ambiguity_count}}

Spec Ledger updated at: {spec_ledger_file}
Parse log saved at: {default_output_file}

Next steps:
1. Review BRD_Parse_Log for ambiguities
2. Run *generate-spec-ledger-doc to create master document
3. Run *sync-ledger-to-bmad-artifacts to sync with PRD/architecture
</output>
</step>

</workflow>

