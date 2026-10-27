---
name: get-started
description: A read-only first run of Mark. Names the connected workspace, lists every setup step as done, to do or skipped with its link in Mark, and suggests one skill to try next. Use when the user has just installed or connected Mark, runs setup or asks to set up Mark, asks "how do I start?", or wants to see what setup is left.
metadata: { mark-summary: "See your workspace, what setup is left, and which skill to try first." }
---

# Get started

You give a person their first look at Mark: which workspace they're in, what setup is left, and one thing to try next. **This skill only reads.** It changes nothing in the workspace, whatever the person says during it.

## Before you start
- If Mark tools (`get_workspace` and the others) aren't available, stop and tell the user: "Connect Mark first: https://docs.use-mark.com/docs/use-mark-from-ai-agents". Don't call any tool.
- If more than one Mark connection is available (one per workspace, often named like `mark-acme`), use the one for the workspace the user named and stick with it for the whole run. If they didn't name one, ask which workspace.

## Procedure
1. **Read.** Call `get_workspace`, then `get_setup_status`. Say nothing in between: everything below goes in one reply, in this order.
2. **Name the workspace.** Open the reply with the workspace `name` and the person's role, for example "Working in **Astroship**, as an admin." Add that if it's the wrong workspace, they should switch to that workspace's Mark connection if there is one, or else disconnect Mark and sign in again, picking the right one. There is no workspace argument.
3. **Show the setup.** Read `rows` from `get_setup_status`. `ready` and `gaps` leave out skipped rows, so don't rely on them. Show every row, in Mark's order, as a table with four columns: step (`title`), state (done, to do or skipped), what's left (the row's `detail`, for a step that's to do; blank otherwise), and link (`action.url`). If every row is done, say setup is complete.
4. **Suggest one next step.** Pick exactly one skill by the first rule that fits:
   - the "brand_voice" row is to do: **brand-interview**, to set up the brand voice from their own files and a short interview;
   - otherwise, `needsAttention.awaitingReview` from `get_workspace` is above 0: **review**, to go through the posts waiting on them (say how many);
   - otherwise: **plan-week**, to draft next week's posts. If its "market", "social" or "posting_times" row is to do or skipped, say plan-week will ask to set those up first.

   Say what the skill does in one sentence and how to start it (in Claude Code and Cursor, `/mark:‹skill›`; elsewhere, ask for it by name, such as "plan next week's posts"). Start it only if the person asks.

## When the person asks you to change something
Never call a tool that writes, including `skip_setup_step` and `send_setup_checklist`. Hand off instead:
- "Fix that" or "set it up": name the skill that sets up that step, and start it only if they ask. brand-interview sets up "brand_voice"; plan-week sets up "market", "social" and "posting_times"; ai-visibility sets up "buyer_questions"; site-fixes sets up "website", and "web_analytics" when the row's `detail` names Search Console. For any other step, give the row's link in Mark.
- "Skip it": give the row's link in Mark, where they can skip it.

## Rules
- One suggestion only. The person can ask what else Mark does.
- Use Mark's words for each step. Report errors as Mark gives them.
