# Evie — demo script (3 minutes)

> **Updated for the chat-first version (Nov 18).** The home screen is now a single conversation: orb, "Good morning, Eve.", Evie's message, three chips, composer. All other screens are under **⋯ More**. Flow: tap "Approve this week's plan" → tap "Fill Thursday's open hours" (Gap Filler card inline) → type the Gel-X note and ask Evie to write a post → ask "Was the August influencer worth it?" → open More → Brief. The sections below still describe each screen's content.

**Before you start:** open https://2362fcb7a83745d2a6479915c6c690ca.prod.enter.pro/ in a fresh tab, desktop width, light mode. Enter the AI demo code `EVE2026` once in Chat beforehand so the dialog does not interrupt the demo. Keep the Studio textarea empty (you will type live).

---

### 0:00 — The problem (Today screen, say it over the hero)
"This is Eve's Space, a premium nail studio in Downtown LA. Six years in, loyal clients, and still: chairs 41% full, October net $590. She spends on Google, Instagram, influencers, ClassPass. Revenue lands in Square, ClassPass and Airbnb. Nobody can tell her which marketing actually becomes a profitable appointment."

"So we built Evie. Evie reads all of it and answers one question: what do I do this week? And nothing posts or spends without Eve's yes."

### 0:30 — Today: the brief, the approvals, the Gap Filler
(After the three actions, scroll to Gap Filler.) "And this is the part no salon tool does: Thursday 1:30 is empty. Evie already picked the five clients whose Gel-X fill is due, and wrote each of them a message for that exact hour. Marketing from inventory, not from budget."
Point at the headline, then the four KPIs, then "Do this next".
"Three actions, each with its expected effect. Pause the influencer collab and move $1,500 to Google and referral rewards: plus $1,900 a month. Text 173 loyal clients who have not been back in six weeks. Cap ClassPass to Tuesday–Wednesday mornings."
Click **Approve** on action 1. "It goes to the approvals queue, and because Google Ads has no API connector, Evie hands Eve a ready-to-import campaign file instead of pretending to launch."

### 1:00 — Channels: the reach trap
Click **Channels**. Toggle the chart to **CM per chair-hour**.
"Chair time is the scarce resource, so we measure margin per chair-hour. Google: $38. ClassPass: $4. And here is the reach trap: influencers brought 77 new clients, six came back. $5,500 spent, $4,708 returned."

### 1:25 — Money: one P&L
Click **Money**. Point at the trend and the merged P&L.
"Square, ClassPass and Airbnb merged into one statement. Net fell from $5.5k to $590 while revenue fell 23%. The fix is utilization, not price."

### 1:45 — Plan: how many clients do I need
Click **Plan**. Drag the target slider to $10,000.
"About 190 more appointments a month, 63% utilization, within capacity. The recommended scenario shifts paid budget to Google and referrals."

### 2:05 — Studio: content in Eve's voice (live AI)
Click **Studio**. Set service **Gel-X Extensions**, audience **Lapsed loyal clients**. Type: `Thursday wide open, Gel-X holds 4 weeks if I prep the nail right, no drilling the natural nail, I want my regulars back before the holidays`. Click **Write**.
While it writes (2–4 s): "Eve talks, Evie writes: a Reel, a caption, a Google post and an SMS, in her voice, each with a booking code so content is measured by bookings, not likes." Read the Reel hook aloud. Click **Approve draft**.

### 2:30 — Brief: the Monday letter (live AI)
Click **Brief**. "Every Monday Eve gets a letter from Evie: what happened, what Evie did, what she proposes, three taps to approve. She runs the business from a letter, not an admin panel." Click **Approve all eligible**.

### 2:40 — Chat: ask anything (live AI)
Click **Chat**, click the chip **Was the August influencer worth it?**
Read the answer: "No. −$792." "Every answer ends with one next step and an Approve button."

### 2:50 — Close
Click **Connect**.
"Eve uploads her Square export and every number recomputes. Instagram, Gmail, Search Console and Calendar connect with her own accounts. Approving the three actions on Today is worth about $3,100 net a month, and the same model works for any salon, spa or clinic with limited chairs."

---


---

## Part 2 (extra challenge) — Brow Down Studio, 60 seconds
Switch the studio (top-left text button) to **Brow Down Studio**. "Same agent, second business, zero new code. Converge asked us to take on Brow Down Studio this morning."

**0:00 — Home.** "Good afternoon, René." Evie already says: the Fall kit added $4,700, 'brow lamination kit' slipped from 9 to 14, the holiday launch has no plan.
**0:10 — Campaign Planner.** Tap **Plan the holiday gift set launch**. The plan appears: 90 orders / $8,000 target, channels chosen from the last launch ("email drove 68%, TikTok 2%"), three assets with owner and due date, each copy line written live and checked **On voice**. "From creative guesswork to a plan with owners, in one line. Approve plan → every asset becomes an approval."
**0:35 — Discovery.** More → Discovery. Click **Ask the AI now**. 12 customer questions go to a live model; the score updates ("2 of 12 · Checked just now"). "This is AI-search visibility as a number the team can move, and the misses become content actions."
**0:55 — Close.** "Every table carries a studio_id. A third beauty business is a data import, not a rebuild."

### If something breaks
- AI shows "Using example": the fallback is pre-written and still on-message; keep going. Regenerate once if there is time.
- Demo code dialog appears: type `EVE2026`, Continue.
- Prefer light mode on a projector; night mode is a nice closing flourish if time allows (toggle bottom-left).

### Judge questions you can expect
- **Is the data real?** Synthetic, built on real fee structures (40% commission, Square 2.9% + $0.30, ClassPass ~55% payout). A real Square export replaces it in one upload on Connect.
- **Does it launch ads?** No. No Google Ads/Meta connector exists on Converge, so Evie produces Google Ads Editor and Meta bulk-import files plus a checklist. We would rather be honest than fake a launch.
- **What is live vs. planned?** Live: all screens, planner, import, AI chat and content, approvals, ad files. Planned: owner OAuth for Instagram, Gmail, Search Console, Analytics, Calendar (connectors wired, she clicks Connect).
- **Why only built on Converge?** Front end, database, auth, storage, edge function and AI all run on Enter; Framia can generate visuals for posts next.
