# Generate Spec Ledger Master Document - Build Master Doc from Ledger Sheets

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and adapt deeply to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>LOAD ONLY RELEVANT SLICES: When generating sections, load only the ledger rows needed for that section to stay within context</critical>
<critical>USE TEMPLATE: Follow {template} structure and populate sections from ledger data</critical>

<workflow>

<step n="0" goal="Load Spec Ledger">
<action>Check if {spec_ledger_file} exists</action>
<check if="ledger file does not exist">
  <output>⚠️ Spec Ledger not found at {spec_ledger_file}

Please run *analyst-kickoff or *brd-to-spec-ledger first to create the ledger.</output>
  <action>Exit workflow</action>
</check>
<action>Load {spec_ledger_file} JSON</action>
<action>Load {template} to understand document structure</action>
</step>

<step n="1" goal="Generate Source & Parse Log section">
<action>Load BRD_Parse_Log sheet from ledger</action>
<action>Generate summary:
- List BRD sources (extract from parse log)
- Count confidence distribution
- List ambiguities requiring clarification
</action>
<template-output>brd_sources</template-output>
<template-output>brd_parse_log_summary</template-output>
<template-output>high_confidence_count</template-output>
<template-output>medium_confidence_count</template-output>
<template-output>low_confidence_count</template-output>
<template-output>ambiguities_list</template-output>
</step>

<step n="2" goal="Generate Requirements Catalogue">
<action>Load Requirements sheet (only this sheet, not entire ledger)</action>
<action>Group by type: FR, NFR, UI, API, BR, Misc</action>
<action>Format each requirement with req_id, title, description, priority, status</action>
<template-output>functional_requirements</template-output>
<template-output>non_functional_requirements</template-output>
<template-output>ui_requirements</template-output>
<template-output>api_requirements</template-output>
<template-output>business_rules</template-output>
<template-output>misc_requirements</template-output>
</step>

<step n="3" goal="Generate Actors & Roles section">
<action>Extract actors from Requirements.actors_ref arrays</action>
<action>Deduplicate and format actors with their permissions</action>
<template-output>actors_and_roles</template-output>
</step>

<step n="4" goal="Generate Workflows & State Models section">
<action>Load Workflows sheet</action>
<action>For each workflow, format with:
- workflow_id, name, description
- primary_actor, other_actors
- steps (numbered list)
- preconditions, postconditions
- linked entities, pages, events
</action>
<action>Load State_Model sheet</action>
<action>Group state models by entity</action>
<action>Format state transitions with guards and allowed roles</action>
<template-output>workflows_list</template-output>
<template-output>state_models_list</template-output>
</step>

<step n="5" goal="Generate Data Model section">
<action>Load Entities sheet</action>
<action>Load Fields sheet</action>
<action>For each entity:
- Format entity with description
- List fields with data types, nullable, validation rules
- Show key fields
- Link to state model if exists
</action>
<action>Generate relationships diagram (text-based) from entity references</action>
<template-output>entities_list</template-output>
<template-output>fields_list</template-output>
<template-output>relationships_diagram</template-output>
</step>

<step n="6" goal="Generate UI Surfaces section">
<action>Load Pages sheet</action>
<action>Load Page_Fields sheet</action>
<action>Load Page_Actions_Roles sheet</action>
<action>For each page:
- Format with route, description, entity, workflow
- List page fields with control types, visibility, editability
- List actions available on page
- Show role mappings for actions
</action>
<template-output>pages_list</template-output>
<template-output>page_fields_summary</template-output>
<template-output>page_actions_roles</template-output>
</step>

<step n="7" goal="Generate API Surface section">
<action>Load APIs sheet</action>
<action>Group by type: CRUD, domain, status, query</action>
<action>For each API:
- Format with method, path, description
- Show entity, action references
- List error references
- Include request/response schema references if available
</action>
<template-output>crud_apis</template-output>
<template-output>domain_apis</template-output>
<template-output>status_apis</template-output>
<template-output>api_schemas</template-output>
</step>

