# Mark for AI agents

Connect Claude, ChatGPT, Grok, Cursor, VS Code, Codex, Windsurf and other AI agents to your [Mark](https://mark.lifewithdata.org) workspace. From your agent you can plan and draft posts, send them to review, approve what's waiting on you, check how content and search are performing, see how AI assistants find you, and research keywords. The agent acts as you, in the one workspace you pick when you sign in.

This repo is:
- **the `mark` plugin:** Mark's MCP server plus five skills, for Claude Code, Claude, Cursor, VS Code, Codex, Grok Bot and other clients that read Claude or [Agent Plugins](https://agent-plugins.org) manifests;
- **the `mark-gtm` marketplace** that lists it.

> **Status: preview.** The Mark MCP server (`https://app.mark.lifewithdata.org/mcp`) is rolling out. Until it's live in your workspace, the plugin installs but the connection won't complete.

Full guide: **[Use Mark from AI agents](https://docs.mark.lifewithdata.org/docs/use-mark-from-ai-agents)**

## Skills

| Skill | What it does | Try |
|---|---|---|
| `plan-week` | Plans next week's posts from your pillars, open calendar slots and recent performance, writes the drafts, and sends them to review after you OK them. | "Plan next week's LinkedIn posts." |
| `performance-review` | A plain-English report on social, search, rankings and AI visibility against your KPI targets, with next steps. | "How did marketing do last month?" |
| `ai-visibility` | How AI assistants see you: buyer questions, AI search volume, readiness gaps, and answer-style drafts. | "Do we show up in ChatGPT?" |
| `site-fixes` | A prioritized fix list for your website from Mark's audit, readiness scan and Search Console. Advice only. | "Why isn't our pricing page indexed?" |
| `keyword-ideas` | Finds and vets keywords, saves the shortlist, and writes a brief as a draft. | "Keyword ideas for LinkedIn approval workflows." |

Every skill stops at explicit checkpoints before it creates, sends, spends credit or approves anything. In Claude Code they run as `/mark:plan-week` and so on, or trigger automatically from what you ask.

## Install

Server URL for every client: `https://app.mark.lifewithdata.org/mcp`. On first use you sign in to Mark, **choose a workspace**, and click **Allow**. There are no API keys.

### Claude Code: plugin (MCP + skills)
```bash
claude plugin marketplace add Life-With-Data/mark-agent-plugin
claude plugin install mark@mark-gtm
```
Then run `/mcp`, select **mark**, and choose **Authenticate**. MCP only: `claude mcp add --transport http mark https://app.mark.lifewithdata.org/mcp`.

### Claude (claude.ai, Claude Desktop)
Go to **Settings → Connectors → Add custom connector**, name it `Mark`, paste the URL, choose **Connect**, sign in, and pick your workspace. On Team and Enterprise plans an owner adds it under organization connectors. On plans with plugins, you can add this repo as a plugin marketplace instead to get the skills too.

### ChatGPT
Go to **Settings → Apps & Connectors → Advanced**, turn on **Developer mode**, then choose **Create**. Enter the name `Mark` and the URL, and set authentication to **OAuth**. Sign in and pick your workspace. Add Mark to a chat from the **+** menu. On Business and Enterprise, an admin must allow custom connectors.

### Grok (grok.com)
Go to **grok.com/connectors → New Connector → Custom**, paste the URL, and sign in. On Business and Enterprise, an admin provisions the connector in the xAI console first.

### Grok Bot
Tell your bot: *"Add a custom MCP server called mark at https://app.mark.lifewithdata.org/mcp"*. Confirm, then click **Authorize** on the connect card and pick your workspace. Team admins may need to allow the URL in the MCP allowlist.

### Cursor
[**Add to Cursor**](https://cursor.com/en/install-mcp?name=mark&config=eyJ1cmwiOiJodHRwczovL2FwcC5tYXJrLmxpZmV3aXRoZGF0YS5vcmcvbWNwIn0%3D), or add this to `~/.cursor/mcp.json`:
```json
{ "mcpServers": { "mark": { "url": "https://app.mark.lifewithdata.org/mcp" } } }
```
Then go to **Settings → MCP** and choose **Connect** next to mark. For the skills, see [Skills only](#skills-only-any-agent) below.

### VS Code (GitHub Copilot)
[**Install in VS Code**](https://vscode.dev/redirect/mcp/install?name=mark&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fapp.mark.lifewithdata.org%2Fmcp%22%7D), or add this to `.vscode/mcp.json`:
```json
{ "servers": { "mark": { "type": "http", "url": "https://app.mark.lifewithdata.org/mcp" } } }
```
Choose **Start** above the server entry, then sign in.

### Codex (CLI, IDE extension, app)
```bash
codex mcp add mark --url https://app.mark.lifewithdata.org/mcp
codex mcp login mark
```
Or add this to `~/.codex/config.toml`:
```toml
[mcp_servers.mark]
url = "https://app.mark.lifewithdata.org/mcp"
```

### Windsurf
Add this to `~/.codeium/windsurf/mcp_config.json`, then refresh the MCP panel and sign in:
```json
{ "mcpServers": { "mark": { "serverUrl": "https://app.mark.lifewithdata.org/mcp" } } }
```

### Muse (Meta)
Muse doesn't document MCP support yet. **Muse Code** supports remote MCP servers: add an `mcp_servers` entry named `mark` with transport `streamable_http` and the URL above, then run `muse mcp login mark`. We'll update this section when the Muse app supports custom connectors officially.

### Other MCP clients
Any client that supports remote MCP over streamable HTTP with OAuth works with the URL above.

### Skills only (any agent)
```bash
npx skills add Life-With-Data/mark-agent-plugin
```
The skills need the Mark MCP connection above to do anything.

## Safety

- **Your permissions, one workspace.** The agent can do what you can do in Mark's UI, in the workspace you chose at sign-in, and nothing else. To switch workspaces, reconnect. If you leave the workspace or are removed from it, access stops within 30 seconds.
- **Consequential tools are marked.** Approving a post (approved posts publish at their scheduled time), deleting and paid lookups are annotated as destructive or open-world, so your client asks before running them. Approvals must name the exact revision the agent read. If the post changed since, Mark refuses.
- **Everything is attributed.** Actions show in Mark's review history as yours, "via ‹agent›".
- **Skills add checkpoints.** They ask before drafting, sending to review, spending credit or approving.

## Repository layout

```
.claude-plugin/plugin.json       Claude plugin manifest (name: mark)
.claude-plugin/marketplace.json  Claude marketplace (name: mark-gtm)
.mcp.json                        Claude MCP config (remote HTTP)
plugin.json, mcp.json            Agent Plugins 1.0 manifests (same plugin, other clients)
skills/<name>/SKILL.md           The five skills (Agent Skills format)
tools.json                       Lockfile of Mark MCP tool names, titles and annotations
scripts/check-skills.mjs         Checks skills, tool references and manifests (run in CI)
```

## Development

```bash
node scripts/check-skills.mjs                       # skills + tool names + manifests
npx @anthropic-ai/claude-code plugin validate --strict .claude-plugin/marketplace.json
npx @anthropic-ai/claude-code plugin validate --strict .claude-plugin/plugin.json
npx @anthropic-ai/claude-code plugin validate --strict skills
```
When a tool is added or renamed in Mark, update `tools.json` in the same change, and CI fails if a skill references a tool that doesn't exist. Bump `version` in `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` and `plugin.json` together.

Issues and security reports: see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © Life With Data
