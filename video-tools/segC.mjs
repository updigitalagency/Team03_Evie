// Segment C: new features (goals onboarding, strategy + why, data health, looks, typo tolerance, 4 products).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { startRec } from './cdprec.mjs';
const BASE = 'https://2362fcb7a83745d2a6479915c6c690ca.prod.enter.pro';
const seg = JSON.parse(fs.readFileSync('vo/segC.json', 'utf8'));
const OUT = 'segC'; fs.mkdirSync(OUT, { recursive: true });
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

const clickSel = async (sel) => { const box = await flyTo(sel); if (box) await tapAt(box); return !!box; };
const markText = (re, contains) => page.evaluate((src, c) => {
  document.querySelectorAll('[data-t]').forEach(e => e.removeAttribute('data-t'));
  const rx = new RegExp(src, 'i');
  let els = [...document.querySelectorAll('button,summary,[role=button],[role=option]')].filter(e => e.offsetParent !== null && rx.test((e.innerText || e.getAttribute('aria-label') || '').trim()));
  if (c) els = els.filter(e => { let p = e; for (let i = 0; i < 6 && p; i++) { if ((p.innerText || '').includes(c)) return true; p = p.parentElement; } return false; });
  const e = els[0]; if (!e) return false; e.scrollIntoView({ block: 'center' }); e.setAttribute('data-t', '1'); return true;
}, re.source, contains || null);
const tapText = async (re, contains) => { if (!(await markText(re, contains))) { console.log('missing', re); return false; } await sleep(200); return clickSel('[data-t="1"]'); };
const scrollChat = (frac) => page.evaluate((f) => { const s = [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY)).sort((a, b) => b.clientWidth - a.clientWidth)[0]; if (s) s.scrollTo({ top: s.scrollHeight * f, behavior: 'smooth' }); }, frac);

await sleep(500);
// C0 goals onboarding
await line(0);
await tapText(/^Fill empty chairs$/); await sleep(500);
await tapText(/^Bring regulars back$/); await sleep(500);
await tapText(/^Continue$/); await sleep(900);
await tapText(/^Ads cost too much$/); await sleep(400);
await tapText(/^Continue$/); await sleep(1300);
await hold(0, -300);
// C1 strategy + why
await line(1);
await tapText(/^Build my strategy$/); await sleep(2200);
await tapText(/^Why this\?$/, '+$2,369'); await sleep(1500);
await hold(1, 300);
// C2 data health
await line(2);
await home(); await tapText(/^Profile$/); await sleep(1500);
await page.evaluate(() => { const h = [...document.querySelectorAll('[role=dialog] *')].find(e => /^Data health/.test((e.innerText || '').trim()) && e.children.length < 3); if (h) h.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
await sleep(1600);
await tapText(/^Approve demo fix$/); await sleep(900);
await tapText(/^Approve demo fix$/); await sleep(900);
await hold(2, 300);
await page.keyboard.press('Escape'); await sleep(500);
// C3 looks
await line(3);
await home(); await clickSel('[aria-label="Edit character"]'); await sleep(1200);
const dump = await page.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].pop(); return d ? d.innerText.slice(0, 400) : 'NO'; }); console.log('CHAR', dump);
for (const n of ['Hype bestie', 'Numbers nerd', 'Evie · Coach', 'Calm strategist']) { await tapText(new RegExp(n)); await sleep(1000); }
await hold(3, 0);
await page.keyboard.press('Escape'); await sleep(500);
// C4 typo tolerance
await line(4);
await home(); await tapText(/New chat/); await sleep(700);
{ const b = await flyTo('[placeholder^="Ask Evie"]'); if (b) await tapAt(b); await page.keyboard.type('How are my convenes doing?', { delay: 38 }); await sleep(300); await page.keyboard.press('Enter'); } await sleep(900); await demoCode();
await sleep(2000); scrollChat(1);
await hold(4, 1200);
// C5 four products
await line(5);
await home();
await page.evaluate(() => {
  const d = document.createElement('div'); d.id = 'ba';
  d.innerHTML = `<h3>Built on all four Converge.AI products</h3><div class="m">Team 03 · Evie</div>
  <div class="r"><span><b>Enter</b></span><span>the whole app · database · live AI · images</span></div>
  <div class="r"><span><b>Framia</b></span><span>the animated owl · video-ad hand-off</span></div>
  <div class="r"><span><b>Covey</b></span><span>the 10-slide pitch deck</span></div>
  <div class="r"><span><b>Combos</b></span><span>Evie as a chat-able AI character</span></div>`;
  document.body.appendChild(d);
});
await hold(5, 900);
console.log('rec', JSON.stringify(await rec.stop('video.mp4')));
fs.writeFileSync(OUT + '/marks.json', JSON.stringify(marks));
await browser.close();
console.log('done', JSON.stringify(marks));