<step n="8" goal="Generate Events & Integrations section">
<action>Load Events sheet</action>
<action>Load External_Systems sheet</action>
<action>For each event:
- Format with name, trigger, payload schema
- List consumers
- Show reliability requirements
- Link to integrations
</action>
<action>For each external system:
- Format with name, type, description
- List integration modes
- Link to APIs and events
</action>
<template-output>events_list</template-output>
<template-output>external_systems_list</template-output>
<template-output>integration_points</template-output>
</step>

<step n="9" goal="Generate Errors & Validation section">
<action>Load Errors sheet</action>
<action>For each error:
- Format with code, message, user_friendly_message
- Show severity, HTTP status
- Link to APIs
- Link to entities
</action>
<action>Extract validation rules from Fields.validation_rules</action>
<template-output>errors_list</template-output>
<template-output>validation_rules</template-output>
</step>

<step n="10" goal="Generate Analytics & KPIs section">
<action>Load Analytics_KPIs sheet</action>
<action>For each KPI:
- Format with name, description, formula
- Link to entities, events
- Show reporting views
- Include thresholds
</action>
<template-output>kpis_list</template-output>
<template-output>reporting_views</template-output>
</step>

<step n="11" goal="Generate User Stories section">
<action>Load User_Stories sheet</action>
<action>For each story:
- Format with story_id, title, narrative
- Show role, goal, benefit
- List preconditions, trigger, postconditions
- Link to pages, APIs, requirements, ACs, entities
- Show priority and status
</action>
<template-output>user_stories_list</template-output>
</step>

<step n="12" goal="Generate Traceability Matrix">
<action>Load Traceability sheet</action>
<action>Group by source type:
- Requirements → Implementation (what implements each requirement)
- Workflows → Components (what components support each workflow)
- User Stories → Requirements/APIs/ACs (what each story covers)
</action>
<action>Format as tables or structured lists</action>
<template-output>requirements_traceability</template-output>
<template-output>workflows_traceability</template-output>
<template-output>stories_traceability</template-output>
</step>

<step n="13" goal="Generate Coverage Summary & Gaps">
<action>Load Coverage_Matrix sheet</action>
<action>Load Uncovered_Aspects sheet</action>
<action>Calculate coverage statistics:
- Requirements coverage: (requirements with linked implementations / total requirements)
- Workflows coverage: (workflows with all components / total workflows)
- User Stories coverage: (stories with ACs / total stories)
- ACs coverage: (ACs linked to tests / total ACs)
</action>
<action>Format coverage matrix as table</action>
<action>List uncovered aspects with severity</action>
<template-output>coverage_matrix</template-output>
<template-output>uncovered_aspects</template-output>
<template-output>requirements_coverage</template-output>
<template-output>workflows_coverage</template-output>
<template-output>stories_coverage</template-output>
<template-output>acs_coverage</template-output>
</step>

<step n="14" goal="Generate Appendices">
<action>Load Reference_Data sheet</action>
<action>Load Background_Jobs sheet</action>
<action>Format reference data with values and linked entities/pages</action>
<action>Format background jobs with schedule and linked entities/APIs/events</action>
<template-output>reference_data_list</template-output>
<template-output>background_jobs_list</template-output>
</step>

<step n="15" goal="Assemble and save master document">
<action>Use {template} structure</action>
<action>Populate all template-output sections</action>
<action>Replace template variables with generated content</action>
<action>Save to {default_output_file}</action>
<output>Spec Ledger Master Document generated!

Saved to: {default_output_file}

This document is the single source of truth for requirements and design, generated from the Spec Ledger.

Next steps:
1. Review the master document
2. Run *sync-ledger-to-bmad-artifacts to sync with PRD/architecture
3. Run *propose-stories-from-ledger to generate story files
</output>
</step>

</workflow>

