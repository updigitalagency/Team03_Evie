Major upgrade of Evie. Keep the product name Evie, the subtitle "for Eve's Space", the human-in-the-loop promise "Nothing posts or spends without your yes", and the agent threads (Strategy, Ads, Local Search, Social, Influencers, Clients). Replace everything else: new premium design, a real home screen, real analytics, a goal planner, a content studio and an approvals queue. Replace all demo numbers with the dataset below so every number in the app is consistent.

## 1. DESIGN SYSTEM (apply everywhere)
- Feel: a private, upscale Downtown LA nail studio. Calm, editorial, expensive. Think a luxury beauty brand's annual report, not a SaaS dashboard.
- Colors: background ivory #FBF8F5; surfaces white #FFFFFF; primary deep wine #7A1F2B (buttons, active nav, key numbers); secondary dusty pink #E8C4BC and blush tint #F6E7E3 (chips, highlights, soft cards); text charcoal #1E1A1B; muted text #6F6468; success #2E7D5B; warning #B8860B; danger #B3261E. Thin borders #EDE4E0. No pure grey, no beige-brown.
- Typography: headings in a high-contrast serif (Fraunces or Playfair Display via Google Fonts), body in Inter. Big numbers in the serif at 40–56px with tight letter-spacing.
- Components: rounded-2xl cards with 1px border and a very soft shadow; pill chips; wine primary button with ivory text; ghost secondary button; status badges (Needs your yes / Approved / Scheduled / Done).
- Motion: subtle. Cards fade-up on load (120ms stagger), numbers count up once, charts animate in. Nothing bouncy.
- Layout: desktop = left sidebar (220px) with the Evie mark, nav, and the "Nothing posts or spends without your yes" line at the bottom; mobile = bottom tab bar with 5 tabs. Max content width 1120px. Every screen opens with a one-sentence plain-English headline in the serif, then one recommended action, then the numbers.
- Charts: Recharts, wine for the hero series, dusty pink for secondary, muted for the rest. Horizontal bars for channels, area line for trends. Tooltips on hover. Legend only when needed.

## 2. NAVIGATION
Today · Channels · Money · Plan · Studio · Chat · Approvals (Approvals shows a badge with the pending count).

## 3. DATASET (embed as JSON constants in one file, src/data/demo.ts; derive everything from it, never hard-code numbers in components)
Studio: 3 chairs, open 10 h/day, 26 open days/month (closed Monday) = 46,800 chair-minutes per month. Fixed costs $7,860/month (rent 6,500, utilities 420, software 210, insurance 380, cleaning 350). Tech commission 40%. Square card fee 2.9% + $0.30. ClassPass pays the studio about 55% of list price. Period: May–Oct 2026.

Channels (6-month totals). new = first-visit clients, appts = all appointments from clients acquired by that channel, cm = contribution margin, cmPerHour = cm per chair-hour, rebook = share of new clients who came back, spend = marketing spend, cac = spend ÷ new:
| channel | new | appts | cm | cmPerHour | rebook | spend | cac | verdict |
| Google Search | 103 | 575 | 29786 | 38 | 0.48 | 2700 | 26 | Scale |
| Referral | 52 | 410 | 21685 | 38 | 0.46 | 0 | 0 | Scale: launch a referral reward |
| Instagram Organic | 79 | 324 | 17107 | 39 | 0.42 | 0 | 0 | Keep: feed it with Studio content |
| Influencer Collab | 77 | 83 | 4708 | 37 | 0.08 | 5500 | 71 | Reach trap: pause |
| Instagram Paid Ads | 59 | 74 | 3866 | 39 | 0.24 | 7200 | 122 | Losing money: cut |
| Airbnb Experiences | 30 | 33 | 1030 | 25 | 0.10 | 0 | 0 | Keep small |
| ClassPass | 87 | 94 | 384 | 4 | 0.08 | 0 | 0 | Limit to off-peak |

