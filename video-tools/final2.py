# v2: Framia intro + time-lapsed live tour (Eve's Space, Brow Down) + new-features segment + outro, faster narration.
import json, subprocess, os, sys
R = lambda *a: subprocess.run(list(a), check=True, capture_output=True)
def dur(f): return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout)
os.makedirs('out2', exist_ok=True)
ENC = ['-r','24','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-an']
tl = json.load(open('full2/timeline.json'))
ev = sorted(tl['timeline'], key=lambda e: e['wall'])
lines = [e for e in ev if e.get('type') == 'line']
endt = [(e['wall']-tl['recStart'])/1000 for e in ev if e.get('type') == 'end'][0]
TOUR = 'full2/video.mp4'
# narration for tour lines (+12%)
for e in lines:
    f = f"vo/t{e['index']:02d}.mp3"
    if not os.path.exists(f):
        R('../tts/bin/edge-tts','--voice','en-US-JennyNeural','--rate=+12%','--text',e['text'],'--write-media',f)
parts, place = [], []
T = 0.0
def add(path, vo=None):
    global T
    parts.append(path); d = dur(path)
    for f, off in (vo or []): place.append((f, T + off))
    T += d
# intro
R('ffmpeg','-v','error','-y','-ss','0.8','-t','5.4','-i','framia/video.mp4',*ENC,'out2/intro.mp4')
add('out2/intro.mp4', [('vo/intro.mp3', 0.9)])
segC_after = 14
for k, e in enumerate(lines):
    s = max(0.0, (e['wall']-tl['recStart'])/1000)
    nxt = (lines[k+1]['wall']-tl['recStart'])/1000 if k+1 < len(lines) else endt
    f = f"vo/t{e['index']:02d}.mp3"; v = dur(f)
    target = max(v + 0.8, 2.5)
    fac = min(max((nxt - s) / target, 1.0), 3.2)
    out = f'out2/t{k:02d}.mp4'
    R('ffmpeg','-v','error','-y','-ss',f'{s:.3f}','-t',f'{nxt-s:.3f}','-i',TOUR,'-vf',f'setpts=(PTS-STARTPTS)/{fac:.4f}',*ENC,out)
    add(out, [(f, 0.15)])
    print(e['index'], round(nxt-s,1), '->', round(dur(out),1), 'vo', round(v,1))
    if e['index'] == segC_after:
        R('ffmpeg','-v','error','-y','-i','segC/video.mp4',*ENC,'out2/segC.mp4')
        marks = json.load(open('segC/marks.json')); cvo = json.load(open('vo/segC.json'))
        add('out2/segC.mp4', [(cvo[m['i']]['file'], m['t']/1000) for m in marks])
R('ffmpeg','-v','error','-y','-ss','1.2','-t','6','-i','outro/video.mp4',*ENC,'out2/outro.mp4')
add('out2/outro.mp4', [('vo/outro.mp3', 0.8)])
open('out2/parts.txt','w').write(''.join(f"file '{os.path.basename(p)}'\n" for p in parts))
R('ffmpeg','-v','error','-y','-f','concat','-safe','0','-i','out2/parts.txt','-c','copy','out2/video.mp4')
TOTAL = dur('out2/video.mp4')
R('python3','synth.py',str(TOTAL+1),'out2/music.wav')
inputs = ['-i','out2/video.mp4','-i','out2/music.wav']; filt = []
for i,(f,t) in enumerate(place):
    inputs += ['-i', f.replace('rec/','',1)]; ms = max(0,int(t*1000))
    filt.append(f'[{i+2}:a]aresample=44100,adelay={ms}|{ms},apad[v{i}]')
filt.append(''.join(f'[v{i}]' for i in range(len(place))) + f'amix=inputs={len(place)}:normalize=0:duration=longest[vo]')
filt.append('[vo]asplit=2[vo1][vosc]')
filt.append('[1:a]aresample=44100,volume=0.55[mu]')
filt.append('[mu][vosc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[mud]')
filt.append('[vo1][mud]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[aout]')
R('ffmpeg','-v','error','-y',*inputs,'-filter_complex',';'.join(filt),'-map','0:v','-map','[aout]','-c:v','copy','-c:a','aac','-b:a','192k','-t',str(TOTAL),'out2/Team03_Evie_demo_v2.mp4')
# overlap check
pl = sorted((t, t+dur(f.replace('rec/','',1)), f) for f,t in place)
for a,b in zip(pl, pl[1:]):
    if b[0] < a[1] - 0.05: print('OVERLAP', a[2], b[2], round(a[1]-b[0],2))
print('total', round(TOTAL,1), 'lines', len(place))
