import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type ResolveCode = (code: string | null) => void;
export default function DemoCodeSheet() {
  const [resolve, setResolve] = useState<ResolveCode | null>(null);
  const [code, setCode] = useState('');
  useEffect(() => {
    const show = (event: Event) => {const callback = (event as CustomEvent<ResolveCode>).detail; setCode(''); setResolve(() => callback);};
    window.addEventListener('evie-request-demo-code', show);
    return () => window.removeEventListener('evie-request-demo-code', show);
  }, []);
  const finish = (value: string | null) => {resolve?.(value); setResolve(null); setCode('');};
  return <Dialog open={!!resolve} onOpenChange={open => {if (!open) finish(null)}}><DialogContent><DialogHeader><DialogTitle>Enter the demo code</DialogTitle><DialogDescription>Use your demo code to access Evie’s AI. The code is remembered on this device after a successful request.</DialogDescription></DialogHeader><form onSubmit={event => {event.preventDefault(); if (code.trim()) finish(code.trim());}} className="grid gap-4"><label htmlFor="evie-demo-code">Demo code</label><Input id="evie-demo-code" autoComplete="off" value={code} onChange={event => setCode(event.target.value)} required/><button className="button wine" type="submit">Continue</button></form></DialogContent></Dialog>;
}
