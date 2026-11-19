# Assemble intro + segA + segB + outro, narration (Jenny) + synthesized music with ducking.
import json, subprocess, os
R = lambda *a: subprocess.run(list(a), check=True, capture_output=True)
def dur(f): return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout)
os.makedirs('out', exist_ok=True)
INTRO_SS, INTRO_LEN = 4.6, 5.4
OUTRO_SS, OUTRO_LEN = 1.2, 6.0
# segA: pad 1.3 s at start (clone), cut where line 8 begins
A_PAD = 1.3
segA = json.load(open('segA/timeline.json'))
offA = round(sum((e['wall']-segA['recStart'])-e['startMs'] for e in segA['timeline'])/len(segA['timeline']))
l8 = [e for e in segA['timeline'] if e.get('index') == 8][0]
A_END = (l8['startMs'] + offA) / 1000 + A_PAD
B_LEN = dur('segB/video.mp4')
R('ffmpeg','-v','error','-y','-ss',str(INTRO_SS),'-t',str(INTRO_LEN),'-i','intro/video.mp4','-r','24','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','out/p0.mp4')
R('ffmpeg','-v','error','-y','-i','segA/video.mp4','-vf',f'tpad=start_duration={A_PAD}:start_mode=clone','-t',str(A_END),'-r','24','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','out/p1.mp4')
R('ffmpeg','-v','error','-y','-i','segB/video.mp4','-r','24','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','out/p2.mp4')
R('ffmpeg','-v','error','-y','-ss',str(OUTRO_SS),'-t',str(OUTRO_LEN),'-i','outro/video.mp4','-r','24','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','out/p3.mp4')
open('out/parts.txt','w').write(''.join(f"file 'p{i}.mp4'\n" for i in range(4)))
R('ffmpeg','-v','error','-y','-f','concat','-safe','0','-i','out/parts.txt','-c','copy','out/video.mp4')
TOTAL = dur('out/video.mp4')
# narration placement (seconds in final video)
segAvo = json.load(open('vo/segA.json'))
place = []
place.append(('vo/intro.mp3', 0.6))
for s in segAvo:
    place.append((s['file'], INTRO_LEN + (s['start'] - 742 + 742) / 1000.0 + 0 ))
# segA.json 'start' was computed from take3 offsets; recompute from segA timeline instead
place = [('vo/intro.mp3', 0.6)]
tl = {e['index']: e for e in segA['timeline'] if e.get('type') == 'line'}
for s in segAvo:
    e = tl[s['idx']]
    place.append((s['file'], INTRO_LEN + (e['startMs'] + offA) / 1000 + A_PAD))
marks = json.load(open('segB/marks.json'))
segBvo = json.load(open('vo/segB.json'))
for m in marks:
    place.append((segBvo[m['i']]['file'], INTRO_LEN + A_END + m['t'] / 1000))
place.append(('vo/outro.mp3', INTRO_LEN + A_END + B_LEN + 0.8))
# music
R('python3','synth.py',str(TOTAL+1),'out/music.wav')
inputs = ['-i','out/video.mp4','-i','out/music.wav']
filt = []
for i,(f,t) in enumerate(place):
    inputs += ['-i', f.replace('rec/','',1)]; ms = max(0,int(t*1000))
    filt.append(f'[{i+2}:a]aresample=44100,adelay={ms}|{ms},apad[v{i}]')
mix = ''.join(f'[v{i}]' for i in range(len(place)))
filt.append(f'{mix}amix=inputs={len(place)}:normalize=0:duration=longest,volume=1.0[vo]')
filt.append('[vo]asplit=2[vo1][vosc]')
filt.append('[1:a]aresample=44100,volume=0.55[mu]')
filt.append('[mu][vosc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[mud]')
filt.append('[vo1][mud]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[aout]')
R('ffmpeg','-v','error','-y',*inputs,'-filter_complex',';'.join(filt),'-map','0:v','-map','[aout]','-c:v','copy','-c:a','aac','-b:a','192k','-t',str(TOTAL),'out/Team03_Evie_demo.mp4')
print('total', round(TOTAL,1), 'A_END', round(A_END,1), 'B', round(B_LEN,1), 'lines', len(place))
