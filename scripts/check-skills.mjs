#!/usr/bin/env node
// Validates skills/ against the Agent Skills spec and the Mark tool lockfile.
//  - frontmatter: name == folder, [a-z0-9-], ≤64 chars; description 1–1024 chars, no angle brackets
//  - body under 500 lines
//  - every `snake_case` tool reference exists in tools.json (enum values allowlisted below)
// Also checks the JSON manifests parse and agree on name/version/URL. No dependencies.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const errors = [];
const warn = [];
const err = (m) => errors.push(m);

const lock = JSON.parse(readFileSync(join(root, "tools.json"), "utf8"));
const tools = new Map(lock.tools.map((t) => [t.name, t]));
// Enum values that appear in backticks but are not tools.
const NON_TOOLS = new Set(["buyer_question", "kpi_target", "top_pages", "page_keywords", "awaiting_review", "changes_requested"]);

const skillsDir = join(root, "skills");
const skills = readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory());
if (skills.length === 0) err("no skills found");

for (const dir of skills) {
  const file = join(skillsDir, dir, "SKILL.md");
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    err(`${dir}: missing SKILL.md`);
    continue;
  }
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) {
    err(`${dir}: SKILL.md must start with YAML frontmatter`);
    continue;
  }
  const fm = Object.fromEntries(
    m[1].split("\n").filter(Boolean).map((l) => {
      const i = l.indexOf(":");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
  );
  const body = m[2];
  const allowedKeys = new Set(["name", "description", "license", "compatibility", "metadata", "allowed-tools"]);
  for (const k of Object.keys(fm)) if (!allowedKeys.has(k)) err(`${dir}: unknown frontmatter key "${k}"`);
  if (fm.name !== dir) err(`${dir}: name "${fm.name}" must equal folder name`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name ?? "") || (fm.name ?? "").length > 64) err(`${dir}: invalid name`);
  const d = fm.description ?? "";
  if (d.length < 1 || d.length > 1024) err(`${dir}: description must be 1–1024 chars (is ${d.length})`);
  if (/[<>]/.test(d)) err(`${dir}: description must not contain angle brackets`);
  if (/: /.test(d)) err(`${dir}: description contains ": " (breaks plain YAML scalars); rephrase or quote`);
  if (!/\buse when\b/i.test(d)) warn.push(`${dir}: description should say when to use it ("Use when …")`);
  const lines = body.split("\n").length;
  if (lines >= 500) err(`${dir}: body is ${lines} lines (keep under 500; move detail to references/)`);
  if (!/connect mark first/i.test(body)) err(`${dir}: must tell the user how to connect Mark when tools are missing`);
  if (!/✋ Checkpoint/.test(body)) warn.push(`${dir}: no explicit ✋ Checkpoint`);

  const refs = new Set([...body.matchAll(/`([a-z][a-z0-9]*(?:_[a-z0-9]+)+)`/g)].map((x) => x[1]));
  for (const r of refs) {
    if (NON_TOOLS.has(r)) continue;
    const t = tools.get(r);
    if (!t) {
      err(`${dir}: references unknown tool \`${r}\` (not in tools.json)`);
    }
  }
  console.log(`✓ ${dir} (${lines} lines, ${refs.size} tool refs)`);
}

// Manifests agree
const j = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));
const claude = j(".claude-plugin/plugin.json");
const market = j(".claude-plugin/marketplace.json");
const ap = j("plugin.json");
const mcpClaude = j(".mcp.json");
const mcpAp = j("mcp.json");
if (claude.name !== "mark" || ap.name !== "mark") err("plugin name must be \"mark\" in both manifests");
if (market.name !== "mark-gtm") err("marketplace name must be \"mark-gtm\"");
if (claude.version !== ap.version || market.plugins[0].version !== claude.version) err("versions differ across plugin.json / marketplace.json");
const url = lock.server;
if (mcpClaude.mcpServers.mark.url !== url || mcpAp.mcpServers.mark.url !== url) err(`MCP URL must be ${url} in .mcp.json and mcp.json`);

for (const w of warn) console.log(`! ${w}`);
for (const e of errors) console.error(`✗ ${e}`);
console.log(errors.length ? `${errors.length} error(s)` : `All checks passed (${skills.length} skills, ${tools.size} tools in lockfile).`);
process.exit(errors.length ? 1 : 0);
