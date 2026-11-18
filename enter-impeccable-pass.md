Design pass "impeccable": make Evie feel crafted, alive and interactive, like an Awwwards site, while staying minimal. Keep every feature, number and the data layer. Budget: one pass. Work screen by screen in this order and stop when done: Home, Brief, Approvals, Studio, Connect.

## Principles (apply everywhere)
- One idea per screen. Each page opens with one display line (Instrument Sans 500, 56–72px desktop / 40px mobile, tracking -0.035em, line-height 1.02) and one muted subline. Nothing else above the fold except the primary action.
- Rhythm: 8px grid; section gaps 72px desktop / 48px mobile; card padding 28px; max content width 760px on reading screens, 1040px on tables.
- Hierarchy by weight and size only: ink 500/600 for what matters, muted 400 for the rest. No labels in caps, no helper sentences under buttons, no "Demo data" except the footer.
- Interaction: everything that can be touched responds within 120ms. Buttons scale 0.98 on press; chips get an ink underline on hover; cards lift 1px with shadow on hover; list rows highlight on hover. Page transitions: 240ms fade + 8px rise. Respect prefers-reduced-motion.
- The orb is alive: slow breathing (6s), subtle hue drift (rose → peach → lavender over 18s), and it reacts: pulses once when Evie starts writing, glows brighter while streaming, settles when done.
- Streaming text appears word by word with a soft fade on each word (not a typewriter cursor).
- Numbers count up once when they enter the viewport.
- Approve actions: the button fills with the accent, a 400ms checkmark draws, the row collapses upward, the More badge pulses once. Toast: frosted glass, bottom center, 2.4s.
- Empty states and errors never show raw messages ("Request failed: 503"). Show one calm line in Evie's voice: "I couldn't reach my notes just now. Try again in a moment." with a retry link.

## Home
- The home must look like a magazine cover: orb top-left, display greeting, Evie's two sentences in 20px, three chips, composer. Max 680px. Composer pinned to the bottom on desktop with a 24px gradient fade above it.
- Chips are the only color on the page besides the orb: ink text, white, hairline; the recommended one has a rose dot.
- The "Ask about…" row becomes a single muted line of text links separated by middots.

## Brief
- The letter is typeset like a letter: 20px body, 1.6 line-height, max 640px, generous margins, date in muted small caps-free text at the top, "— Evie" sign-off with the small orb. One letter visible, older ones collapsed under "Earlier letters".
- "Actions for your review" becomes three rows inside the letter's flow, each with a single rose "Approve" text button; "Approve all" is the only filled button on the page.
- Remove the delivery-preference card; make it a single switch line at the bottom: "Email me this every Monday 8:00".

## Approvals
- Title "Your approval comes first." stays. Remove the subline. Filters become a single underline segmented control. Rows: title 17px 500, effect in muted, status as a 6px dot (rose = needs you, ink = approved, muted = done), one "Approve" text button per row, swipe-to-approve on mobile.
- Remove "How Evie counts" from this page (keep it in More).

## Studio
- Two columns on desktop become one focused column: the textarea (large, 20px placeholder, auto-growing), then service and audience as chips in one row, then "Write" as the only filled button. The drafts appear below as a single card with a segmented control (Reel · Caption · Google · SMS · Ad). Prewritten examples collapse into a "Start from an example" link.
- Content calendar becomes a compact 4-week strip (one row per week, posts as dots with titles on hover) above the "Content → bookings" table.

## Connect
- Remove the setup checklist card and the sign-in block. One display line "Connect your studio." and one subline. Cards in a 3-column grid (1 on mobile): brand mark 28px, name, one line, one button. Imports first, accounts second. "Try with sample export" and "Reset to demo data" as text links under the imports.

## More menu
- Keep only Brief, Studio, Approvals, Connect. Render it as a bottom sheet on mobile and a 280px popover on desktop, items 17px, the Approvals count as a rose dot.

## Quality bar
- Mobile first; every screen fits without horizontal scroll; tap targets ≥ 44px.
- Lint and TypeScript pass. No new dependencies. Then stop.
