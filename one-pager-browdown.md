# Evie for Brow Down Studio — the same growth agent, a second business
**Team 03 · Converge.AI Buildathon · Challenge: "From Creative Guesswork to a Repeatable, Insight-Led Beauty Marketing Engine"**
Live app: https://2362fcb7a83745d2a6479915c6c690ca.prod.enter.pro/ → switch the studio (top-left) to **Brow Down Studio** · AI demo code: `EVE2026`

## The problem
Brow Down Studio runs three businesses in one: a brow/lash/facial studio, the Brow Down Studio Pro product line (e-commerce for pros and consumers) and education. Marketing happens all the time, but campaign direction depends on the founder's creativity and availability: she wrote the entire Fall kit launch herself (11 hours). There is no repeatable way to turn what the market and past campaigns say into the next plan, and no view of whether Brow Down shows up when customers ask Google or an AI assistant.

## What we did
We did not build a second prototype. Evie is multi-tenant: one switch and the same agent serves Brow Down with its own data, voice and three capabilities built for this brief.

- **Campaign Planner (insight → plan → execution).** The founder types one line ("Holiday gift sets, ship by Dec 15, budget $600"). Evie returns the plan: target, audience, channel mix chosen from the campaign learnings ("email drove 68% of the Fall kit orders, TikTok 2%"), an asset list with owner (Founder / Content creator / Social media) and due dates, a 3-week calendar, expected result with the math. Copy is drafted live in the brand voice, and every asset passes a **brand-voice guard** ("On voice" or one suggested fix). "Approve plan" turns each asset into an approval; nothing is published without the founder's yes.
- **Launch retro → learning loop.** When a campaign is marked done, Evie records result vs target and one learning. The next plan cites those learnings. Three past campaigns are seeded: Fall Lamination Kit launch, Lash lift summer, Certification cohort.
- **Discovery: search + AI visibility.** Search Console-style queries with losing-rank alerts ("brow lamination kit" 9 → 14, 5,900 impressions) and three content actions as approvals. Then the new part: 12 questions a customer would ask an AI assistant. "Ask the AI now" sends each to a live model and scores whether Brow Down is mentioned (today: 2–3 of 12). From the misses Evie proposes the fixes: an FAQ page, llms.txt + product schema on browdownstudiopro.com, an aftercare guide.

## Expected business impact (the brief's metrics)
- **Stronger campaign execution:** every launch starts from a plan built on what worked last time, with owners, dates and approvals, instead of an empty page.
- **Team efficiency:** the founder approves; the content creator and social media contributor get a clear asset list. Preparation time drops from hours to minutes.
- **Digital discoverability:** search and AI visibility become a number the team can move, with concrete content actions in the approval queue.

## How it is built
Entirely on Enter (Converge.AI): same React app, same database (every table carries `studio_id`), same `evie-ai` edge function with a new `discovery` mode and studio-aware prompts. Brow Down data is synthetic but realistic (three revenue streams, six channels, three campaigns, seven queries, 12 AI prompts). Shopify / Klaviyo / Search Console exports replace it through Connect.

## Why this matters for the judges
The same agent now runs two different beauty businesses, a nail studio measured on chair-hours and a studio + product + education brand measured on campaigns and discovery, without a second codebase. That is the scalability claim, demonstrated.