Monthly series (gross revenue, contribution margin, marketing spend, net after fixed costs, utilization, appointments):
2026-05: 34495, 15027, 1650, 5517, 0.53, 310
2026-06: 33026, 14503, 3450, 3193, 0.51, 290
2026-07: 31882, 14132, 1650, 4622, 0.49, 286
2026-08: 30587, 13387, 3850, 1677, 0.47, 269
2026-09: 22804, 9917, 1650, 407, 0.35, 204
2026-10: 26574, 11600, 3150, 590, 0.41, 234
Marketing spend detail: Instagram Paid Ads $1,200 every month; Google Ads $450 every month; Influencer collabs $1,800 (Jun), $2,200 (Aug), $1,500 (Oct).

By source system (cm per chair-hour, cm per visit, visits): Square direct 38, 53, 1469 · Airbnb 23, 29, 30 · ClassPass 4, 4, 94.
By service (visits, cm per chair-hour, list price): Pedicure 217, 40, $90 · Gel-X Extensions 355, 37, $115 · Russian Manicure 573, 37, $95 · Structured Manicure 335, 35, $85 · Natural Nail Care 113, 33, $65 · Custom Nail Art add-on +$30, +20 min, raises cm per hour by about $4.
Clients: 787 total, 173 loyal clients (2+ visits, from Google / Referral / Instagram Organic) have not visited in 6+ weeks. Average contribution margin per appointment $49. Average 6-month value of a Google client $289, Referral $417, Influencer $61, ClassPass $4.

Definitions to show in a small "How Evie counts" drawer: CM = revenue − platform fee − card fee − tech commission − supplies (+ retail margin). CM per chair-hour = CM ÷ hours of chair time, because chair time is the scarce resource. Rebook = came back at least once. CAC = spend ÷ new clients. Net = CM − fixed costs − marketing. Utilization = booked minutes ÷ 46,800. Tips are pass-through and excluded.

## 4. SCREENS

### Today (home)
- Headline (serif): "October net was $590. Your chairs were 41% full. Google and referrals carry the studio; paid Instagram and influencers are losing money."
- Sub-line: "Two approvals are waiting. Approve them and Evie estimates +$3,100 net next month."
- 4 KPI tiles: Net profit (Oct) $590 with a small 6-month sparkline; Utilization 41%; New-client rebook 34%; Lapsed loyal clients 173.
- "Do this next" — 3 action cards, each with title, why (one line with the numbers), expected effect, and buttons Approve / Edit / Skip:
  1. "Pause November's influencer collab, move $1,500 to Google Ads + referral rewards" — why: influencer clients rebook 8%, Google clients 48%; CAC $71 vs $26 — effect: +$1,900 net/month in 90 days.
  2. "Text 173 loyal clients who haven't visited in 6+ weeks with a 2-week Gel-X slot offer" — why: a returning loyal client is worth $53 per visit — effect: if 20% rebook, +$1,800 CM this month. Button "Draft it" opens Studio with the SMS prefilled.
  3. "Cap ClassPass to Tue–Wed 10:00–13:00" — why: ClassPass earns $4 per chair-hour vs $38 direct; it currently takes peak slots — effect: +$900/month when those slots fill with direct bookings.
  Approving moves the card to the Approvals queue as Approved and shows a quiet toast "Approved. Evie will schedule this. Nothing goes out without your yes."
- "This week's openings": a 6-day strip (Tue–Sun) with open chair-hours per day (e.g. 6, 4, 9, 3, 2, 5) and which service Evie suggests promoting for each gap.

### Channels
- Headline: "Google brings in $38 per chair-hour and 48% of its clients come back. ClassPass brings in $4."
- Horizontal bar chart of CM per channel (wine), with a toggle: CM · CM per chair-hour · Rebook rate · CAC.
- Table with all columns from the dataset and a colored verdict pill per row (green Scale, pink Keep, amber Limit, red Cut).
- "Reach trap" callout card: influencer collabs brought 77 new clients and 6 came back; cost $5,500, returned $4,708. Paid Instagram: cost $7,200, returned $3,866.
- Clicking a row expands: funnel first visit → rebooked, 6-month client value, mini monthly trend for that channel.

