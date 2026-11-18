import { useEffect, useState } from 'react';

type Props = { value: number; format: (value: number) => string };

export default function AnimatedNumber({ value, format }: Props) {
  const [shown, setShown] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? value : 0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(value); return; }
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - started) / 600, 1);
      setShown(value * (1 - (1 - progress) ** 3));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <span aria-label={format(value)}><span aria-hidden="true">{format(shown)}</span></span>;
}
