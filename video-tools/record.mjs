// Records the Evie demo tour from headless Chrome into frames + timeline.
// usage: node record.mjs <url> <outdir> [maxSeconds]
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { startRec } from './cdprec.mjs';

const [,, url, outdir, maxSecArg] = process.argv;
const maxSec = Number(maxSecArg || 240);
fs.mkdirSync(outdir, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--window-size=1440,900', '--autoplay-policy=no-user-gesture-required', '--disable-gpu'],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
const timeline = [];
let ended = false;
page.on('console', (msg) => {
  const t = msg.text();
  if (t.startsWith('EVIE_DEMO')) {
    try { const j = JSON.parse(t.slice('EVIE_DEMO'.length).trim()); timeline.push({ ...j, wall: Date.now() }); if (j.type === 'end') ended = true; if (j.type === 'line' && j.index === 8) setTimeout(() => { ended = true; }, 300);
      if (j.type === 'line' && /Beyond one business|Evie has a character|before and after|Impact:/i.test(j.text||'')) {
        setTimeout(() => page.evaluate(() => {
          const dlg = [...document.querySelectorAll('[role=dialog]')];
          dlg.forEach(d => { const b = [...d.querySelectorAll('button')].find(x => /close/i.test(x.getAttribute('aria-label')||'') || x.innerText.trim()==='×'); if (b) b.click(); });
          document.documentElement.classList.remove('dark'); 
        }).catch(()=>{}), 400);
      }
    } catch {}
  }
});
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
const t0 = Date.now();
const rec = await startRec(page, outdir);
const start = rec.t0;
while (!ended && Date.now() - start < maxSec * 1000) { await new Promise(r => setTimeout(r, 500)); }
await new Promise(r => setTimeout(r, 1500));
const info = await rec.stop('video.mp4'); console.log('rec', JSON.stringify(info));
fs.writeFileSync(path.join(outdir, 'timeline.json'), JSON.stringify({ recStart: start, t0, timeline }, null, 2));
await browser.close();
console.log('done', timeline.length, 'events, ended=', ended);
