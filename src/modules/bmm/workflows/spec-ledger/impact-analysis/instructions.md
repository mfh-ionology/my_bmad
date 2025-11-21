# Impact Analysis - Traverse Traceability for Impact Assessment

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and adapt deeply to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>

<workflow>

<step n="0" goal="Load Spec Ledger and get analysis target">
<action>Check if {spec_ledger_file} exists</action>
<check if="ledger file does not exist">
  <output>⚠️ Spec Ledger not found at {spec_ledger_file}

Please run *analyst-kickoff or *brd-to-spec-ledger first.</output>
  <action>Exit workflow</action>
</check>
<action>Load {spec_ledger_file} JSON</action>
<action>Load Traceability sheet</action>
<ask>What would you like to analyze the impact of? (Provide requirement_id, entity_id, api_id, workflow_id, or page_id)</ask>
</step>

<step n="1" goal="Traverse traceability graph">
<action>Given the target ID, traverse Traceability entries:
- Find all entries where source_id = target OR target_id = target
- Recursively follow relationships:
  - If target is requirement_id → find workflows, entities, pages, APIs, ACs
  - If target is entity_id → find pages, APIs, workflows, user stories
  - If target is api_id → find pages, actions, workflows, user stories
  - If target is workflow_id → find pages, actions, APIs, user stories, ACs
  - If target is page_id → find actions, roles, workflows, user stories
</action>
<action>Build impact tree/graph</action>
</step>

<step n="2" goal="Generate impact report">
<action>Generate impact analysis report:
- Target: {{target_id}}
- Direct impacts: {{direct_impacts_list}}
- Indirect impacts: {{indirect_impacts_list}}
- Affected pages: {{affected_pages}}
- Affected APIs: {{affected_apis}}
- Affected workflows: {{affected_workflows}}
- Affected user stories: {{affected_stories}}
- Affected ACs: {{affected_acs}}
- External systems impacted: {{affected_external_systems}}
- Risk assessment: {{risk_level}}
</action>
<action>Save to {default_output_file}</action>
<output>Impact analysis complete!

Target: {{target_id}}
Impact scope: {{impact_count}} artifacts affected

Report saved to: {default_output_file}

Use this analysis to plan changes and assess risk.
</output>
</step>

</workflow>

