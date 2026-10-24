# Mark for AI agents

Connect Claude, ChatGPT, Grok, Cursor, VS Code, Codex, Windsurf and other AI agents to your [Mark](https://www.use-mark.com) workspace. From your agent you can plan and draft posts, send them to review, approve what's waiting on you, check how content and search are performing, see how AI assistants find you, and research keywords. The agent acts as you, in the one workspace you pick when you sign in.

This repo is:
- **the `mark` plugin:** Mark's MCP server plus its skills, for Claude Code, Claude, ChatGPT, Cursor, VS Code, Codex, Grok Bot and other clients that read Claude, Cursor or [Agent Plugins](https://agent-plugins.org) manifests;
- **the `mark-gtm` marketplace** that lists it.

The Mark MCP server (`https://app.use-mark.com/mcp`) is live. **105 tools.** Sign in, pick a workspace, click Allow.

Full guide: **[Use Mark from AI agents](https://docs.use-mark.com/docs/use-mark-from-ai-agents)**

## Skills

The skill list, what each one does and example prompts: **[Add Mark skills and the plugin](https://docs.use-mark.com/skills-and-plugin)**.

Skills are authored in [Life-With-Data/mark](https://github.com/Life-With-Data/mark) (`apps/app/plugin/skills`) and synced here with a version bump after each Mark release. Edit them there, not here.

Every skill stops at explicit checkpoints before it creates, sends, spends credit or approves anything. In Claude Code they run as `/mark:plan-week` and so on, or trigger automatically from what you ask.

## Tools

105 tools on the live server (`tools.json`), in these groups:

- Workspace and brand
- Strategy and brand
- Content: posts, review, calendar
- Assets
- Performance
- Keywords and competitors
- Websites and site health
- AI visibility
- Connections
- Connections and setup

## Install

Server URL for every client: `https://app.use-mark.com/mcp`. On first use you sign in to Mark, **choose a workspace**, and click **Allow**. There are no API keys.

### Claude Code: plugin (MCP + skills)
```bash
claude plugin marketplace add Life-With-Data/mark-agent-plugin
claude plugin install mark@mark-gtm
```
Then run `/mcp`, select **mark**, and choose **Authenticate**. MCP only: `claude mcp add --transport http mark https://app.use-mark.com/mcp`.

### Claude (claude.ai, Claude Desktop)
Go to **Settings → Connectors → Add custom connector**, name it `Mark`, paste the URL, choose **Connect**, sign in, and pick your workspace. On Team and Enterprise plans an owner adds it under organization connectors. On plans with plugins, you can add this repo as a plugin marketplace instead to get the skills too.

### ChatGPT
Until Mark is listed in ChatGPT's plugin directory, add it as a custom MCP server. Go to **Plugins**, choose **+**, then **Add custom MCP server**. Paste the URL, choose **OAuth**, sign in to Mark, pick your workspace, and choose **Create as a plugin**. Full tool access (drafting, approving and other changes) needs a ChatGPT Business, Enterprise or Edu workspace on the web. On Business, only admins and owners can add a custom MCP server.

### Grok (grok.com)
Go to **grok.com/connectors → New Connector → Custom**, paste the URL, and sign in. On Business and Enterprise, an admin provisions the connector in the xAI console first.

### Grok Bot
Tell your bot: *"Add a custom MCP server called mark at https://app.use-mark.com/mcp"*. Confirm, then click **Authorize** on the connect card and pick your workspace. Team admins may need to allow the URL in the MCP allowlist.

### Cursor: plugin (MCP + skills)
Until Mark is listed in the Cursor Marketplace, install the plugin as a local plugin:
```bash
git clone https://github.com/Life-With-Data/mark-agent-plugin ~/.cursor/plugins/local/mark
```
Restart Cursor (or run **Developer: Reload Window**). Then go to **Settings → MCP**, choose **Connect** next to mark, sign in, and pick your workspace. The plugin adds the skills and a rule that tells Cursor's agent when to use Mark. To update, run `git pull` in that folder.

### Cursor: MCP only
[**Add to Cursor**](https://cursor.com/en/install-mcp?name=mark&config=eyJ1cmwiOiJodHRwczovL2FwcC51c2UtbWFyay5jb20vbWNwIn0%3D), or add this to `~/.cursor/mcp.json`:
```json
{ "mcpServers": { "mark": { "url": "https://app.use-mark.com/mcp" } } }
```
Then go to **Settings → MCP** and choose **Connect** next to mark. This gives the tools without the skills. For the skills, use the plugin above or [Skills only](#skills-only-any-agent) below.

### VS Code (GitHub Copilot)
[**Install in VS Code**](https://vscode.dev/redirect/mcp/install?name=mark&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fapp.use-mark.com%2Fmcp%22%7D), or add this to `.vscode/mcp.json`:
```json
{ "servers": { "mark": { "type": "http", "url": "https://app.use-mark.com/mcp" } } }
```
Choose **Start** above the server entry, then sign in.

### Codex (CLI, IDE extension, app)
```bash
codex mcp add mark --url https://app.use-mark.com/mcp
codex mcp login mark
```
Or add this to `~/.codex/config.toml`:
```toml
[mcp_servers.mark]
url = "https://app.use-mark.com/mcp"
```

### Windsurf
Add this to `~/.codeium/windsurf/mcp_config.json`, then refresh the MCP panel and sign in:
```json
{ "mcpServers": { "mark": { "serverUrl": "https://app.use-mark.com/mcp" } } }
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
.cursor-plugin/plugin.json       Cursor plugin manifest (name: mark)
.cursor-plugin/marketplace.json  Cursor marketplace (name: mark-gtm)
.mcp.json                        MCP config for Claude and Cursor (remote HTTP)
plugin.json, mcp.json            Agent Plugins 1.0 manifests (same plugin, other clients);
                                 plugin.json's extensions.com.openai is the ChatGPT/Codex listing
skills/<name>/SKILL.md           The skills (Agent Skills format), synced from Mark
rules/mark.mdc                   Cursor rule: when to use Mark (agent-requested)
assets/logo.svg                  Plugin logo
tools.json                       Lockfile of 105 Mark MCP tool names, titles and annotations
scripts/check-skills.mjs         Checks skills, tool references and manifests (run in CI)
```

## Development

```bash
node scripts/check-skills.mjs                       # skills + tool names + manifests
npx @anthropic-ai/claude-code plugin validate --strict .claude-plugin/marketplace.json
npx @anthropic-ai/claude-code plugin validate --strict .claude-plugin/plugin.json
npx @anthropic-ai/claude-code plugin validate --strict skills
```
Mark's CI opens a pull request here after each production deploy that syncs `skills/` and `tools.json` and bumps `version` in `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `plugin.json`, `.cursor-plugin/plugin.json` and `.cursor-plugin/marketplace.json` together. CI fails if a skill, rule or OpenAI review case references a tool that doesn't exist, a manifest's version drifts, a listing image is missing, or a manifest carries secrets or server headers.

Issues and security reports: see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © Life With Data
