---
name: keyword-ideas
description: Finds and vets keyword and topic ideas in Mark - from Search Console queries, the saved keyword list, competitor domains and paid keyword research - checks whether the people searching match the target audience, saves the shortlist, and writes a content brief as a draft. Use when the user asks for keyword ideas, SEO topics, what to write about, competitor keywords, or content gaps.
---

# Keyword ideas

You find keywords worth writing for: ones the audience actually searches, that the site can realistically win, and that fit the brand. Some lookups spend provider credit, so batch them and announce them first.

## Before you start
- If Mark tools aren't available, stop and tell the user: "Connect Mark first: https://docs.mark.lifewithdata.org/docs/use-mark-from-ai-agents".
- Call `get_workspace`. Ask for the seed topic, URL or competitor if the user didn't give one. Otherwise start from the brand's pillars.

## Setup
Call `get_setup_status`. When it reports a gap this skill needs, follow its fix:
- Missing market: ask the user for the place and language (never guess). If the place is unclear, `list_market_locations`, then `set_up_market`.
- Missing site: ask for the hostname, then `save_site`.
- Missing LinkedIn/social or Google: `get_connect_link`, give the user the link (connecting stays in the Mark app), then `sync_connections` after they say they're done.

## Procedure
1. **Free sources first** (read-only):
   - `get_brand_context`: personas and pillars, the audience filter.
   - `list_saved_keywords`: what's already saved, tagged, tracked or rejected. Don't re-propose rejected keywords.
   - `get_search_performance`: striking-distance queries (positions 5–20) are the cheapest wins.
2. **✋ Checkpoint: paid research.** `research_keywords` needs an active market in the workspace, or pass `locationCode` / `languageCode` in the call. Plan the paid calls as one batch, for example "`research_keywords` for 2 seeds, `analyze_domain` for 1 competitor". `check_keyword_audience` needs a saved keyword: do not run it on unsaved research results. Ask: **"This uses paid keyword data (‹N› lookups). Go ahead?"** On a yes, run them:
   - `research_keywords` for each seed topic or URL: volume, difficulty, intent.
   - `analyze_domain` for competitors the user names, with `view: "top_pages"` or `"page_keywords"`. Use `refresh: true` only if the user asks for fresh backlinks, since it costs more.

   Skip any refused call and work with what you have.
3. **Shortlist** 5–15 keywords in a table: keyword, volume, difficulty, intent, current position (if any), and pillar. Order them by opportunity: fit first, then position 5–20, then volume ÷ difficulty. Leave paid audience fit until after save.
4. **✋ Checkpoint: save.** Ask: **"Save these ‹N› keywords to Mark? I'll tag them ‹tag› and turn on rank tracking for the top ‹K›."** On a yes, call `save_keywords` once with tags and tracking settings. Don't call `remove_keywords` in this skill. After the shortlist is saved, you may call `check_keyword_audience` on those keywords (ask first if that paid lookup wasn't in the earlier batch). Never call it on unsaved research results.
5. **Brief (optional).** For the best keyword, offer a content brief: search intent, the answer in two sentences, an outline (H2s), questions to cover, internal links, and a CTA. On a yes, `save_post` it as a **draft** (blog channel), not submitted. Blog drafts need `meta.title`, `meta.slug`, and `meta.seo` (with `title` and `description`):

   `save_post({ channel: "blog", body: "…", meta: { title, slug, seo: { title, description } } })`

   Say it's in Mark as a draft for the team.
6. **Summarize:** what was saved and tracked, the brief's link (`appUrl`), and the credit used (number of paid lookups).

## Rules
- Never present volume or difficulty numbers you didn't get from Mark.
- Prefer fewer, better keywords. Explain any "no" verdict in one line.
