---
name: ai-visibility
description: Checks how AI assistants such as ChatGPT, Perplexity, Gemini and Claude see the business in Mark - buyer questions, AI search volume, assistant referral traffic and site readiness for AI agents - and turns the gaps into buyer questions to track and answer-style content drafts. Use when the user asks about AI search, AEO or GEO, "do we show up in ChatGPT?", LLM visibility, or which questions buyers ask assistants.
---

# AI visibility

You explain where the business stands in AI-assistant answers and what to do about it: track the right buyer questions, fix readiness blockers, and draft content that answers those questions directly.

## Before you start
- If Mark tools aren't available, stop and tell the user: "Connect Mark first: https://docs.mark.lifewithdata.org/docs/use-mark-from-ai-agents".
- Call `get_workspace` and name the workspace.

## Procedure
1. **Current state** (read-only):
   - `get_ai_visibility`: tracked buyer questions and suggestions, AI search volume, AI-assistant referral traffic, readiness, and answer-engine results where available.
   - `get_brand_context`: personas, pillars and existing buyer questions.
   - `list_sites`, then for the primary site: `get_site_audit` for issues that block crawlers and agents, and `check_site_readiness` for a fresh scan of robots, llms.txt, structured data and speed.
2. **Report:**
   - Visibility today: questions tracked, estimated AI volume, and assistant referrals (with period).
   - Readiness blockers: the top 3, each with the page and the fix in one sentence. Mark never edits the website, so fixes are advice for whoever owns the site.
   - Gaps: high-intent questions the personas would ask that aren't tracked or answered on the site.
3. **✋ Checkpoint: new buyer questions.** Propose up to 10 questions in the buyer's own words. Ask: **"Track these ‹N› buyer questions in Mark?"** On a yes, call `save_strategy_item` with `kind: "buyer_question"` for each.
4. **✋ Checkpoint: paid refresh.** `refresh_ai_volume` spends provider credit. Ask: **"Re-estimate AI search volume for your buyer questions? This is a paid lookup."** Only call it on a yes. Otherwise use the existing figures and say how old they are.
5. **Answer content (optional).** For the top 1–3 gaps, offer an FAQ or blog answer draft. For each accepted one:
   - `get_channel_rules` for the channel (usually blog);
   - `save_post` to create a draft that answers the question in the first two sentences, then supports it. For the blog channel, set `body` plus `meta.title`, `meta.slug`, and `meta.seo` (with `title` and `description`).

   **✋ Checkpoint:** show the drafts and ask **"Send these to review?"** before `submit_post`. Never approve them.
6. **Summarize:** what you tracked, what you drafted (with `appUrl` links), readiness fixes for the site owner, and when to check again (for example after the next weekly readiness scan).

## Rules
- Don't claim rankings or mentions inside specific assistants unless `get_ai_visibility` returns them. Say "not measured yet" instead.
- Buyer questions can be retired (`save_strategy_item` with `active: false`) but not deleted.
- Keep advice specific: page, issue, fix.
