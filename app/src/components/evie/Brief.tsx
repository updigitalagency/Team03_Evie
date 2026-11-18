import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { demo, type Approval } from '@/data/demo';
import { demoWeek } from '@/data/demoWeek';
import { generate } from '@/lib/data';
import { summarize, type ImportedDataset } from '@/lib/importedAnalytics';
import { supabase } from '@/integrations/supabase/client';
import Orb from './Orb';

type Letter = { id: string; content: string; created_at: string };
const autoStarted = new Set<string>();
export default function Brief({ userId, data, queue, approve, open, addDemo }: { userId?: string; data: ImportedDataset | null; queue: Approval[]; approve: (id: string) => void; open: (page: string) => void; addDemo: (item: Approval) => void }) {
  const real = !!data && !data.sample;
  const [letters, setLetters] = useState<Letter[]>(() => real ? [] : [{ id:'current-week',content:demoWeek.brief,created_at:'2026-10-19T12:00:00Z' }]);
  const [streaming, setStreaming] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [preference,setPreference]=useState(()=>localStorage.getItem('evie-brief-preference')==='true');
  const sessionId=useRef(crypto.randomUUID());
  const create = useCallback(async () => {
    setBusy(true); setError(''); setStreaming('');
    try {
      const summary = data ? summarize(data) : null;
      const context = summary ? JSON.stringify({ source:data?.sample?'Sample export':'Imported data',latest:summary.latest,revenue:summary.revenue,contribution:summary.cm,net:summary.net,appointments:summary.current.length }) : undefined;
      const text=await generate('Write a concise weekly letter to Eve about the available studio metrics, three priorities and their expected value if known. End with one question. Use only the supplied context.','chat',sessionId.current,context,chunk=>setStreaming(chunk.replace(/\*/g,'')));
      const letter={id:crypto.randomUUID(),content:text.replace(/\*/g,''),created_at:new Date().toISOString()};
      if(userId&&real){const result=await supabase.from('drafts').insert({studio_id:userId,title:'Evie weekly brief',content:letter.content});if(result.error)throw result.error;}
      setLetters(old=>[letter,...old].slice(0,4)); setStreaming('');
    } catch{setError('I couldn’t reach my notes just now. Try again in a moment.');setStreaming('');} finally{setBusy(false);}
  },[data,real,userId]);
  useEffect(()=>{let active=true;if(userId&&real)void supabase.from('drafts').select('id,content,created_at').eq('studio_id',userId).eq('title','Evie weekly brief').order('created_at',{ascending:false}).limit(4).then(({data:rows,error:err})=>{if(!active)return;if(err)setError('Could not load saved briefs.');else setLetters((rows||[]).map(row=>({...row,content:row.content||''})));});return()=>{active=false}},[userId,real]);
  useEffect(()=>{const key=`${userId||'demo'}-${real?'live':'demo'}`;if(!autoStarted.has(key)){autoStarted.add(key);void create();}},[create,real,userId]);
  const candidates:Approval[]=real ? queue.filter(item=>item.status==='Needs your yes'&&!demo.approvals.some(d=>d.id===item.id)).slice(0,3) : demo.actions.map(action=>queue.find(item=>item.id===action.id)||{...action,status:'Needs your yes',time:'Today'}).filter(item=>item.status==='Needs your yes');
  const approveOne=(item:Approval)=>{if(item.type==='Message'&&real){open('Approvals');return;}if(queue.some(q=>q.id===item.id))approve(item.id);else {addDemo({...item,status:'Approved'});toast('Approved. No action was sent or scheduled.');}};
  return <><div className="view-head"><span className="eyebrow">YOUR WEEKLY BRIEF</span><h1>A little clarity for the week ahead.</h1><p>Review what matters, then decide what happens next.</p></div>
    <section className="brief-letter"><button className="link" disabled={busy} onClick={()=>void create()}>{busy?'Writing…':'Write a new brief'}</button>{error&&<p role="alert">{error} <button className="link" onClick={()=>void create()}>Try again</button></p>}{streaming&&<article><p className="weekly-letter">{streaming}</p></article>}{!streaming&&letters.slice(0,1).map(letter=><article key={letter.id}><p className="fine">{new Date(letter.created_at).toLocaleDateString()}</p><p className="weekly-letter">{letter.content}</p><p className="brief-sign"><Orb small/> — Evie</p></article>)}{letters.length>1&&<details><summary>Earlier letters</summary>{letters.slice(1).map(letter=><article key={letter.id}><p className="fine">{new Date(letter.created_at).toLocaleDateString()}</p><p className="weekly-letter">{letter.content}</p></article>)}</details>}</section>
    <section className="brief-actions"><span className="eyebrow">YOUR DECISIONS</span><h2>Actions for your review.</h2>{candidates.length?<><div className="pnl">{candidates.map(item=><div key={item.id}><span><strong>{item.title}</strong><br/><small>Expected: {item.effect}</small></span><button className="link" onClick={()=>approveOne(item)}>{item.type==='Message'&&real?'Review':'Approve'}</button></div>)}</div><div className="weekly-actions"><button className="button wine small" onClick={()=>candidates.forEach(approveOne)}>Approve all</button></div><p className="fine">Approval does not send or schedule anything.</p></>:<p>No actions awaiting your approval.</p>}</section>
    <label className="brief-preference"><input type="checkbox" checked={preference} onChange={e=>{setPreference(e.target.checked);localStorage.setItem('evie-brief-preference',String(e.target.checked));}}/> Email me this every Monday 8:00 <small>Delivery is not yet set up.</small></label>
  </>;
}
