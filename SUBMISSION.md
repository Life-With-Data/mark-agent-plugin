# Submission checklist

Where Mark's plugin and MCP server get listed, and what each listing needs.
**Nothing is submitted without Anthony's explicit OK.** Items marked **TODO(Anthony)** need a decision or an asset from him.

Status (2026-09-29): `tools.json` is 56 tools, matching the live MCP server. Still blocked on the prod Clerk configuration and the TODOs below.

## Shared prerequisites (every listing)
- [ ] MCP server live at `https://app.use-mark.com/mcp` (prod), with OAuth working end to end from Claude, ChatGPT and Cursor.
- [ ] Prod Clerk configured to mirror dev (see `clerk-prod-changes.md` in the controller workspace): DCR, CIMD, PKCE, `default_scopes` with `user:org:read`, JWT access tokens, `aud` claim. Decide whether CIMD is open or an allowlist. **TODO(Anthony): approve the prod Clerk changes.**
- [ ] Public docs page live: https://docs.use-mark.com/docs/use-mark-from-ai-agents
- [x] **Privacy policy URL.** https://www.lifewithdata.org/privacy. Terms: https://www.lifewithdata.org/terms. The policy must cover data accessed through MCP (workspace content, analytics, and what AI clients receive).
- [x] **Security / support contact.** anthony@lifewithdata.org (in `SECURITY.md` and `author.email`).
- [ ] **Reviewer test account. TODO(Anthony):** a dedicated **prod** Clerk user in a demo organization with populated data (posts in every status, performance data, a site with an audit, saved keywords, buyer questions). Don't use the Playwright dev user.
- [ ] Logo/icon (square PNG or SVG) and short and long descriptions, approved by Anthony.
- [ ] `tools.json` matches the live server (`mark-mcp tools --expect tools.json` from the test client passes).

## 1. Claude Directory: plugin
Portal: claude.ai/directory/manage (plugin submission). Docs: [pre-submission checklist](https://claude.com/docs/plugins/pre-submission-checklist.md), [submit](https://claude.com/docs/plugins/submit.md).
- [x] Kebab-case name without reserved words (`claude`, `anthropic`, `official`, `plugin`, `mcp`, `test`): **`mark`**
- [x] `.claude-plugin/plugin.json` with `description`, `version`, `author`, `homepage`, `repository`, `license`
- [x] `.claude-plugin/marketplace.json` (`mark-gtm`); entry name equals the manifest name
- [x] `.mcp.json` remote server with `type: "http"` and an HTTPS URL. It's the **same URL as the connector listing**, so users with both don't get duplicate tools.
- [x] README ≥40 words; LICENSE (MIT)
- [x] No `.DS_Store`, secrets, binaries or files over 256 KiB; fewer than 512 files (CI enforces this)
- [x] `claude plugin validate --strict` passes (CI)
- [x] Repo is public
- [ ] Data-handling answers, privacy policy URL, support contact (TODOs above)
- [ ] Test the install from GitHub in Claude Code (`claude plugin marketplace add Life-With-Data/mark-agent-plugin`, then `claude plugin install mark@mark-gtm`, then `/mcp`), and in Claude Desktop/Cowork where plugins are available
- [ ] Submit. **Anthony's OK required.**

## 2. Claude Directory: connector (the MCP server itself)
Same portal, separate submission. Docs: [review criteria](https://claude.com/docs/connectors/building/review-criteria.md), [authentication](https://claude.com/docs/connectors/building/authentication.md).
- [ ] OAuth 2.1 with PKCE. The PRM (RFC 9728) at `/.well-known/oauth-protected-resource/mcp` lists the Clerk issuer.
- [ ] Callback allowed: `https://claude.ai/api/mcp/auth_callback` and `https://claude.com/api/mcp/auth_callback` (DCR/CIMD registrations carry these; verify on prod)
- [ ] Every tool has a `title` and explicit `readOnlyHint`/`destructiveHint` (plus `idempotentHint`/`openWorldHint`). Read and write are separate, there's no catch-all tool, names are ≤64 chars, and descriptions contain no injection-style wording. The inventory snapshot test in the mark repo enforces this.
- [ ] Reasonable response sizes (≤~10k tokens) and plain-English errors
- [ ] First-party domain (`app.use-mark.com`) ✅
- [ ] Tested with MCP Inspector and as a custom connector in claude.ai; the box test client transcripts are attached
- [ ] Public docs, privacy policy and reviewer account (see above)
- [ ] Submit. **Anthony's OK required.**

## 3. Cursor Marketplace
- [ ] Confirm Cursor's current plugin submission path, and whether it reads `.claude-plugin/` or the Agent Plugins manifests (`plugin.json` and `mcp.json` at the root; both are present)
- [ ] Test the install from GitHub in Cursor (MCP connect, skills visible)
- [ ] Listing assets: icon, description, screenshots
- [ ] Submit. **Anthony's OK required.**

## 4. Other directories (later)
- [ ] **OpenAI / ChatGPT apps directory:** needs the Apps SDK review; custom connectors in Developer mode work without a listing.
- [ ] **xAI / Grok connectors:** custom connectors work today; check for a public directory.
- [ ] **Muse platform** (muse.ai/platform, "Existing MCP", OAuth with PKCE): Muse's MCP support is not documented officially. Verify before submitting.
- [ ] **Agent Plugins registries** (VS Code/Copilot, Codex, Kiro, Hermes, Grok Bot): the root `plugin.json` and `mcp.json` are schema-valid (CI checks this). Submit where a registry exists.
- [ ] **Skills directories** (`npx skills` / skills.sh): works from GitHub without a listing.

## Release process
1. Bump `version` in `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` (plugin entry and metadata) and `plugin.json`.
2. Update `tools.json` if the server's tools changed. `node scripts/check-skills.mjs` must pass.
3. Tag `vX.Y.Z` and write short release notes.
