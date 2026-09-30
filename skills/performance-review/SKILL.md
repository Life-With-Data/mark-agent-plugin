---
name: performance-review
description: Produces a plain-English marketing performance review from Mark - social engagement by channel, pillar and angle, Google Search results, keyword rankings and AI-assistant visibility, compared with the previous period and KPI targets - and proposes what to do next. Use when the user asks how marketing is going, for a weekly or monthly report, "what worked last month?", or which angles or topics to double down on. Read-only unless the user explicitly accepts a live angle or a live KPI target.
---

# Performance review

You give the team an honest, specific read on what's working, backed by Mark's numbers. This skill is **read-only by default**. Propose next steps in chat. Only write to Mark after an explicit yes, and never as an inactive KPI target.

## Before you start
- If Mark tools aren't available, stop and tell the user: "Connect Mark first: https://docs.use-mark.com/docs/use-mark-from-ai-agents".
- Call `get_workspace` and name the workspace you're reporting on.
- Period: default to the last 30 days against the 30 days before. Use the user's period if they give one ("last week", "Q3").

## Procedure
1. **Pull the numbers** (read-only; run these in parallel if your client allows it):
   - `get_content_performance` for the period, with comparison: reach, engagement and clicks by channel, post, pillar and angle, plus progress against KPI targets.
   - `get_search_performance`: clicks, impressions, position, top movers, striking-distance queries (positions 5–20) and anomalies.
   - `get_rankings`: tracked keyword winners and losers.
   - `get_ai_visibility`: buyer-question coverage, AI search volume, AI-assistant referral traffic.
   - `get_brand_context`: pillars, angles and KPI targets, so you can speak in the team's terms.
   - `search_posts` for published posts in the period, to name the actual top and bottom posts.
2. **Write the review:**
   - **Headline:** three bullets, each with a number and a direction. Example: "LinkedIn engagement +38% vs previous 30 days, led by the ‹angle› angle."
   - **Scorecard:** a table of each KPI target with its current value, target, and on-track/behind status.
   - **What worked / what didn't:** name the posts, pillars, angles and queries. Link posts (`appUrl`).
   - **Search and AI visibility:** movers, striking-distance opportunities, and assistant referrals.
   - **Recommendations:** 3–5 specific next steps, each tied to evidence (for example "Write two posts on ‹query›: position 8, 1.2k impressions, 0.4% CTR").
3. **✋ Checkpoint: proposals.** Propose recommendations in chat. Do not save yet.
   - **Angles:** only after an explicit yes, call `save_strategy_item` with `kind: "angle"`. Required fields include `slug`, `personaId`, and `pillarId` (plus the usual angle fields). Take those IDs from `get_brand_context`.
   - **KPI targets:** they have no inactive state. Passing `active: false` on `kind: "kpi_target"` is silently ignored and the save goes **live**. Recommend setting KPI targets in the Mark UI. Only call `save_strategy_item` with `kind: "kpi_target"` if the user explicitly accepts a **live** KPI target. Never claim an inactive KPI save.
   Never edit or delete existing strategy items in this skill.
4. **Offer next steps:** "Plan next week from this?" (the plan-week skill) or "Dig into keywords?" (keyword-ideas).

## Rules
- Report numbers exactly as Mark returns them, with the period and comparison window. Don't extrapolate or invent benchmarks.
- Keep "no data yet" separate from "zero". If a source isn't connected (for example Search Console), say which connection is missing and that it's set up in the Mark app.
- Keep it short: one screen for the headline and scorecard, with detail below.
- KPI targets have no inactive state. Never pass `active: false` on `kind: "kpi_target"`, and never tell the user you saved a KPI for review.
