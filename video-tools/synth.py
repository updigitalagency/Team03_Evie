# Royalty-free cheerful "cartoon" background track, synthesized from scratch.
# usage: python3 synth.py seconds out.wav
import math, struct, sys, wave, random
SR = 22050
secs = float(sys.argv[1]); out = sys.argv[2]
N = int(secs * SR)
bpm = 100.0; beat = 60.0 / bpm; bar = 4 * beat
def f(n): return 440.0 * 2 ** ((n - 69) / 12)
# C - G - Am - F  (midi roots) with triads
prog = [(60, [60, 64, 67]), (55, [55, 59, 62]), (57, [57, 60, 64]), (53, [53, 57, 60])]
mel = [72, 76, 79, 76, 74, 79, 74, 71, 72, 76, 72, 69, 69, 72, 77, 72]  # glock pattern (8ths per 2 bars-ish)
buf = [0.0] * N
def add_tone(start, dur, freq, amp, kind='pad'):
    s0 = int(start * SR); n = int(dur * SR)
    for i in range(n):
        j = s0 + i
        if j >= N: break
        t = i / SR
        if kind == 'pad':
            env = min(1.0, t / 0.35) * min(1.0, (dur - t) / 0.4)
            v = math.sin(2 * math.pi * freq * t) + 0.3 * math.sin(2 * math.pi * freq * 2 * t)
            v *= (0.85 + 0.15 * math.sin(2 * math.pi * 4.5 * t))
        elif kind == 'pluck':
            env = math.exp(-t * 6.0) * min(1.0, t / 0.004)
            v = math.sin(2 * math.pi * freq * t) + 0.35 * math.sin(2 * math.pi * freq * 3.01 * t) * math.exp(-t * 10)
        elif kind == 'bass':
            env = math.exp(-t * 2.5) * min(1.0, t / 0.01)
            v = math.sin(2 * math.pi * freq * t)
        else:  # soft kick
            env = math.exp(-t * 18)
            v = math.sin(2 * math.pi * (60 + 80 * math.exp(-t * 30)) * t)
        buf[j] += amp * env * v
t = 0.0; k = 0
while t < secs:
    root, triad = prog[k % 4]
    for n in triad: add_tone(t, bar, f(n), 0.045, 'pad')
    add_tone(t, beat * 2, f(root - 12), 0.12, 'bass'); add_tone(t + 2 * beat, beat * 2, f(root - 12), 0.10, 'bass')
    for b in range(4): add_tone(t + b * beat, 0.3, 0, 0.10, 'kick')
    for e in range(8):
        note = mel[(k % 2) * 8 + e]
        if (e + k) % 3 != 2: add_tone(t + e * beat / 2, 0.6, f(note), 0.05, 'pluck')
    t += bar; k += 1
# fade in/out + normalise
fade = int(1.5 * SR)
for i in range(min(fade, N)): buf[i] *= i / fade
for i in range(min(int(3 * SR), N)): buf[N - 1 - i] *= i / (3 * SR)
peak = max(1e-6, max(abs(x) for x in buf))
w = wave.open(out, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes(b''.join(struct.pack('<h', int(32767 * 0.8 * x / peak)) for x in buf)); w.close()
print('ok', secs)
