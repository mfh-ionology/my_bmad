# Generate OpenAPI From Ledger - Create OpenAPI Spec from Spec Ledger APIs

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and adapt deeply to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>IDEMPOTENT: Each run overwrites openapi.yaml cleanly based on current Spec Ledger - do not append or duplicate</critical>

<workflow>

<step n="0" goal="Load Spec Ledger and Schema">
<action>Check if {spec_ledger_file} exists</action>
<check if="ledger file does not exist">
  <output>⚠️ Spec Ledger not found at {spec_ledger_file}

Please run *analyst-kickoff or *brd-to-spec-ledger first.</output>
  <action>Exit workflow</action>
</check>
<action>Load {spec_ledger_file} JSON</action>
<action>Load {spec_ledger_schema} to understand structure</action>
</step>

<step n="1" goal="Load required sheets">
<action>Load APIs sheet (primary source)</action>
<action>Load Entities sheet (for request/response schemas)</action>
<action>Load Fields sheet (for entity field details)</action>
<action>Load Errors sheet (for error responses)</action>
</step>

<step n="2" goal="Generate OpenAPI top-level structure">
<action>Create OpenAPI 3.x document structure:

openapi: 3.0.3
info:
  title: {{project_name}} API
  version: 1.0.0
  description: API specification generated from Spec Ledger

paths:
  # Will be populated in next step

components:
  schemas:
    # Will be populated from Entities/Fields
  responses:
    # Will be populated from Errors
</action>
</step>

<step n="3" goal="Generate paths from APIs sheet">
<action>For each API in the APIs sheet:
- Use method (GET, POST, PUT, PATCH, DELETE) and path to create path entry
- Generate operationId from api_id (sanitize for OpenAPI: lowercase, underscores)
- Use description for summary/description
- If entity_id is present:
  - Look up entity in Entities sheet
  - Look up fields in Fields sheet where entity_id matches
  - Generate request/response schemas from entity fields
- If action_id_ref is present, use it as context for operation purpose
- Map API type (CRUD, domain, status, query) to appropriate OpenAPI operation structure
</action>
<action>Group paths by base path to organize the document</action>
</step>

<step n="4" goal="Generate request schemas">
<action>For each API with entity_id:
- If method is POST, PUT, or PATCH:
  - Create requestBody schema from entity fields
  - Map Fields.data_type to OpenAPI types (string, number, boolean, etc.)
  - Include nullable, default, validation_rules as appropriate
  - Use Fields.name as property names
- If method is GET or DELETE:
  - Use path parameters or query parameters as needed
</action>
</step>

<step n="5" goal="Generate response schemas">
<action>For each API:
- Generate success response (200/201/204 based on method):
  - If entity_id present: Use entity schema
  - If GET with entity_id: Return entity object or array
  - If POST/PUT: Return created/updated entity
  - If DELETE: Return 204 No Content
- Generate error responses from Errors sheet:
  - If errors_ref is present in API:
    - Look up each error_id in Errors sheet
    - Create error response with http_status, code, message
    - Include user_friendly_message if available
  - Always include generic 400, 401, 403, 404, 500 responses
</action>
</step>

<step n="6" goal="Generate component schemas">
<action>For each Entity referenced by APIs:
- Create schema in components.schemas
- Use entity_id as schema name (sanitized)
- Map Fields to properties:
  - data_type → OpenAPI type
  - nullable → nullable property
  - default → default property
  - validation_rules → constraints (min, max, pattern, etc.)
  - options → enum if present
</action>
</step>

<step n="7" goal="Generate error response components">
<action>For each Error in Errors sheet:
- Create error response component in components.responses
- Use error_id as component name (sanitized)
- Include http_status, code, message
- Include user_friendly_message in description
</action>
</step>

<step n="8" goal="Add basic security scheme">
<action>Add a generic security scheme stub:
- Use basic authentication or bearer token as default
- Keep it simple and generic
- Do not enforce specific providers
</action>
</step>

<step n="9" goal="Write OpenAPI file">
<action>Format the complete OpenAPI document as YAML</action>
<action>Validate structure is valid OpenAPI 3.x</action>
<action>Write to {openapi_output_file} (overwrite if exists)</action>
<output>OpenAPI specification generated!

APIs processed: {{api_count}}
Schemas generated: {{schema_count}}
Error responses: {{error_response_count}}

OpenAPI spec saved to: {openapi_output_file}

This spec can be used for API documentation, client generation, and contract testing.
</output>
</step>

</workflow>

