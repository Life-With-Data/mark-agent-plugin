# Submission checklist

Where Mark's plugin and MCP server get listed, and what each listing needs.
**Nothing is submitted without Anthony's explicit OK.** Items marked **TODO(Anthony)** need a decision or an asset from him.

Status (2026-09-29): `tools.json` is 63 tools, matching the live MCP server. Still blocked on the prod Clerk configuration and the TODOs below.

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
Portal: cursor.com/marketplace/publish (open-source repo, manual review; updates are reviewed too). Docs: [plugins](https://cursor.com/docs/plugins), [plugin reference](https://cursor.com/docs/reference/plugins).
- [x] **Which manifest Cursor reads.** `.cursor-plugin/plugin.json`. Cursor looks for `.cursor-plugin/plugin.json`, then `.claude-plugin/plugin.json`, then `plugin.json`, and uses the first it finds (MRK-1060). It names `skills: "./skills/"`, `rules: "./rules/"` and `mcpServers: "./.mcp.json"`, so Cursor and Claude Code share one MCP config. `.cursor-plugin/marketplace.json` (`mark-gtm`) lists the one plugin for team marketplace import.
- [x] Kebab-case name: **`mark`**. Description, author, homepage, repository, license and version match `.claude-plugin/plugin.json` (`check-skills.mjs` enforces version and name, and that every path in the Cursor manifest exists).
- [x] **Local install tested (2026-10-23, MRK-1060).** With the repo at `~/.cursor/plugins/local/mark`, Cursor loaded the plugin, its 8 skills and the `mark.mdc` rule, and started the `mark` MCP server from `.mcp.json`, which asked for OAuth. Still to do by hand: Connect, the consent screen, the tool list and one read-only call (see MRK-1060).
- [x] Listing assets: logo `assets/logo.svg` (Mark's square icon from the design system brand kit), the description from the manifest, and the README. Cursor doesn't require screenshots. If the form asks, upload them there; CI rejects binary files in this repo.
- [ ] Reviewer test account (shared prerequisite above, MRK-1004).
- [ ] Submit. **Anthony's OK required.**

## 4. OpenAI plugin directory (ChatGPT and Codex)
Portal: OpenAI Platform, Plugins (ZIP upload, automated checks, domain verification, review, then the owner publishes). Docs: [submission](https://developers.openai.com/plugins/deploy/submission), [submission errors](https://developers.openai.com/plugins/deploy/submission-errors), [auth](https://developers.openai.com/plugins/build/auth), [guidelines](https://developers.openai.com/plugins/plugin-guidelines). Tracked in MRK-1061.

**What the package is.** The root Agent Plugins `plugin.json` with OpenAI's listing, review and publication fields under `extensions.com.openai`, root `mcp.json` (the same `https://app.use-mark.com/mcp`), `skills/` and `assets/logo.svg`. With `extensions.com.openai` present, OpenAI ignores `.codex-plugin/`, and the portal generates the Codex files, so one listing covers ChatGPT and Codex. There is no `.codex-plugin/`, no `apps`, no hooks, no `onboardingSkill`, no screenshots (Mark has no custom UI) and no `auth` block in `mcp.json`: ChatGPT finds Clerk through the server's protected-resource metadata and registers itself through DCR or CIMD. The sync job's root `plugin.json` bump covers this listing too.

**Build the ZIP** from the repo root. It holds only `plugin.json`, `mcp.json`, `skills/` and `assets/`, with no hidden files:
```bash
node scripts/check-skills.mjs && v=$(node -p 'require("./plugin.json").version') && rm -f "mark-$v.zip" && zip -qrX "mark-$v.zip" plugin.json mcp.json skills assets -x '.*' '*/.*' && unzip -l "mark-$v.zip"
```
OpenAI needs a new semver on every upload. Build from a version the sync job has bumped, not a reused one. `*.zip` is gitignored.

- [x] Listing fields in `extensions.com.openai.interface`: name, short and long description, developer, category, capabilities, the four HTTPS listing URLs, 3 default prompts, brand color (Navy `#16245A`), `logo` and `composerIcon` (`./assets/logo.svg`).
- [x] Review cases: 5 positive, 3 negative, every `tools_triggered` name in `tools.json` (`check-skills.mjs` enforces this, and that the image paths exist). Positive cases read or save an idea only, so an `org:member` reviewer can run them without publishing.
- [x] `publication.countries: []` (no country restriction) and `release_notes`.
- [x] No `clientSecret`, `test_credentials`, `reviewer_instructions` or non-empty `headers` in either manifest (`check-skills.mjs` enforces this). Reviewer credentials go only in the portal's **Review details**.
- [ ] ChatGPT custom MCP server connect test (Plugins → + → Add custom MCP server → OAuth): Clerk sign-in, workspace picker, tool list, one read-only call, still connected after the access token expires, and with a Business, Enterprise or Edu account a confirmed approval that shows "via" ChatGPT's client name. Evidence goes on MRK-1061.
- [ ] Demo recording URL (`review.demo_recording_url`): required for review. Record the 5 positive cases in the reviewer workspace, then add the URL here or in the portal.
- [ ] Reviewer account: MRK-1004's production user in the Astroship workspace, as `org:member`, with no MFA, email codes or magic links. Submission waits until MRK-1004 is Done.
- [ ] Domain verification: `https://app.use-mark.com/.well-known/openai-apps-challenge` must return the portal's token as plain text. That route lands in the mark repo only once Anthony has the token.
- [ ] Upload, automated checks with no blocking findings, submit. **Anthony's OK required** for each step, and again before publishing.

## 5. Other directories (later)
- [ ] **xAI / Grok connectors:** custom connectors work today; check for a public directory.
- [ ] **Muse platform** (muse.ai/platform, "Existing MCP", OAuth with PKCE): Muse's MCP support is not documented officially. Verify before submitting.
- [ ] **Agent Plugins registries** (VS Code/Copilot, Codex, Kiro, Hermes, Grok Bot): the root `plugin.json` and `mcp.json` are schema-valid (CI checks this). Submit where a registry exists.
- [ ] **Skills directories** (`npx skills` / skills.sh): works from GitHub without a listing.

## Release process
1. Bump `version` in all five manifests: `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` (plugin entry and metadata), `plugin.json`, `.cursor-plugin/plugin.json` and `.cursor-plugin/marketplace.json` (plugin entry). Mark's sync job does this after each production deploy.
2. Update `tools.json` if the server's tools changed. `node scripts/check-skills.mjs` must pass.
3. Tag `vX.Y.Z` and write short release notes.
