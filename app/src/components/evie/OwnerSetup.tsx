import { useEffect, useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Approval } from '@/data/demo';

export default function OwnerSetup({ userId, importVersion, queue }: { userId?: string; importVersion: number; queue: Approval[] }) {
  const [squareImported, setSquareImported] = useState(false);
  useEffect(() => {
    let active = true; setSquareImported(false);
    if (userId) void supabase.from('integration_status').select('row_count').eq('studio_id',userId).eq('source','Square export').maybeSingle().then(({data}) => { if(active) setSquareImported(!!data && data.row_count > 0); });
    return () => { active = false; };
  }, [userId, importVersion]);
  const steps = [
    { label: 'Upload Square export', done: squareImported },
    { label: 'Connect Instagram', done: false },
    { label: 'Connect Gmail', done: false },
    { label: 'Connect Google (Calendar, Search Console, Analytics)', done: false },
    { label: 'Approve your first action', done: queue.some(item => item.status === 'Approved' && !['a1','a2','a3'].includes(item.id)) },
  ];
  return <section className="card view-card"><span className="eyebrow">OWNER SETUP</span><h2>Get your studio ready.</h2><div className="setup-list">{steps.map((step, i) => <div key={step.label}>{step.done ? <CheckCircle2 size={17}/> : <Circle size={17}/>}<span>{i + 1} · {step.label}</span><small>{step.done ? 'Complete' : 'Not complete'}</small></div>)}</div></section>;
}
