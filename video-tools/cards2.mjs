import puppeteer from 'puppeteer-core';
import { startRec } from './cdprec.mjs';
import path from 'node:path';
const OWL = 'https://2362fcb7a83745d2a6479915c6c690ca.live-preview.enter.pro/characters/evie.png';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--window-size=1440,900', '--disable-gpu', '--allow-file-access-from-files','--autoplay-policy=no-user-gesture-required'], defaultViewport: { width: 1440, height: 900 } });
for (const [m, secs] of [['framia', 5.6]]) {
  const page = await browser.newPage();
  await page.goto('about:blank');
  const rec = await startRec(page, m);
  await page.goto('file://' + path.resolve('cards.html') + `?m=${m}&owl=${encodeURIComponent(OWL)}`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, secs * 1000));
  console.log(m, JSON.stringify(await rec.stop('video.mp4')));
  await page.close();
}
await browser.close();
