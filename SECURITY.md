# Security

## Reporting a vulnerability
Please report security issues privately. **Do not open a public GitHub issue.**

- Email: **anthony@lifewithdata.org**
- Or use GitHub's private vulnerability reporting: **Security → Report a vulnerability** on this repository.

We aim to acknowledge reports within 2 business days.

## Scope
- This repository: plugin manifests, skills, and CI.
- The Mark MCP server at `https://app.use-mark.com/mcp`: OAuth 2.1 via Clerk, access tokens bound to that URL (audience) and to one workspace, and live membership checks.

## How the plugin handles data
- The plugin contains no code that runs on your machine and no secrets. It points your AI client at Mark's MCP server and adds skill instructions.
- Authentication is standard OAuth in your AI client. Mark never sees your AI client's credentials, and your client never sees your Mark password.
- Privacy policy: **https://www.lifewithdata.org/privacy**
- Terms: **https://www.lifewithdata.org/terms**
