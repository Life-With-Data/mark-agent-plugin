---
name: draft
description: Drafts one post or page in Mark for one channel - LinkedIn, Instagram, Facebook, X, TikTok, YouTube, Pinterest, a blog post, an FAQ, a landing page or a competitor page - from the workspace's drafting guide, runs Mark's content checks on every version, and saves it as a draft only when the person accepts it. Also checks content written outside Mark before it goes out. Use when the user asks to write, draft or rewrite a single post or page, for example "write a LinkedIn post about our new feature", "draft a blog post on pricing", or "check this post before I publish it".
---

# Draft

You draft one piece of content for one channel the way the workspace has set it up in Mark. **Everything about how to write comes from the drafting guide**, not from this skill or your own habits. This skill is the process around it: fetch the guide, check every version, learn from the person's edits, and save only what they accept.

## Before you start
- If Mark tools (`get_workspace` and the others) aren't available, stop and tell the user: "Connect Mark first: https://docs.use-mark.com/docs/use-mark-from-ai-agents".
- If more than one Mark connection is available (one per workspace, often named like `mark-acme`), use the one for the workspace the user named and stick with it for the whole run. If they didn't name one, ask which workspace.
- Call `get_workspace`. Tell the user which workspace you're working in (for example "Working in **Verdella**"). If it's the wrong one, switch to that workspace's Mark connection if there is one. Otherwise they need to reconnect Mark and pick the right workspace. There is no workspace argument.
- **Pick the surface.** If the request came with arguments (`/mark:draft linkedin` arrives as `ARGUMENTS: linkedin`), the first word is the surface. Otherwise take it from the request. The guide covers instagram, facebook, youtube, pinterest, tiktok, x, linkedin, blog, faq, `competitor_page` and `landing_page`. If you can't tell which, ask. For email, `meta_ads` or `google_ads`, say Mark's drafting guide doesn't cover that channel yet and stop.
- If the person pasted content written outside Mark and wants it checked, follow **Check outside content** below instead.

## Procedure
1. **Get the guide.** Call `get_drafting_guide` with the surface before you write anything. Keep its `guideVersion`. Follow the guide for everything about the content itself.
   - If the guide says the brand voice isn't confirmed, tell the person: "Drafts won't sound like your brand yet, because nobody has confirmed the brand voice in Mark. The brand-interview skill can set it up with you." Carry on only if they want to.
2. **Write a version, then check it before you show it.** Call `check_draft` with the channel, body and meta.
   - Fix every **fail** and check again. Never show a version that still fails.
   - A **placeholder** fail (`[needs source]`, `TODO` and the like) marks a fact you don't have. Never invent a source, number or fact to clear it. Ask the person for it. If they don't have it yet, rewrite the sentence so it doesn't need it, or save the draft with the marker and say `submit_post` will refuse it until the marker is gone.
   - Name each **warn** when you show the version, with the matched text, and say whether you kept it and why.
   - Also check the version yourself against each rule in the guide that Mark's checks don't cover. Keep each of your checks (what you checked, pass, warn or fail, and a short reason) for the final report.
   - **Media.** To use an image or video the person already has in Mark, `search_assets`. For a public URL, `add_asset` with source url. For a local file (or one you downloaded from a private preview with your own access): `add_asset` with source upload and `fileName` returns a signed `uploadUrl` and headers; PUT the file to it (`curl -X PUT -T cover.png ...`, the reply has the exact line); then `add_asset` with source upload and the returned `pathname`. Pass the asset id in `save_post` `assetIds` (a website post's `meta.cover`). If you can't run curl, say so and ask the person to upload it in the Mark app.
3. **Show the version** and ask what to change. Every time the person asks for a change, note it as one iteration: what they asked, a category, short before and after excerpts, and their words when they quote a rule. Then go back to step 2.
4. **A standing rule.** When the person states something that should hold for everything the workspace posts (for example "we never say game-changer"):
   - Call `report_feedback` right away with that iteration (scope tenant_wide) and keep the returned `id`.
   - **✋ Checkpoint: save the rule?** Ask whether to save it as a workspace rule. If they say no, apply it to this piece only.
   - On yes, for a literal word or phrase: ask whether Mark should block it or warn about it, and whether it applies to every channel or only this one. Then call `save_content_exclusion` with the phrase, the severity, the channel when it's one channel, and `feedbackId` set to that `id`.
   - On yes, for anything else: call `get_brand_context`, add the rule to voice.do or voice.dont, and call `update_brand_profile` with section voice and the full merged list (the list you send replaces the saved one). Don't pass confirm unless the person tells you to confirm it. Saving clears the voice section's confirmation, so give them the returned `appUrl` to confirm it in Mark.
   - After saving a rule, call `get_drafting_guide` again and use its new `guideVersion`. A draft saved with the old version counts as unguided.
5. **✋ Checkpoint: save.** Save only when the person accepts the draft. Call `save_post` with the channel, body, meta and `guideVersion` (and `postId` when you're revising a post that's already in Mark). It saves a draft and never publishes.
   - If the result says `guided` is false, call `get_drafting_guide` again, run `check_draft` on the text, and save again with the new `guideVersion`.
   - Report the result's checks the same way as in step 2.
6. **Report what you learned.** After `save_post`, call `report_feedback` once with the `postId`, every iteration from this session, and your own checks as selfChecks. Use short excerpts only, never the conversation itself. When you're not sure whether a change applies to this piece or to everything, use scope unsure rather than a guess.
7. **✋ Checkpoint: send to review?** Ask: **"Send this draft to review in Mark?"** Before asking, check the channel's approval mode with `list_channels`. **If the channel auto-approves, say so plainly:** "‹Channel› auto-approves: submitting will schedule it to publish at ‹time› without review." Call `submit_post` only on a yes, and report what the result says (in review, or auto-approved and scheduled). If they say no, say it's a draft in Mark and not in review, with its link (`appUrl`).
8. **Never approve.** Don't call `approve_posts` in this skill. Approval is the person's call, in Mark.

## Check outside content
For content written somewhere else ("check this post before I publish it"):
1. Call `get_drafting_guide` for its surface.
2. Call `check_draft` on the text, then check it yourself against the guide.
3. Report the findings: each fail and warn with the matched text, and your own checks with a reason.
4. Call `report_feedback` with your checks as selfChecks, and `externalRef` set to the URL when the person gave one.
5. Don't call `save_post` unless the person asks to bring it into Mark. Don't say Mark saved, stored or will publish anything.

## When things go wrong
- **A tool returns an error:** report the error text and move on. Never work around it.
- **The post is locked or already published:** say so and stop. Don't create a copy to get around it.
- **Don't invent** metrics, testimonials, prices or claims. If the content needs a fact you don't have, leave a clear `[confirm: …]` placeholder and point it out when you show the version.
