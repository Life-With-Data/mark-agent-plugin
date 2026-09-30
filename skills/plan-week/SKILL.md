---
name: plan-week
description: Plans the coming week of social posts in Mark from the brand strategy, calendar gaps and recent performance, then writes the drafts and sends them to review. Use when the user asks to plan next week's posts, fill the content calendar, draft a week of LinkedIn, Instagram or X posts, or "what should we post next week?". Requires the Mark connection (MCP tools such as get_workspace).
---

# Plan the week

You turn Mark's strategy (pillars, angles, personas), the open calendar slots, and what worked recently into a week of post drafts that the team reviews in Mark. **Review is part of the job.** Drafts go to review, and nothing is approved unless the user explicitly says so.

## Before you start
- If Mark tools (`get_workspace` and the others) aren't available, stop and tell the user: "Connect Mark first: https://docs.use-mark.com/docs/use-mark-from-ai-agents".
- Call `get_workspace`. Tell the user which workspace you're working in (for example "Working in **Verdella**"). If it's the wrong one, they need to reconnect Mark and pick the right workspace. There is no workspace argument.
- Ask only for what you can't infer. Defaults: next Monday through Sunday in the workspace timezone, every connected channel, and one post per open slot.

## Setup
Call `get_setup_status`. When it reports a gap this skill needs, follow its fix:
- Missing market: ask the user for the place and language (never guess). If the place is unclear, `list_market_locations`, then `set_up_market`.
- Missing site: ask for the hostname, then `save_site`.
- Missing LinkedIn/social or Google: `get_connect_link`, give the user the link (connecting stays in the Mark app), then `sync_connections` after they say they're done.

## Procedure
1. **Gather context** (read-only):
   - `get_brand_context`: voice, pillars, angles, personas, KPI targets.
   - `get_calendar` for the week: scheduled posts and open slots.
   - `get_content_performance` for the last 30 days: top pillars and angles, and weak channels.
   - `get_search_performance`: rising queries and striking-distance topics worth a post.
   - `list_saved_keywords`: tagged topics the team already cares about.
2. **Draft the plan.** For each open slot, give: day and time, channel, pillar, angle, a one-line hook, and why it's there (for example "angle X drove 2× engagement last month"). Balance the pillars across the week, don't repeat an angle on the same channel, and respect existing scheduled posts.
3. **✋ Checkpoint 1: plan approval.** Show the plan as a table and ask: **"Here's the plan for ‹week›. Shall I write these ‹N› drafts? Tell me what to change first."** Don't create anything until the user says yes.
4. **Write each draft:**
   - Call `get_channel_rules` for each channel you're writing for (length, hashtags, links, media) and follow them exactly.
   - For media, `search_assets` then `get_asset` to pick existing images or video. Use `add_asset` only when the user provides a URL or file.
   - Call `save_post` (omit `postId`; set `channel`, `body`, media, angle, pillar, and `scheduledAt` as ISO 8601). It creates a draft and never publishes. Keep the returned `postId` and `rev`.
5. **✋ Checkpoint 2: before review.** Show every draft (channel, time, full text, media). Ask: **"Send these ‹N› drafts to review in Mark?"** Before asking, check each channel's approval mode with `list_channels`. **If any channel auto-approves, say so plainly:** "‹Channel› auto-approves: submitting will schedule it to publish at ‹time› without review." Then call `submit_post` for each confirmed draft and report what each result says (in review, or auto-approved and scheduled).
6. **Approval is the user's call.** Never call `approve_posts` unless the user explicitly says "approve" for specific posts. Then pass each post's current `rev` from `get_post`. **Approved posts publish automatically at their scheduled time.** If the server says a post changed since you read it, call `get_post` again and show the change before retrying.
7. **Finish** with a summary: a table of drafts with status and links (`appUrl`), anything skipped and why, and the next step ("Review them in Mark → Review queue").

## Output format
- The plan and draft lists are Markdown tables: Day, Time, Channel, Pillar/Angle, Hook/Text, Status.
- Use Mark's words for state: draft, in review, approved, scheduled, published, changes requested.

## When things go wrong
- **No open slots:** offer to plan into specific days the user names. To change recurring slots, ask first, then `update_posting_slots`.
- **No performance data yet** (new workspace): plan from pillars and angles only, and say so.
- **A channel is disconnected** (`list_channels` shows `connected: false`): skip it, call `get_connect_link` with that channel, give the user the link, then call `sync_connections` and `list_channels` to confirm after they say they're done. `list_connections` shows integrations, not individual social accounts.
- **A post is locked or already published:** report the error text and move on. Never work around it.
- **Cleanup a draft:** only after an explicit yes. Prefer `archive_post` if they might want it back. `delete_post` is permanent and only works on never-submitted drafts.
- **Don't invent** metrics, testimonials, prices or claims. If a draft needs a fact you don't have, leave a clear `[confirm: …]` placeholder and flag it at Checkpoint 2.
