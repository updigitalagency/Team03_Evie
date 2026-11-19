// Evie · scroll-driven site. Each .scene is tall; its sticky .stage animates from progress 0..1.
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const seg = (p, a, b) => clamp((p - a) / (b - a));
const mobile = () => innerWidth <= 900;

document.querySelectorAll('.scene').forEach(s => s.style.setProperty('--len', s.dataset.len || 3));
const scenes = [...document.querySelectorAll('.scene')];
const nav = [...document.querySelectorAll('.side-nav a')];
const allSections = [...document.querySelectorAll('section')];

// smooth scroll value (lerped), like the reference site
let sy = scrollY, target = scrollY;
addEventListener('scroll', () => { target = scrollY; }, { passive: true });

// ---------- 01: scroll-scrubbed Framia pull-back ----------
const video = document.getElementById('pull');
const vwrap = document.getElementById('vwrap');
const screen = document.getElementById('screen');
const hero = document.getElementById('hero');
const hint = document.getElementById('hint');
const shade = document.getElementById('shade');
const s1panel = document.getElementById('s1panel');
// Phones (and any touch device): draw a JPEG frame sequence on a canvas. iOS Safari often
// refuses to repaint a video on currentTime seeks, so scrubbing a <video> is unreliable there.
const DUR = 5.04, NF = 71;
const useSeq = matchMedia('(hover: none), (pointer: coarse)').matches || mobile();
let canvas, ctx, frames = [], lastDrawn = -1;
if (useSeq) {
  video.removeAttribute('src'); video.load(); video.style.display = 'none';
  canvas = document.createElement('canvas'); canvas.className = 'seq';
  vwrap.insertBefore(canvas, vwrap.firstChild); ctx = canvas.getContext('2d');
  const sizeCanvas = () => { const d = Math.min(devicePixelRatio || 1, 2); canvas.width = vwrap.clientWidth * d; canvas.height = vwrap.clientHeight * d; lastDrawn = -1; };
  addEventListener('resize', sizeCanvas); sizeCanvas();
  const load = i => { const im = new Image(); im.decoding = 'async'; im.src = `media/seq/f${String(i + 1).padStart(3, '0')}.jpg`; im.onload = () => { if (i === 0 || lastDrawn === -1) lastDrawn = -2; }; frames[i] = im; };
  load(0); for (let i = 1; i < NF; i++) load(i);
} else {
  // desktop: whole video into memory so seeking is instant
  (async () => {
    try { const b = await fetch(video.getAttribute('src')).then(r => r.blob()); video.src = URL.createObjectURL(b); } catch (e) { video.load(); }
  })();
  video.addEventListener('loadeddata', () => { video.play().then(() => video.pause()).catch(() => {}); }, { once: true });
}
function drawFrame(t) {
  let i = Math.round(clamp(t / DUR) * (NF - 1));
  // nearest loaded frame
  let j = i; while (j > 0 && !(frames[j] && frames[j].complete && frames[j].naturalWidth)) j--;
  const im = frames[j]; if (!im || !im.complete || !im.naturalWidth || j === lastDrawn) return;
  const W = canvas.width, H = canvas.height, sc = Math.max(W / im.naturalWidth, H / im.naturalHeight);
  const w = im.naturalWidth * sc, h = im.naturalHeight * sc;
  ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); lastDrawn = j;
}
const vs = { target: 0, cur: 0 };
// laptop screen corners in the last frame (fractions of the 1280x720 video)
const QUAD = [[.714, .342], [.914, .3625], [.902, .711], [.703, .674]];
let mx = 0, my = 0, smx = 0, smy = 0;
addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });

function homography(src, dst) {
  // solve 8x8 for projective transform mapping src quad -> dst quad
  const A = [], B = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); B.push(v);
  }
  for (let c = 0; c < 8; c++) { // gaussian elimination
    let m = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[m][c])) m = r;
    [A[c], A[m]] = [A[m], A[c]]; [B[c], B[m]] = [B[m], B[c]];
    for (let r = 0; r < 8; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k]; B[r] -= f * B[c]; }
  }
  const h = B.map((b, i) => b / A[i][i]);
  return [h[0], h[3], 0, h[6], h[1], h[4], 0, h[7], 0, 0, 1, 0, h[2], h[5], 0, 1];
}
function placeScreen() {
  const W = vwrap.clientWidth, H = vwrap.clientHeight, s = Math.max(W / 1280, H / 720);
  const ox = (W - 1280 * s) / 2, oy = (H - 720 * s) / 2;
  const dst = QUAD.map(([x, y]) => [ox + x * 1280 * s, oy + y * 720 * s]);
  const w = 1600, h = 1000;
  screen.style.width = w + 'px'; screen.style.height = h + 'px';
  screen.style.transform = `matrix3d(${homography([[0, 0], [w, 0], [w, h], [0, h]], dst).join(',')})`;
}
addEventListener('resize', placeScreen); placeScreen();

