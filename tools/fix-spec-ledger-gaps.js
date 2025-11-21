#!/usr/bin/env node

/**
 * Fix Spec Ledger "gaps":
 * 1) Add spec_ledger_folder/spec_ledger_file to key workflows.
 * 2) Add Spec Ledger mentions to docs/index.md and docs/v4-to-v6-upgrade.md.
 *
 * Run from repo root:
 *   node tools/fix-spec-ledger-gaps.js
 */

const fs = require("fs");
const path = require("path");

const repoRoot = process.cwd();

function patchWorkflowSpecLedgerVars(relPath) {
  const filePath = path.join(repoRoot, relPath);
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] Workflow file not found: ${relPath}`);
    return;
  }

  let text = fs.readFileSync(filePath, "utf8");

  if (text.includes("spec_ledger_folder")) {
    console.log(`[INFO] spec_ledger_* already present in ${relPath}, skipping.`);
    return;
  }

  const marker = "# Output files";
  const idx = text.indexOf(marker);
  if (idx === -1) {
    console.warn(`[WARN] Could not find "${marker}" in ${relPath}, skipping.`);
    return;
  }

  const insertBlock =
    'spec_ledger_folder: "{output_folder}/spec-ledger"\n' +
    'spec_ledger_file: "{spec_ledger_folder}/spec-ledger.json"\n\n';

  const newText = text.slice(0, idx) + insertBlock + text.slice(idx);
  fs.writeFileSync(filePath, newText, "utf8");
  console.log(`[OK] Injected spec_ledger_* vars into ${relPath}`);
}

function appendIfMissing(relPath, marker, block) {
  const filePath = path.join(repoRoot, relPath);
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] Doc file not found: ${relPath}`);
    return;
  }

  let text = fs.readFileSync(filePath, "utf8");

  if (text.includes(marker)) {
    console.log(`[INFO] Marker "${marker}" already present in ${relPath}, skipping.`);
    return;
  }

  // Ensure there is a trailing newline
  if (!text.endsWith("\n")) {
    text += "\n";
  }

  text += "\n" + block.trim() + "\n";
  fs.writeFileSync(filePath, text, "utf8");
  console.log(`[OK] Appended Spec Ledger section to ${relPath}`);
}

// 1) Patch workflows
const workflowsToPatch = [
  "src/modules/bmm/workflows/spec-ledger/coverage-view/workflow.yaml",
  "src/modules/bmm/workflows/3-solutioning/sync-ledger-to-bmad-artifacts/workflow.yaml",
  "src/modules/bmm/workflows/3-solutioning/propose-bmad-stories-from-ledger/workflow.yaml",
];

console.log("=== Patching Spec Ledger workflow variables ===");
workflowsToPatch.forEach(patchWorkflowSpecLedgerVars);

// 2) Patch docs/index.md
const indexMarker = "## Spec Ledger";
const indexBlock = `
## Spec Ledger (BMM)

BMM in BMAD-METHOD v6 includes a **Spec Ledger** as the central design source-of-truth between the PRD and Architecture.

The Spec Ledger stores structured information about:

- Requirements and Workflows
- Entities, Fields, State Models
- Pages, Page Fields, Actions and Page–Actions–Roles
- APIs, Events, Errors and Integrations
- Analytics KPIs, NFRs and Acceptance Criteria
- User Stories, Traceability and Coverage

It is populated and consumed by workflows such as:

- \`analyst-kickoff\`
- \`brd-to-spec-ledger\`
- \`generate-spec-ledger-doc\`
- \`sync-ledger-to-bmad-artifacts\`
- \`propose-bmad-stories-from-ledger\`

This design allows large projects to be handled without keeping the entire PRD in model context; instead, workflows load only the relevant parts of the Spec Ledger.
`;

console.log("=== Patching docs/index.md ===");
appendIfMissing("docs/index.md", indexMarker, indexBlock);

// 3) Patch docs/v4-to-v6-upgrade.md
const upgradeMarker = "## Spec Ledger in v6";
const upgradeBlock = `
## Spec Ledger in v6

BMAD-METHOD v6 introduces the **Spec Ledger** as a new, central concept in the BMM module.

In v4, requirements, data models, UI behaviour and API details were often scattered across multiple documents or implicit in PRD and architecture files. In v6, these details are captured in a unified Spec Ledger, with workbook-style sheets for:

- Requirements, Workflows and State Models
- Entities, Fields, Pages and Page Fields
- Actions, Page–Actions–Roles and APIs
- Events, Errors, Analytics KPIs and NFRs
- User Stories, Traceability and Coverage

New workflows such as \`analyst-kickoff\`, \`brd-to-spec-ledger\`, \`generate-spec-ledger-doc\`, and \`sync-ledger-to-bmad-artifacts\` work together to:

- Parse BRDs into structured requirements and design data
- Maintain end-to-end traceability from BRD to implementation
- Generate PRD, architecture views and frontend specs as **views** of the Spec Ledger

This significantly improves change impact analysis, auditability and the ability to handle large projects without running into model context limits.
`;

console.log("=== Patching docs/v4-to-v6-upgrade.md ===");
appendIfMissing("docs/v4-to-v6-upgrade.md", upgradeMarker, upgradeBlock);

console.log("=== Done. ===");