# Builder prompt — Eve's Space Growth Copilot

Copy everything between the lines into the app builder (Covey / Enter). Attach the 5 CSV files from `data/`.

---

Build a web app called **"Eve's Space Growth Copilot"** for Eve Gurbazar, owner of Eve's Space, a private, upscale nail studio in Downtown Los Angeles (Russian manicure, Gel-X extensions, structured manicure, pedicure, custom nail art). 3 chairs, open 10 hours/day, 6 days/week (closed Monday).

**The one question the app answers:** "Which marketing actually turns into profitable appointments, and what should I do next week to fill my empty chairs?"

The owner is not a data person. Every screen must lead with a plain-English sentence and one recommended action, and put numbers underneath. Tone: calm, premium, warm. Design: cream background (#F7F1EA), deep wine accent (#7A1F2B), soft blush (#E9C9C3), black text, generous spacing, rounded cards, a serif for headings.

## Data (attached CSVs)
- `appointments.csv`: one row per appointment. Columns: appointment_id, date, client_id, visit_type (first/repeat), acquisition_channel, source_system (Square/ClassPass/Airbnb), service, duration_min, gross_service_revenue, platform_fee, card_processing_fee, tech_commission, supplies_cost, tip, retail_revenue, retail_cogs.
- `clients.csv`: client_id, acquisition_channel, first_visit, zip.
- `marketing_spend.csv`: month, channel, spend_usd, notes.
- `fixed_costs.csv`: item, monthly_usd.
- `capacity.csv`: chairs, open_hours_per_day, open_days_per_week.

**Definitions (use exactly these):**
- Contribution margin (CM) per appointment = gross_service_revenue − platform_fee − card_processing_fee − tech_commission − supplies_cost + retail_revenue − retail_cogs. Tips are pass-through to techs; exclude them from profit.
- CM per chair-hour = CM ÷ (duration_min ÷ 60). This is the key metric, because chair time is the scarce resource.
- Rebook rate (by channel) = share of first-visit clients from that channel who came back at least once.
- CAC = channel spend ÷ first-visit clients from that channel.
- 6-month client value = total CM from a client's first and repeat visits.
- Channel ROI = (CM from clients acquired by the channel − channel spend) ÷ channel spend.
- Utilization = booked minutes ÷ (chairs × open hours × 60 × open days).
- Monthly net = monthly CM − fixed costs − marketing spend.

## Screens

### 1. "This week" (home)
- Top: one-sentence summary, e.g. "You made $2.7k net last month. Your chairs were 46% full. Google and referrals are paying for everything; paid Instagram and influencers are losing money."
- 3 KPI cards: monthly net profit, chair utilization %, new clients who rebooked %.
- "Do this next" list: the 3 highest-impact actions generated from the data (for example: "Pause the next influencer collab ($1.5k) and put $500 into Google Search", "Text the 40 clients from Google who haven't been back in 6+ weeks", "Cap ClassPass to Tuesday–Wednesday mornings"). Each action shows the expected $ effect and a one-click "draft it" button that opens screen 4 or 5 prefilled.

### 2. Channels → Profit (the core screen)
- A table and a horizontal bar chart, one row per acquisition channel: new clients, appointments, CM, CM per chair-hour, rebook rate, spend, CAC, 6-month client value, ROI.
- Color each row green / amber / red by ROI and CM per chair-hour, with a one-line verdict ("Scale", "Keep, organic", "Fix or cut", "Limit to off-peak hours").
- Clicking a channel shows its funnel: first visit → second visit → 3+ visits, its top services, and its top ZIP codes.
- Explicitly call out the "reach trap": channels that bring many first visits but few rebooks (influencer collabs, ClassPass).

### 3. Unified revenue
- Merge Square, ClassPass, and Airbnb into one monthly P&L: gross revenue by stream (services, add-ons, retail) and by source system, minus platform fees, card fees, commissions, supplies, retail COGS, fixed costs, and marketing = net.
- Show margin by service (Russian manicure vs Gel-X vs pedicure, etc.) and by source system, so Eve can see that a ClassPass visit earns a fraction of a direct Square visit.
- Month-over-month trend line for net profit and utilization.

### 4. Goal planner ("How many clients do I need?")
- Inputs: target monthly net profit (slider, default $10,000), planned marketing budget per channel, ClassPass share cap.
- Output: how many extra appointments per month are needed (target gap ÷ average CM per appointment), how many new clients that requires given each channel's rebook rate, the resulting utilization %, and whether it fits in capacity. Show 2–3 scenarios side by side ("Keep current mix", "Shift paid budget to Google + referrals", "Raise prices 8%").
- One sentence verdict: "To reach $10k net you need about 150 more appointments a month, which puts you at about 63% utilization. That's achievable with the 'shift budget' plan in about 3 months."

### 5. Content in Eve's voice
- Eve pastes a voice note transcript, a few past captions, or bullet ideas. The AI writes: one Instagram Reel script (hook, 3 beats, call to action), a caption, a Google Business Profile post, and a short SMS to lapsed clients, all in her voice: first person, warm, expert, slightly direct, focused on nail health and long-lasting results, with no generic "slay queen" AI clichés.
- Every piece ends with a trackable call to action that names a channel code (e.g. "Book with code REEL-NOV" or a UTM link), so future bookings can be attributed back to the content.
- Topic suggestions come from the data: promote the services with the highest CM per chair-hour, and target the ZIP codes and channels with the best rebook rates.

### 6. Ask the Copilot (chat)
- A chat box that answers questions using the data, for example: "Was the August influencer worth it?", "What's my most profitable service per hour?", "If I drop ClassPass, how much do I lose?", "Who should I text this week?". Answers are short, cite the numbers, and end with one recommended action.

## Rules
- Never invent numbers; compute everything from the CSVs. If data is missing, say what's missing.
- Show money as $ with no cents in summaries; show percentages rounded.
- Every screen works on a phone.
- Add a small "Data sources: Square · ClassPass · Airbnb · Marketing log" footer with a "Upload new export" button that accepts the same CSV formats.

---