function s1(p) {
  // video plays across 0..0.62 of the scene, then holds on the studio shot
  vs.target = seg(p, 0, .62) * ((useSeq ? DUR : video.duration || DUR) - .05);
  const out = seg(p, 0, .14);
  hero.style.opacity = 1 - out; hero.style.transform = `translate3d(${smx * -18}px, ${-out * 60 + smy * -10}px, 0)`;
  hint.style.opacity = 1 - seg(p, 0, .05);
  vwrap.style.transform = `translate3d(${smx * -14}px, ${smy * -10}px, 0) scale(1.03)`;
  const sc = seg(p, .6, .7); screen.style.opacity = sc;
  const pan = ease(seg(p, .7, .86));
  shade.style.opacity = pan;
  s1panel.style.opacity = pan;
  s1panel.style.transform = mobile() ? `translateY(${(1 - pan) * 30}px)` : `translateY(${-40 - (1 - pan) * 10}%)`;
}
function tickVideo() {
  vs.cur += (vs.target - vs.cur) * .18;
  if (useSeq) { drawFrame(vs.cur); return; }
  if (video.duration && !video.seeking && Math.abs(video.currentTime - vs.cur) > 1 / 60) video.currentTime = vs.cur;
}

// ---------- 02 ----------
const s2words = [...document.querySelectorAll('#s2title span')];
const cloud = [...document.querySelectorAll('#cloud span')];
const cloudSeed = cloud.map((_, i) => { const a = i / cloud.length * Math.PI * 2 + .4; return { a, r: .22 + (i % 3) * .07 }; });
const stats = [...document.querySelectorAll('#s2 .st')];
const punch = document.getElementById('punch');
const fmt = n => n.toLocaleString('en-US');
function countUp(el, k) {
  el.querySelectorAll('[data-count]').forEach(c => { const n = Math.round(+c.dataset.count * k); c.textContent = fmt(n) + (c.dataset.suffix || ''); });
  if (el.dataset.count) el.textContent = fmt(Math.round(+el.dataset.count * k)) + (el.dataset.suffix || '');
}
function s2(p) {
  s2words.forEach((w, i) => { const k = ease(seg(p, .02 + i * .04, .14 + i * .04)); w.style.opacity = k; w.style.transform = `translateY(${(1 - k) * 40}px)`; });
  // tools drift apart = scattered data
  const spread = .35 + ease(seg(p, .05, .7)) * 1.1;
  cloud.forEach((c, i) => {
    const { a, r } = cloudSeed[i]; const rr = r * spread;
    const m = mobile();
    const x = Math.cos(a + p * .8) * rr * innerWidth * (m ? .9 : 1);
    const y = m ? Math.sin(a + p * .8) * rr * innerHeight * .2 - innerHeight * .1 : Math.sin(a + p * .8) * rr * innerHeight * .55 + innerHeight * .02;
    c.style.transform = `translate(-50%,-50%) translate(${x}px, ${y}px)`;
    c.style.opacity = (.9 - seg(p, .55, .8) * .75).toFixed(2);
  });
  stats.forEach(st => { const k = ease(seg(p, +st.dataset.at, +st.dataset.at + .12)); st.style.opacity = k; st.style.transform = `translateY(${(1 - k) * 30}px)`; st.querySelectorAll('[data-count]').forEach(c => countUp(c, k)); });
  const pk = ease(seg(p, .72, .85)); punch.style.opacity = pk; punch.style.transform = `translateY(${(1 - pk) * 20}px)`;
}

