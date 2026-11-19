// Real-time frame recorder via CDP screencast with timestamps.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
export async function startRec(page, dir) {
  fs.mkdirSync(path.join(dir, 'frames'), { recursive: true });
  const client = await page.createCDPSession();
  const frames = [];
  let n = 0;
  client.on('Page.screencastFrame', async (f) => {
    const name = `f${String(++n).padStart(6, '0')}.jpg`;
    fs.writeFileSync(path.join(dir, 'frames', name), Buffer.from(f.data, 'base64'));
    frames.push({ name, ts: Date.now() });
    client.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  await client.send('Page.startScreencast', { format: 'jpeg', quality: 88, maxWidth: 1440, maxHeight: 900, everyNthFrame: 1 });
  const t0 = Date.now();
  return {
    t0,
    async stop(out) {
      await client.send('Page.stopScreencast').catch(() => {});
      await new Promise(r => setTimeout(r, 300));
      const end = Date.now();
      // first frame shown from t0
      let list = '';
      for (let i = 0; i < frames.length; i++) {
        const start = i === 0 ? t0 : frames[i].ts;
        const next = i + 1 < frames.length ? frames[i + 1].ts : end;
        const d = Math.max(0.001, (next - start) / 1000);
        list += `file 'frames/${frames[i].name}'\nduration ${d.toFixed(3)}\n`;
      }
      list += `file 'frames/${frames[frames.length - 1].name}'\n`;
      fs.writeFileSync(path.join(dir, 'list.txt'), list);
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'list.txt', '-vf', 'scale=1440:900:force_original_aspect_ratio=decrease,pad=1440:900:(ow-iw)/2:(oh-ih)/2,fps=24', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', out], { cwd: dir });
      return { frames: frames.length, seconds: (end - t0) / 1000 };
    },
  };
}
