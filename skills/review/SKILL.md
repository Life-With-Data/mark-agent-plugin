---
name: review
description: Shows posts in Mark and records the reviewer's decision on each - approve, request changes with a note, or reject - only after the person chooses. Lists what's waiting on review, opens any post by description, and says what blocks or informs approval (open claim flags, checks to look at, the site draft, when it goes out). Use when the user asks what's waiting on their review, wants to see or check a post ("show me Friday's LinkedIn post"), or wants to approve, send back or reject posts.
---

# Review

You help a person look at posts in Mark and decide on them. **The decision is always theirs.** You find the post, show it, say what matters for the decision, ask, and then record exactly what they chose.

## Before you start
- If Mark tools (`get_workspace` and the others) aren't available, stop and tell the user: "Connect Mark first: https://docs.use-mark.com/docs/use-mark-from-ai-agents".
- Call `get_workspace`. Tell the user which workspace you're working in (for example "Working in **Verdella**"). If it's the wrong one, they need to reconnect Mark and pick the right workspace. There is no workspace argument.

## Procedure
1. **Find the posts.**
   - A post they named ("the pricing page", "Friday's LinkedIn post"): call `search_posts` with text, channel or dates. If several match, list them and ask which.
   - Otherwise, call `search_posts` with status `in_review` (the review queue).
   - Show a table: channel, scheduled time, first line, link (`appUrl`). If the queue is empty, say so and stop.
2. **Show each post** the person wants to look at with `show_post`, one at a time. In Claude and ChatGPT it draws a preview with Approve, Request changes and Reject buttons; other clients get the text, so show the body. Then say, briefly:
   - the channel and when it goes out. **Approving publishes at its scheduled time**; for a website post, say the next CMS step the result names.
   - open claim flags, word for word. Mark refuses to approve until they're resolved.
   - the checks still to look at (`revisionChecks` that didn't pass), with the matched text.
   - for a website post, the draft on their site (`website.previewUrl`), when there is one.
3. **✋ Checkpoint: the decision.** Ask: **"Approve, request changes, or reject ‹post›?"** Never choose for the person, and never treat "looks good" about one post as a decision on another. If they already decided with the preview's buttons, don't ask again: say what they decided.
4. **Record what they chose:**
   - Approve: `approve_posts` with the post and the `rev` from `show_post` or `get_post`. Only the posts they named.
   - Request changes or reject: `review_post` with the decision and a note in the person's own words. If they didn't say what to change or why, ask; the note is required.
   - A remark that isn't a decision ("tell Sam the hook is great"): `comment_on_post`. It doesn't change the post.
   - If Mark says the post changed since you read it, call `get_post` again, show what changed, and ask again.
   - If Mark refuses because the channel is admins only, say so. Don't retry.
5. **Finish** with a table: post, decision, the status Mark reports, link. For a post sent back, the next step is a revision: `/mark:draft` can rewrite it.

## Reading versus showing
`show_post` is for the person looking at a post. For reads you do yourself, such as checking several posts' media or blockers, re-reading after a stale rev, or gathering what a task needs, use `get_post`, which draws nothing. `search_posts` already gives each post's `mediaCount`, so "posts without an image" needs no per-post read.

## Rules
- Use Mark's words for state: draft, in review, approved, scheduled, published, changes requested, rejected.
- Report errors as Mark gives them. Never work around a refusal.
- Don't edit a post during review. Revising is the draft skill's job.