// ---------- 03 ----------
const track = document.getElementById('track');
const guide = document.getElementById('guide');
const gbubble = document.getElementById('gbubble');
const s3bar = document.getElementById('s3bar');
const devices = [...document.querySelectorAll('.device')];
const lines = ['Let me show you what I do.', 'First I learn what actually works.', 'Then I plan the next 90 days.', 'Then I do the work. You just say yes.'];
let lastLine = -1;
function s3(p) {
  if (mobile()) { // vertical stack on phones: step through panels
    const n = 4, i = Math.min(n - 1, Math.floor(p * n));
    track.style.transform = `translate3d(${-i * 100}vw,0,0)`; s3bar.style.width = (p * 100) + '%'; return;
  }
  const max = track.scrollWidth - innerWidth;
  const k = ease(seg(p, .04, .96));
  track.style.transform = `translate3d(${-k * max}px,0,0)`;
  s3bar.style.width = (k * 100) + '%';
  devices.forEach((d, i) => { const center = (i + 1) / 3; d.style.setProperty('--ry', `${clamp((k - center) * 40, -10, 10).toFixed(1)}deg`); });
  const li = Math.min(3, Math.round(k * 3));
  if (li !== lastLine) { lastLine = li; gbubble.style.opacity = 0; setTimeout(() => { gbubble.textContent = lines[li]; gbubble.style.opacity = 1; }, 160); }
  guide.style.transform = `translate3d(${Math.sin(k * Math.PI * 3) * 14}px, ${-Math.abs(Math.sin(k * Math.PI * 3)) * 18}px, 0)`;
}
gbubble.style.transition = 'opacity .16s';

// ---------- 04 ----------
const bars = [...document.querySelectorAll('#s4 .bar')];
const finds = [...document.querySelectorAll('#s4 .find')];
const cols = [...document.querySelectorAll('#s4 .col')];
function s4(p) {
  bars.forEach((b, i) => { const k = ease(seg(p, .04 + i * .03, .2 + i * .03)); b.querySelector('i').style.transform = `scaleX(${k * b.dataset.v / 50})`; });
  finds.forEach(f => { const k = ease(seg(p, +f.dataset.at, +f.dataset.at + .1)); f.style.opacity = k; f.style.transform = `translateY(${(1 - k) * 24}px)`; });
  cols.forEach(c => { const k = ease(seg(p, +c.dataset.at, +c.dataset.at + .08)); c.style.setProperty('--g', k.toFixed(3)); });
}

// ---------- 05 ----------
const ringSpans = [...document.querySelectorAll('#ring2 span')];
const ring2 = document.getElementById('ring2');
const proof = document.getElementById('proof');
function s5(p) {
  const R = ring2.clientWidth / 2;
  ringSpans.forEach((s, i) => {
    const a = i / ringSpans.length * Math.PI * 2 + p * Math.PI * 1.2 - Math.PI / 2;
    const k = ease(seg(p, .02 + i * .03, .16 + i * .03));
    s.style.transform = `translate(-50%,-50%) translate(${Math.cos(a) * R * k}px, ${Math.sin(a) * R * k}px)`;
    s.style.opacity = k;
  });
  const k = ease(seg(p, .35, .5)); proof.style.opacity = k; proof.style.transform = `translateY(${(1 - k) * 30}px)`;
}

const handlers = { s1, s2, s3, s4, s5 };

// iris transition: each stage opens as a circle while its section scrolls in
function iris(sec, stage) {
  const r = sec.getBoundingClientRect();
  const k = clamp(1 - r.top / innerHeight);
  stage.style.setProperty('--iris', (8 + ease(k) * 142).toFixed(1) + '%');
}

// reveal on enter for section 6
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }), { threshold: .2 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

function frame() {
  sy += (target - sy) * .2;
  smx += (mx - smx) * .06; smy += (my - smy) * .06;
  for (const sec of scenes) {
    const top = sec.offsetTop, len = sec.offsetHeight - innerHeight;
    const p = clamp((sy - top) / len);
    const stage = sec.querySelector('.stage');
    if (stage.classList.contains('iris')) iris(sec, stage);
    if (sy + innerHeight > top - 50 && sy < top + sec.offsetHeight + 50) handlers[sec.id]?.(p);
  }
  tickVideo();
  // nav state
  let cur = 0; allSections.forEach((s, i) => { if (scrollY + innerHeight * .5 >= s.offsetTop) cur = i; });
  nav.forEach((a, i) => a.classList.toggle('on', i === cur));
  document.body.classList.toggle('on-dark', allSections[cur].classList.contains('dark') || cur === 0);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// side nav: jump to the "settled" point of each scene
nav.forEach((a, i) => a.addEventListener('click', e => {
  e.preventDefault();
  const s = allSections[i];
  const extra = s.classList.contains('scene') ? (i === 0 ? 0 : (s.offsetHeight - innerHeight) * .5) : 0;
  scrollTo({ top: s.offsetTop + extra, behavior: 'smooth' });
}));