### Money
- Headline: "Net profit fell from $5,500 in May to $590 in October while revenue fell 23%. The fix is utilization, not price."
- Area chart: gross revenue, contribution margin, net (3 series) by month; second small chart: utilization by month.
- Unified P&L table for October with all sources merged: gross service revenue, retail, − platform fees, − card fees, − tech commission, − supplies, = contribution margin, − fixed costs, − marketing, = net. Show a "Sources: Square · ClassPass · Airbnb · Marketing log" line.
- Two side-by-side cards: "Margin per chair-hour by source" (Square $38, Airbnb $23, ClassPass $4) and "Margin per chair-hour by service" (Pedicure $40 … Natural Nail Care $33, with the note that Nail Art add-on raises it by ~$4).

### Plan (goal planner)
- Headline: "How many clients do you need?"
- Inputs: target net per month (slider $2,000–$15,000, default $10,000); budget sliders for Google Ads, Instagram Paid, Influencers, Referral rewards; ClassPass cap (slots per week); price change (−10%…+15%).
- Live outputs: extra appointments needed per month = (target − current net) ÷ $49; new clients needed = extra appointments ÷ blended rebook factor; resulting utilization; fits capacity yes/no; months to reach at current pace.
- Three scenario cards side by side: "Keep current mix", "Shift paid budget to Google + referrals" (recommended), "Raise prices 8%" — each with net/month, utilization, new clients needed, and a verdict line. Make the recommended one wine-outlined.
- Verdict sentence under the sliders, e.g. "To reach $10,000 net you need about 190 more appointments a month, which puts you at 63% utilization. With the shift plan that is about 4 months away."

### Studio (content in Eve's voice)
- Headline: "Say it once. Evie writes it in your voice."
- Left: textarea "Paste a voice note, a few old captions or bullet ideas", a service picker (defaults to the highest margin-per-hour service with an open slot), audience picker (New clients nearby / Lapsed loyal clients / Instagram followers), and a "Write" button.
- Right: generated set with tabs: Reel script (hook, 3 beats, CTA), Caption, Google Business post, SMS to lapsed clients. Each ends with a trackable code, e.g. "Book with code REEL-NOV" or "Reply YES to hold a slot (code TEXT-NOV)". Each has Approve & schedule / Edit / Regenerate. Approving adds it to Approvals.
- Voice rules shown as a small card: first person, warm, expert, slightly direct, about nail health and long-lasting results, no "slay queen" clichés, no emoji walls.
- Provide 3 pre-written, genuinely good example outputs (demo mode) so the screen is impressive without a live model: a Gel-X reel for lapsed clients, a Russian manicure Google post for Downtown LA professionals, and a referral-reward SMS.
- "Content → bookings" mini table: last 4 posts with code, views, bookings, CM (demo numbers, e.g. REEL-OCT1 12.4k views 9 bookings $470).

### Chat
- Keep the current chat with Evie and the six agent threads, but restyle them to the new design and upgrade the canned answers to use the dataset. Suggested chips: "Which channel is making money?", "Was the August influencer worth it?", "What's my most profitable service per hour?", "If I drop ClassPass, how much do I lose?", "Who should I text this week?", "I want a full December".
- Each answer: one sentence with the number, a small card (bars, table or list), one recommended action with an Approve button.
- "Was the August influencer worth it?" → "No. It cost $2,200, brought 24 new clients and 2 came back. Contribution margin $1,419, so −$781 net, and the clients it brought are worth $61 each vs $289 from Google."
- "If I drop ClassPass" → "You lose about $64 of margin a month, and free about 15 chair-hours a month at peak times. Filling a third of those with direct bookings is worth about $190."

### Approvals
- Queue of everything Evie proposed: title, type (Spend / Message / Post / Schedule), expected effect, status badge, time. Filters: Needs your yes / Approved / Scheduled / Done. Bulk approve. Empty state: "Nothing waiting. Evie will ask before anything goes out."
- Seed with 2 pending, 3 approved, 4 done items so the screen looks alive.

## 5. RULES
- Every number must come from src/data/demo.ts. If two screens show the same metric they must match.
- Mobile first: bottom tabs, cards stack, charts resize, tables become stacked rows.
- Keep the footer line "Demo data · Square · ClassPass · Airbnb · Marketing log".
- Keep the app fast and dependency-light: React, Tailwind, Recharts, lucide icons.
- Use realistic micro-copy, no lorem ipsum, no placeholder images. Use the Evie mark (a small four-point sparkle in wine) as the logo.
