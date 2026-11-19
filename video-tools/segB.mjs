// Segment B: owl-led walkthrough of Brow Down, onboarding, call, before/after, close.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { startRec } from './cdprec.mjs';
const BASE = 'https://2362fcb7a83745d2a6479915c6c690ca.live-preview.enter.pro';
const seg = JSON.parse(fs.readFileSync('vo/segB.json', 'utf8'));
const OUT = 'segB'; fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true,
  args: ['--window-size=1440,900', '--disable-gpu', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'], defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 60000 });
await sleep(1500);

// --- overlay helpers (owl host + caption + tap ripple + hide badge)
await page.evaluate((base) => {
  const css = document.createElement('style');
  css.textContent = `
  #owlhost{position:fixed;left:40px;bottom:36px;z-index:2147483646;display:flex;align-items:flex-end;gap:12px;transition:transform .5s cubic-bezier(.4,0,.2,1);pointer-events:none;font-family:Inter,-apple-system,sans-serif}
  #owlcard{width:120px;height:120px;border-radius:28px;background:#fff;box-shadow:0 12px 40px rgba(60,40,140,.22);overflow:hidden;animation:bob 1.2s ease-in-out infinite}
  #owlcard img{width:100%;height:100%;object-fit:cover;transform:scale(1.15)}
  #owlcap{max-width:560px;background:#fff;border-radius:16px;padding:12px 16px;box-shadow:0 10px 30px rgba(0,0,0,.12);font-size:15px;line-height:1.45;color:#1B1B1F;margin-bottom:10px}
  @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
  @keyframes wave{0%,100%{transform:rotate(0)}25%{transform:rotate(-10deg)}75%{transform:rotate(10deg)}}
  .tapr{position:fixed;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(107,91,255,.35);z-index:2147483645;pointer-events:none;animation:tap .6s ease-out forwards}
  @keyframes tap{from{transform:scale(.3);opacity:1}to{transform:scale(1.6);opacity:0}}
  a[href*="enter.converge.ai"], [class*="build-with"], [class*="BuildWith"]{display:none!important}
  #ba{position:fixed;left:56%;top:44%;transform:translate(-50%,-50%);width:620px;background:#fff;border-radius:20px;box-shadow:0 30px 90px rgba(60,40,140,.25);padding:28px 32px;z-index:2147483640;font-family:Inter,-apple-system,sans-serif;color:#1B1B1F}
  #ba h3{margin:0 0 4px;font-size:22px} #ba .m{color:#8B8B93;font-size:13px;margin-bottom:16px}
  #ba .r{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #ECECF1;font-size:15px}
  #ba .r b{color:#6B5BFF} #ba .f{margin-top:14px;font-size:13px;color:#555;line-height:1.6}`;
  document.head.appendChild(css);
  const h = document.createElement('div'); h.id = 'owlhost';
  h.innerHTML = `<div id="owlcard"><img src="${base}/characters/evie.png"></div><div id="owlcap"></div>`;
  document.body.appendChild(h);
  [...document.querySelectorAll('a,div,button')].filter(e => /Build with/i.test(e.innerText||'') && e.innerText.length < 30).forEach(e => e.style.display = 'none');
}, BASE);

async function ensureOverlay() {
  const ok = await page.evaluate(() => !!document.getElementById('owlhost'));
  if (!ok) throw new Error('overlay lost (page reloaded)');
}
async function say(text) { await page.evaluate(t => { document.getElementById('owlcap').textContent = t; }, text); }
async function flyTo(sel) {
  const box = await page.evaluate((s) => {
    const el = typeof s === 'string' ? document.querySelector(s) : null; if (!el) return null;
    const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, sel);
  if (!box) return null;
  await page.evaluate(b => {
    const h = document.getElementById('owlhost');
    const dx = Math.max(-20, Math.min(b.x + 40, 1440 - 760)); const dy = Math.min(0, Math.max(-700, b.y + 40 - 744));
    h.style.transform = `translate(${dx}px, ${dy}px)`;
  }, box);
  await sleep(600); return box;
}
async function tapAt(box) {
  await page.evaluate(b => { const r = document.createElement('div'); r.className = 'tapr'; r.style.left = b.x + 'px'; r.style.top = b.y + 'px'; document.body.appendChild(r); setTimeout(() => r.remove(), 700); }, box);
  await sleep(250); await page.mouse.click(box.x, box.y);
}
async function home() { await page.evaluate(() => { document.getElementById('owlhost').style.transform = 'translate(0,0)'; }); await sleep(500); }
async function byText(tag, re) {
  return page.evaluateHandle((tag, src) => { const rx = new RegExp(src, 'i'); return [...document.querySelectorAll(tag)].find(e => rx.test((e.innerText || e.getAttribute('aria-label') || '').trim()) && e.offsetParent !== null) || null; }, tag, re.source);
}
async function flyClick(tag, re) {
  const h = await byText(tag, re); const el = h.asElement(); if (!el) { console.log('missing', re); return false; }
  await page.evaluate(e => { e.setAttribute('data-target', '1'); e.scrollIntoView({ block: 'center' }); }, el);
  const box = await flyTo('[data-target="1"]'); await page.evaluate(e => e.removeAttribute('data-target'), el);
  if (box) await tapAt(box); return true;
}
async function typeAsk(text) {
  const box = await flyTo('textarea, [contenteditable=true], input[placeholder*="Message"]');
  if (box) await tapAt(box);
  await page.keyboard.type(text, { delay: 38 }); await sleep(350); await page.keyboard.press('Enter');
}
async function demoCode() {
  const dlg = await page.evaluate(() => /Enter the demo code/.test(document.body.innerText));
  if (dlg) { await page.type('input', 'EVE2026').catch(() => {}); const inp = await page.$('[role=dialog] input'); if (inp) { await inp.type('EVE2026'); } await page.keyboard.press('Enter'); await sleep(800); }
}

const marks = [];
const rec = await startRec(page, OUT);
const T0 = rec.t0;
const line = async (i) => { marks.push({ i, t: Date.now() - T0 }); await say(seg[i].text); };
const hold = async (i, extra = 600) => { const left = seg[i].dur * 1000 + extra - (Date.now() - T0 - marks.find(m => m.i === i).t); if (left > 0) await sleep(left); };

await sleep(700);
// B0 switch studio
await line(0);
await flyClick('button', /Switch studio|Eve.s Space/); await sleep(700);
await flyClick('button,[role=option],[role=menuitem]', /^Brow Down Studio$/); await sleep(1500);
await ensureOverlay().catch(async () => { console.log('reloaded after switch'); });
await hold(0);
// re-inject overlay if lost
if (!(await page.evaluate(() => !!document.getElementById('owlhost')))) { console.log('overlay lost'); }
// B1 campaign plan
await line(1);
await typeAsk('Plan the holiday gift set launch'); await sleep(1200); await demoCode();
await sleep(2500); await page.evaluate(() => { const s = [...document.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 50 && getComputedStyle(e).overflowY === 'auto'); if (s) s.scrollTop = s.scrollHeight; });
await hold(1, 1500);
// B2 discovery
await line(2);
await flyClick('button', /New chat/); await sleep(800);
await typeAsk('How visible are we in AI search?'); await sleep(1000); await demoCode();
await sleep(2500); await page.evaluate(() => { const s = [...document.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 50 && getComputedStyle(e).overflowY === 'auto'); if (s) s.scrollTop = s.scrollHeight / 3; });
await hold(2, 1200);
// B3 onboarding
await line(3);
await flyClick('button', /Switch studio|Brow Down Studio/); await sleep(700);
await flyClick('button,[role=option],[role=menuitem]', /Add business/); await sleep(1500);
await flyClick('button', /Nail studio|Spa|Barber/); await sleep(600);
await hold(3, 400);
await page.keyboard.press('Escape'); await sleep(500);
// B4 character + call
await line(4);
await flyClick('button', /^Settings$/); await sleep(2600);
await page.keyboard.press('Escape'); await sleep(400); await home();
await flyClick('button', /Call Evie|^Call$/); await sleep(2200);
await hold(4, 200);
await flyClick('button', /End call/); await sleep(600);
// B5 before/after
await home();
await flyClick('button', /New chat/); await sleep(600); await home();
await page.evaluate(() => {
  const d = document.createElement('div'); d.id = 'ba';
  d.innerHTML = `<h3>Before → After</h3><div class="m">Eve's Space · one week with Evie · projected</div>
  <div class="r"><span>Net profit / month</span><span>$590 → <b>~$3,700</b></span></div>
  <div class="r"><span>Open chair-hours this week</span><span>29 → <b>12</b></span></div>
  <div class="r"><span>Content published</span><span>0 → <b>7 posts scheduled</b></span></div>
  <div class="r"><span>Lapsed loyal clients contacted</span><span>0 → <b>173</b></span></div>
  <div class="f">Fixed by Evie: influencer paused · +$1,500 to Google & referrals · ClassPass capped to off-peak · Instagram plan for 7 days · 3 SEO pages · Gel-X ads ready to launch</div>`;
  document.body.appendChild(d);
});
await line(5); await hold(5, 500);
// B6 close + wave
await line(6);
await page.evaluate(() => { document.getElementById('owlcard').style.animation = 'wave 1s ease-in-out 3'; });
await hold(6, 1500);
console.log('rec', JSON.stringify(await rec.stop('video.mp4')));
fs.writeFileSync(OUT + '/marks.json', JSON.stringify(marks));
await browser.close();
console.log('done', JSON.stringify(marks));
