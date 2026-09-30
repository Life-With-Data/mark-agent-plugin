---
name: site-fixes
description: Turns Mark's site audit, AI-agent readiness scan and Google Search Console data into a prioritized, plain-English fix list for the website owner - indexing problems, broken pages, missing structured data, slow pages - with the evidence for each. Use when the user asks what's wrong with their website, why a page isn't indexed or ranking, for an SEO or technical audit, or what to fix first. Advice only; Mark never edits the site.
---

# Site fixes

You produce a short, prioritized fix list that a developer or site owner can act on, with evidence from Mark. **Mark never changes the website.** Your output is advice.

## Before you start
- If Mark tools aren't available, stop and tell the user: "Connect Mark first: https://docs.use-mark.com/docs/use-mark-from-ai-agents".
- Call `get_workspace`, then `list_sites`. Use the primary site unless the user names another.

## Setup
Call `get_setup_status`. When it reports a gap this skill needs, follow its fix:
- Missing market: ask the user for the place and language (never guess). If the place is unclear, `list_market_locations`, then `set_up_market`.
- Missing site: ask for the hostname, then `save_site`.
- Missing LinkedIn/social or Google: `get_connect_link`, give the user the link (connecting stays in the Mark app), then `sync_connections` after they say they're done.

## Procedure
1. **Read what's there** (read-only):
   - `get_site_audit`: score, issues by severity, affected pages, the fix plan, and the audit date.
   - `check_site_readiness`: a fresh scan of robots, llms.txt, structured data and speed.
   - `get_search_performance`: pages losing clicks, and queries with high impressions but low CTR.
   - For specific pages the user cares about, or top pages with problems: `inspect_url`, which asks Google whether the page is indexed and why. It uses the workspace's Google quota, so inspect at most 5 URLs unless asked.
2. **✋ Checkpoint: fresh audit.** If the audit is older than 14 days or missing, ask: **"The last audit is from ‹date›. Run a fresh crawl? It costs about $0.075 and takes a few minutes."** On a yes, call `run_site_audit`, tell the user it's running, and poll `get_site_audit` sparingly (every minute or two, at most 10 times). Otherwise continue with the existing audit and state its date.
3. **Prioritize** with this order: blocks indexing > loses existing traffic > blocks AI agents > everything else. Within each tier, order by traffic at stake.
4. **Write the fix list** (at most 10 items). Each item gives:
   - **Issue:** plain English, no jargon without a gloss.
   - **Where:** the URL(s).
   - **Evidence:** the audit check, the Search Console numbers, or the `inspect_url` verdict.
   - **Fix:** one or two sentences a developer can act on.
   - **Effort:** S, M or L.
5. **Re-indexing (optional).** After the user says fixes are live:
   - Suggest requesting indexing in Google Search Console for the key URLs. That's done in Search Console; Mark can't do it.
   - **✋ Checkpoint:** ask **"Tell Bing and other IndexNow engines that these ‹N› URLs changed? This can't be recalled."** Only call `submit_urls_to_indexnow` on a yes.
6. **Close** with the top three fixes restated, and when to re-check (after the next audit, or run `run_site_audit` again once the fixes are deployed).

## Rules
- Never claim a fix will produce a specific ranking or traffic change.
- Quote the audit date and the data period with every number.
- If Search Console isn't connected, say which insights are missing. Call `get_connect_link`, give the user the link, then `sync_connections` after they say they're done.
