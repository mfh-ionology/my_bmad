# Analyst Kickoff Workflow - Guided Intake for Spec Ledger

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and adapt deeply to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>ITERATIVE Q&A: Ask follow-up questions when data is missing, then update only relevant ledger rows without destroying confirmed fields</critical>
<critical>SPEC LEDGER IS PRIMARY STORE: All requirements and design details go into the ledger, not giant text documents</critical>

<workflow>

<step n="0" goal="Initialize Spec Ledger structure">
<action>Load {spec_ledger_schema} to understand the ledger structure</action>
<action>Check if {spec_ledger_file} exists</action>
<check if="ledger file exists">
  <action>Load existing ledger JSON</action>
  <action>Preserve all existing confirmed data</action>
  <output>Found existing Spec Ledger. Will update only missing or ambiguous fields.</output>
</check>
<check if="ledger file does not exist">
  <action>Create new ledger structure with empty arrays for all sheets</action>
  <action>Initialize with empty sheets: Requirements, Workflows, State_Model, Entities, Fields, Pages, Page_Fields, Actions, Page_Actions_Roles, APIs, Events, Errors, Analytics_KPIs, ACs, User_Stories, Traceability, Coverage_Matrix, Uncovered_Aspects, External_Systems, Reference_Data, Background_Jobs</action>
</check>
</step>

<step n="1" goal="Capture pain-point and desired outcome">
<action>Welcome {user_name} and begin guided discovery</action>
<ask>Describe the pain-point you're trying to solve. What problem does it address and who does it affect?</ask>
<ask>What is the desired outcome? What success looks like?</ask>
<action>Create or update Requirements entries:
- Create req_id: REQ-001 (or next available)
- type: "FR" (Functional Requirement)
- title: Extract from pain-point description
- description: Full pain-point and desired outcome
- status: "draft"
- priority: Ask user: "What priority is this? (P0/P1/P2/P3)"
</action>
<action>Save ledger incrementally</action>
</step>

<step n="2" goal="Identify actors and roles">
<ask>Who are the actors/users/roles involved? List all roles (e.g., Customer, Admin, Manager, System)</ask>
<ask>For each role, what can they do? What are their permissions?</ask>
<ask>Are there any exceptions or special cases for role permissions?</ask>
<action>Create Requirements entries for role-based requirements if needed</action>
<action>Note actors in Requirements.actors_ref arrays</action>
<action>Save ledger incrementally</action>
</step>

<step n="3" goal="Capture concrete actions (workflows)">
<ask>List 3-7 concrete actions users must perform (use verbs: create, update, view, delete, approve, etc.)</ask>
<ask>For each action, walk through the steps:
- What triggers this action?
- What are the preconditions?
- What are the steps?
- What happens after (postconditions)?
- Who can perform this action?</ask>
<action>For each action, create Workflows entry:
- workflow_id: WF-001, WF-002, etc.
- name: Action name
- description: Full workflow description
- primary_actor: Main role
- other_actors: Additional roles
- steps: Array of step descriptions
- preconditions: What must be true before
- postconditions: What must be true after
</action>
<action>Link workflows to requirements via Traceability entries</action>
<action>Save ledger incrementally</action>
</step>

<step n="4" goal="Identify entities and data model">
<ask>What are the main objects/entities in this system? (e.g., Order, Product, User, Payment)</ask>
<ask>For each entity, what are the key fields/properties?</ask>
<ask>What relationships exist between entities?</ask>
<action>Create Entities entries:
- entity_id: ENT-001, ENT-002, etc.
- name: Entity name
- description: What this entity represents
- key_fields_ref: Array of field IDs (create Fields entries)
</action>
<action>Create Fields entries:
- field_id: FLD-001, FLD-002, etc.
- entity_id: Parent entity
- name: Field name
- data_type: string, number, boolean, date, etc.
- nullable: true/false
- validation_rules: Any constraints
</action>
<action>Link entities to workflows via Workflows.entities_ref</action>
<action>Save ledger incrementally</action>
</step>

<step n="5" goal="Capture state models">
<ask>For each entity, what states does it go through? (e.g., Order: draft → pending → confirmed → shipped → delivered)</ask>
<ask>What rules/guards control state transitions?</ask>
<ask>Who can trigger each state transition?</ask>
<action>Create State_Model entries:
- state_model_id: SM-001, etc.
- entity_id: Related entity
- state_name: Human-readable name
- state_code: Machine-readable code
- allowed_from_states: Array of states that can transition to this
- allowed_roles: Who can trigger this transition
- guards: Business rules/conditions
</action>
<action>Link state models to entities via Entities.state_model_id</action>
<action>Save ledger incrementally</action>
</step>

<step n="6" goal="Identify UI pages and actions">
<ask>What pages/screens are needed? (e.g., Order List, Order Detail, Create Order form)</ask>
<ask>For each page:
- What entity does it display?
- What workflow does it support?
- What actions are available on this page?
- Who can access this page?</ask>
<action>Create Pages entries:
- page_id: PAGE-001, etc.
- name: Page name
- route: URL path
- entity_id: Primary entity
- workflow_id: Related workflow
- type: list, detail, form, dashboard, other
</action>
<action>Create Page_Fields entries for fields displayed on each page</action>
<action>Create Actions entries:
- action_id: ACT-001, etc.
- name: Action name
- level: page, entity, workflow, or system
- workflow_id: Related workflow
- preconditions/postconditions
</action>
<action>Create Page_Actions_Roles entries to map actions to roles</action>
<action>Save ledger incrementally</action>
</step>

