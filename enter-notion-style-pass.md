Design pass: Evie must look like a Notion / Victor AI product, not a generated template. Reference: a white app window floating on a soft lavender-to-violet glow, left sidebar with # channels, Inter-like type, one segmented pill control, hairlines, zero decoration. Keep every feature, both studios, all cards and the data layer. Replace the visual system completely; remove the previous rose/peach/orb hero style except the tiny orb avatar.

## Canvas
- Page background: white at the top fading to a soft glow at the bottom: linear-gradient(180deg, #FFFFFF 0%, #F7F5FF 45%, #D9D2FF 75%, #7E6BFF 100%), fixed, very slow 20s drift. Night mode: #0F0F12 to #2A2452.
- The app is one white window: max-width 1180px, min-height calc(100vh - 64px), margin 32px auto, border-radius 20px, 1px solid rgba(0,0,0,.06), shadow 0 24px 80px rgba(60,40,140,.12). On mobile the window is full-bleed with no radius.

## Type and color
- Font: Inter (system fallback -apple-system). Body 15px/1.55, ink #1B1B1F, muted #8B8B93, hairline #ECECF1. Titles 17px/600. Display text only for the greeting (28px/600, tracking -0.01em). No Instrument Sans, no gradient text, no colored chips.
- One accent for primary actions: #6B5BFF (violet). Rose stays only for "needs you" dots. Buttons: 13px/500, 8px radius, 32px tall; primary filled violet, secondary white with hairline. Press scale .98, hover bg #F4F3FA.

## Layout (desktop)
- Left sidebar 260px, hairline on the right, padding 16px. Top: "Eve's Space ▾" (studio switcher, 15px/600, chevron) as the workspace name. Below: section label "Channels" (13px muted, with a caret) then channels in Slack/Notion style with a muted "#": for Eve's Space: # today, # approvals, # bookings, # money, # content, # ads; for Brow Down: # today, # campaigns, # discovery, # approvals, # money, # content. Active channel: bg #EEEBFF, ink text. Below channels, 4 greyed placeholder rows (skeleton pills) like the reference. Sidebar bottom: the owner's avatar initial + name (opens Profile sheet) and a gear (Settings sheet).
- Main column: header 56px with "# today ▾" on the left (15px/600) and on the right ONE segmented pill (bg #F2F1F8, radius 999, 36px): "Chat · Profile · Settings" with small icons; the selected segment is white with a hairline and a soft shadow. Profile and Settings open as the right-side sheets built in the previous pass; Chat returns to the thread.
- Each channel IS the chat, filtered: # today = the full thread; # approvals shows the approvals card first; # money the money card; etc. Posting in any channel posts to Evie; the channel only decides which card opens the thread. The thread never navigates away.
- Thread: Notion-like blocks. Evie messages: 20px orb avatar, name "Evie" 13px/600 + time muted, then the text 15px; cards are flat blocks with hairline dividers and 12px radius, no shadows, 20px padding; tables inside cards are Notion tables (hairlines, 13px, muted headers, right-aligned numbers). Approvals as Notion to-dos: a square checkbox, the title, muted effect on the right; checking = approve with a 200ms fill.
- Composer: bottom of the main column, white, 1px hairline, radius 12px, placeholder "Message Evie, or type / for actions"; typing "/" opens a Notion-style slash menu: /plan, /ad, /post, /report, /approvals, /fill (Eve) or /campaign, /discovery (Brow Down). Send icon violet.
- Chips after answers: 13px, white, hairline, radius 999, hover bg #F4F3FA.
- Mobile: sidebar becomes a top "# today ▾" dropdown listing the channels; the pill becomes two icons.

## Motion
- 160ms ease-out on hover/press; thread messages fade+rise 6px; sheets slide 240ms; respect prefers-reduced-motion.

## Remove
- Hero orb, the big greeting block with chips as a landing (the greeting becomes Evie's first message in # today with its 3 chips), the "Demo data" line (move to Settings), any gradient on text or buttons, the Build-with-Enter badge if it is ours.

## Quality bar
Both studios, every card still works; lint + TypeScript pass; no new dependencies (Inter via system or a single Google Fonts link). Then stop.
