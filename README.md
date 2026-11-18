# Team03_Evie — Converge.AI Buildathon (Stanford, Nov 2026)

**Evie** is a growth agent for appointment-based beauty businesses, built entirely on **Enter (Converge.AI)**.
It turns marketing activity into profitable appointments: channel → booking → margin per chair-hour → actions the owner approves in one chat.

- Live app: https://2362fcb7a83745d2a6479915c6c690ca.prod.enter.pro/ (AI demo code is in the submission PDF)
- Converge project: https://enter.converge.ai/project/2362fcb7a83745d2a6479915c6c690ca
- Two businesses in one app (studio switcher, top-left): **Eve's Space** (nail studio, Downtown LA) and **Brow Down Studio** (brow/lash studio + Studio Pro products + education).

## Repository layout
| Path | What |
|---|---|
| `app/` | Application source exported from Enter (React + Enter infrastructure: database, auth, storage, edge functions `evie-ai`, `evie-image`) |
| `data/` | Synthetic dataset generator and CSVs for Eve's Space (787 clients, 1,593 appointments, May–Oct 2026) |
| `submission/` | `Team03_Evie.pdf` (5-page write-up), video script |
| `one-pager.md`, `one-pager-browdown.md` | Narrative for each challenge |
| `demo-script.md` | 3-minute demo flow |
| `enter-*.md` | The build briefs sent to Enter, in order (the "source" of a no-code build) |
| `STATUS.md` | Build log, platform caveats, what is live vs planned |

## What is live
Chat-first workspace (Notion-style), Monday Brief, Gap Filler, ad creatives with generated images, Studio content in the owner's voice, merged P&L + PDF report, approvals log, Google Ads / Meta import files, CSV import with full recompute; for Brow Down: Campaign Planner with brand-voice guard, launch retro learning loop, Discovery (search + live AI-visibility check).

## Honest limits
No Google Ads / Meta API on Converge (import files instead). Connectors (Instagram, Gmail, Search Console, Analytics, Calendar) are linked by the owner in the Converge workspace. Demo data is synthetic, built on real fee structures.