<step n="7" goal="Identify APIs">
<ask>What APIs are needed? (CRUD operations, domain actions, status checks)</ask>
<ask>For each API:
- What HTTP method? (GET, POST, PUT, PATCH, DELETE)
- What path/endpoint?
- What entity does it operate on?
- What action does it support?</ask>
<action>Create APIs entries:
- api_id: API-001, etc.
- method: HTTP method
- path: Endpoint path
- entity_id: Related entity
- action_id_ref: Related action
- type: CRUD, domain, status, query
</action>
<action>Link APIs to workflows and entities</action>
<action>Save ledger incrementally</action>
</step>

<step n="8" goal="Capture KPIs and analytics">
<ask>What must be measured? What KPIs matter?</ask>
<ask>What events should be tracked?</ask>
<ask>What reporting views are needed?</ask>
<action>Create Analytics_KPIs entries:
- kpi_id: KPI-001, etc.
- name: KPI name
- description: What it measures
- formula: How to calculate
- events_ref: Related events
</action>
<action>Create Events entries if needed:
- event_id: EVT-001, etc.
- name: Event name
- trigger: What causes this event
</action>
<action>Save ledger incrementally</action>
</step>

<step n="9" goal="Identify errors and validation">
<ask>What errors matter? What validation rules are needed?</ask>
<ask>What user-friendly error messages should be shown?</ask>
<action>Create Errors entries:
- error_id: ERR-001, etc.
- code: Error code
- message: Technical message
- user_friendly_message: User-facing message
- severity: error, warning, info
- api_ids_ref: Which APIs can return this error
</action>
<action>Link errors to APIs and actions</action>
<action>Save ledger incrementally</action>
</step>

<step n="10" goal="Capture external systems and integrations">
<ask>Are there any external systems involved? (ERP, CRM, payment gateway, government APIs, etc.)</ask>
<ask>How do they interact? What integration modes? (API calls, webhooks, file transfers, etc.)</ask>
<action>Create External_Systems entries:
- external_system_id: EXT-001, etc.
- name: System name
- type: ERP, CRM, payment_gateway, gov_api, third_party_api, database, other
- integration_modes: Array of integration types
</action>
<action>Link external systems to APIs and events</action>
<action>Save ledger incrementally</action>
</step>

<step n="11" goal="Identify reference data">
<ask>What key reference data (enumerations/lookups) should we track? (statuses, categories, types, etc.)</ask>
<action>Create Reference_Data entries:
- ref_data_id: REF-001, etc.
- name: Reference data name
- category: Type of reference data
- values: Array of possible values
</action>
<action>Link reference data to entities and pages</action>
<action>Save ledger incrementally</action>
</step>

<step n="12" goal="Generate acceptance criteria">
<action>For each workflow, generate positive and negative ACs:
- Create ACs entries:
  - ac_id: AC-001, etc.
  - title: AC title
  - description: Detailed AC
  - type: positive, negative, edge_case
  - workflow_id_ref: Related workflow
  - requirement_ids_ref: Related requirements
</action>
<action>Link ACs to requirements, workflows, entities, and APIs via Traceability</action>
<action>Save ledger incrementally</action>
</step>

<step n="13" goal="Create initial user stories">
<action>For each workflow, create User_Stories entries:
- story_id: STORY-001, etc.
- workflow_id: Related workflow
- role_name: Actor role
- title: Story title
- narrative: "As a [role], I want [action] so that [benefit]"
- goal: What the story achieves
- benefit: Why it matters
- pages_ref: Related pages
- api_ids_ref: Related APIs
- requirement_ids_ref: Related requirements
- ac_ids_ref: Related ACs
- status: "candidate"
</action>
<action>Save ledger incrementally</action>
</step>

<step n="14" goal="Build traceability matrix">
<action>Create Traceability entries linking:
- Requirements → Workflows
- Workflows → Entities, Pages, APIs
- User_Stories → Requirements, APIs, ACs
- ACs → Requirements, Workflows
- APIs → Entities, Actions
- Events → External Systems
</action>
<action>Use relation_type: implements, depends_on, triggers, validates, uses, references</action>
<action>Save ledger incrementally</action>
</step>

<step n="15" goal="Finalize and generate summary">
<action>Save final ledger to {spec_ledger_file}</action>
<action>Generate summary document at {default_output_file}:
- Overview of captured requirements
- Workflows identified
- Entities and data model
- Pages and actions
- APIs
- KPIs
- External systems
- Next steps
</action>
<output>Analyst Kickoff complete! Spec Ledger initialized at {spec_ledger_file}

Summary: {{summary_stats}}
- Requirements: {{req_count}}
- Workflows: {{workflow_count}}
- Entities: {{entity_count}}
- Pages: {{page_count}}
- APIs: {{api_count}}
- User Stories: {{story_count}}

Next steps:
1. Review the Spec Ledger at {spec_ledger_file}
2. Run *brd-to-spec-ledger if you have BRD documents to parse
3. Run *generate-spec-ledger-doc to create the master document
4. Run *sync-ledger-to-bmad-artifacts to sync with PRD/architecture
</output>
</step>

</workflow>

