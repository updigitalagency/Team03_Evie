# Evie — the growth copilot that keeps Eve's Space booked
**Team 03 · Converge.AI Buildathon · Challenge: "From Marketing Activity to Profitable Appointments"**
Live app: https://2362fcb7a83745d2a6479915c6c690ca.prod.enter.pro/ · Built on Enter (Converge.AI) · AI demo code: `EVE2026`

## The problem
Eve's Space is a premium nail studio in Downtown LA with a loyal base after six years, yet its chairs are only 41% full and net profit fell from $5.5k in May to $590 in October. Marketing runs across Google, Instagram, influencers, ClassPass and Airbnb; revenue sits in Square, ClassPass and partner payouts. Nobody can answer the one question that matters: **which marketing turns into profitable appointments, and what should I do this week?**

## What Evie does
Evie connects **channel → booking → margin per chair-hour** and turns it into actions the owner approves with one tap. Nothing posts or spends without her yes.

**Why this is not another SaaS dashboard.** Evie is an agent that runs the studio's week and is measured by one number: filled chair-hours. Three things no salon tool does today:
- **Gap Filler:** marketing driven by inventory, not budget. For every open slot Evie picks the five clients whose service and rhythm fit it and drafts a personal offer for that exact hour.
- **Monday Brief:** a weekly letter from Evie: what happened, what she did, what she proposes, three taps to approve. The owner runs the business from a letter, not an admin panel.
- **Reach-trap detector:** came-in vs came-back per channel, so influencer spend that brings 77 clients and keeps 6 gets cut.

| Screen | What it answers |
|---|---|
| **Today** | Plain-English brief, 4 KPIs, "Do this next" with expected $ effect, goal tracker, this week's open chair-hours and the Gap Filler offers for each |
| **Brief** | The Monday letter, generated live from the numbers, with per-item approvals |
| **Channels** | CAC, rebook rate, ROI and **contribution margin per chair-hour** per channel; the reach trap; Instagram posts ranked by saves/reach; local search queries; inquiry → booking funnel |
| **Money** | Square + ClassPass + Airbnb merged into one P&L; margin by source and by service; 6-month trend; transaction triage (94% auto-categorized) |
| **Plan** | "I want $10k net a month": appointments and new clients needed, resulting utilization, three scenarios side by side |
| **Studio** | Live AI writes Reels, captions, Google Business posts and SMS **in Eve's voice**, each with a trackable booking code; 4-week content calendar with a publishing-consistency score |
| **Chat** | Ask anything: "Was the August influencer worth it?" → "−$792. It brought 24 clients and 2 came back. Pause it." |
| **Approvals** | Every proposed spend, message, post and schedule change, with status and a log |
| **Connect** | Square/ClassPass/Airbnb CSV import (recomputes every screen), Instagram, Gmail, Search Console, Analytics, Calendar |

## What the data shows (6 months, May–Oct 2026)
- Google ($26 CAC, 48% rebook) and referrals (46% rebook) carry the studio: $38 contribution per chair-hour.
- Paid Instagram cost $7,200 and returned $3,866. Influencer collabs cost $5,500 and returned $4,708 with an 8% rebook rate.
- A ClassPass visit earns **$4 per chair-hour** versus $38 direct, and it takes peak slots.
- Three approvals on the Today screen are worth about **+$3,100 net per month**: move the influencer budget to Google and referral rewards, text 173 lapsed loyal clients, cap ClassPass to Tue–Wed mornings.
- Reaching $10k net needs about 190 more appointments a month, which takes utilization to 63%, within capacity.

## Expected business impact (the brief's metrics)
- **Profitable appointment growth:** new-client bookings, rebook rate, occupancy, CAC and repeat visits are tracked per channel, and budget moves are approved with their expected effect.
- **Consistent, authentic marketing:** content takes seconds instead of hours, in the owner's voice, and every piece carries a booking code so it is measured by bookings rather than likes.
- **Financial visibility:** one merged P&L, margin by stream and by service, and a live goal tracker instead of manual reconciliation.

## How it is built and what is real today
- Built entirely on **Enter (Converge.AI)**: React front end, Enter infrastructure for the database, owner sign-in, storage and the `evie-ai` edge function; AI on Gemini 3.5 Flash through Enter AI.
- **Live now:** every screen, the goal planner, CSV import with recompute, AI chat and content generation, ad creatives with generated images (Enter AI image model), PDF report, approvals log, Google Ads Editor / Meta bulk-import files for approved spend, Gmail send flow (gated until the owner connects Gmail).
- **Owner connects next:** Instagram, Gmail, Google Search Console, Analytics and Calendar via Enter connectors (OAuth on her own accounts). Google Ads and Meta have no connector, so Evie ships ready-to-import campaign files and a launch checklist rather than faking a launch.
- **Demo data** is synthetic but realistic (787 clients, 1,593 appointments, real fee structures: 40% tech commission, Square 2.9% + $0.30, ClassPass ~55% payout). A Square export replaces it in one upload.

## Broader application, demonstrated
Evie is multi-tenant: the same app also runs **Brow Down Studio** (Converge's extra challenge) with its own data, Campaign Planner, launch-retro learning loop and search + AI-discovery visibility. Switch studios top-left. Details: one-pager-browdown.md. The channel → booking → margin model fits any capacity-limited, appointment-based business; a product + education brand needed only new data and two pages.
