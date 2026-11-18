import { useRef, useState } from 'react';
import { demo } from '@/data/demo';
import { demoWeek } from '@/data/demoWeek';
import { generate } from '@/lib/data';
import { useOwnerState } from '@/lib/weeklyState';

type Post = { id: string; week: number; title: string; channel: string; format: string; code: string; status: 'Draft' | 'Approved' | 'Posted'; body?: string };
export default function ContentCalendar({ userId, demoMode }: { userId?: string; demoMode: boolean }) {
  const { value: posts, save, ready } = useOwnerState<Post[]>(userId, 'content-calendar', []);
  const [examples, setExamples] = useState<Post[]>(() => demoMode ? demoWeek.calendar.map(post=>({...post})) : []);
  const [title, setTitle] = useState('');
  const [week, setWeek] = useState(1);
  const [channel, setChannel] = useState('Instagram');
  const [format, setFormat] = useState('Post');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const sessionId = useRef(crypto.randomUUID());
  const allPosts = [...posts, ...examples];
  const change = (post: Post, status: Post['status'], example: boolean) => {
    if (example) setExamples(current=>current.map(p=>p.id===post.id?{...p,status}:p));
    else void save(posts.map(p=>p.id===post.id?{...p,status}:p));
  };
  const add = () => { if (!title.trim()) return; void save([...posts,{id:crypto.randomUUID(),week,title:title.trim(),channel,format,code:code.trim(),status:'Draft'}]); setTitle(''); setCode(''); };
  const fill = async () => {
    const missing=Math.max(0,3-allPosts.filter(post=>post.week===week).length);
    if (!missing) { setNotice(`Week ${week+1} already has three posts.`); return; }
    setBusy(true); setNotice('');
    const ranked=[...demo.services].sort((a,b)=>b.perHour-a.perHour).filter(service=>demo.openings.some(opening=>opening.service===service.name));
    try {
      const results=await Promise.allSettled(Array.from({length:missing},async (_,i):Promise<Post>=>{
        const service=demoMode ? ranked[i%ranked.length].name : null;
        const bookingCode=`WK${week+1}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
        const prompt=`Write a short Instagram post in Eve’s warm, direct voice for week ${week+1}. ${service?`Feature ${service} and its open appointment opportunities.`:'Focus on nail care; do not invent services, appointment availability or prices.'} Include the booking code ${bookingCode}. Return only the finished caption, no markdown.`;
        const context=demoMode?undefined:JSON.stringify({source:'Studio calendar',note:'Real calendar openings and service margins are not connected. Do not invent availability.'});
        const body=await generate(prompt,'studio',sessionId.current,context);
        return {id:crypto.randomUUID(),week,title:service?`${service} availability`:'Nail care',channel:'Instagram',format:'Post',code:bookingCode,status:'Draft',body:body.includes(bookingCode)?body:`${body}\n\nBook with code ${bookingCode}.`};
      }));
      const drafts=results.flatMap(result=>result.status==='fulfilled'?[result.value]:[]);
      if(demoMode)setExamples(current=>[...current,...drafts]);
      else if(drafts.length)await save([...posts,...drafts]);
      const failure=results.find(result=>result.status==='rejected');
      setNotice(failure && failure.status==='rejected' ? `${drafts.length} draft${drafts.length===1?'':'s'} added. ${failure.reason instanceof Error?failure.reason.message:'Could not write the remaining drafts.'}` : `${drafts.length} draft${drafts.length===1?'':'s'} added to week ${week+1}.`);
    } finally { setBusy(false); }
  };
  const consistency=Math.round(100*[0,1,2,3].reduce((sum,w)=>sum+Math.min(3,allPosts.filter(post=>post.week===w).length),0)/12);
  return <section className="card view-card"><span className="eyebrow">FOUR-WEEK CONTENT CALENDAR</span><h2>A steady rhythm, not more noise.</h2><p className="fine">Publishing consistency: {(allPosts.length/4).toFixed(1)} planned posts/week vs 3 target · {consistency}% of the four-week target. Posted is marked by you; Evie does not publish.</p><div className="weekly-calendar">{[0,1,2,3].map(w=><div key={w}><strong>Week {w+1}</strong><p className="fine">{allPosts.filter(p=>p.week===w).length} planned / 3 target</p>{[...posts.map(post=>({post,example:false})),...examples.map(post=>({post,example:true}))].filter(({post})=>post.week===w).map(({post,example})=><article className="calendar-card" key={post.id}><p><strong>{post.title}</strong><br/><small>{post.channel} · {post.format} · {post.code || 'No booking code'}</small><br/><select className="calendar-status" aria-label={`Status for ${post.title}`} disabled={busy} value={post.status} onChange={e=>change(post,e.target.value as Post['status'],example)}><option>Draft</option><option>Approved</option><option>Posted</option></select></p>{post.body&&<p className="calendar-draft">{post.body}</p>}</article>)}</div>)}</div><div className="weekly-actions"><input aria-label="Content title" placeholder="Content idea" value={title} disabled={busy} onChange={e=>setTitle(e.target.value)}/><select aria-label="Calendar week" value={week} disabled={busy} onChange={e=>setWeek(Number(e.target.value))}>{[0,1,2,3].map(w=><option key={w} value={w}>Week {w+1}</option>)}</select><select aria-label="Channel" value={channel} disabled={busy} onChange={e=>setChannel(e.target.value)}><option>Instagram</option><option>Google Business</option><option>Other</option></select><select aria-label="Format" value={format} disabled={busy} onChange={e=>setFormat(e.target.value)}><option>Post</option><option>Reel</option><option>Story</option></select><input aria-label="Booking code" placeholder="Booking code" value={code} disabled={busy} onChange={e=>setCode(e.target.value)}/><button className="button ghost small" disabled={!ready || busy || !title.trim()} onClick={add}>Add draft</button><button className="button wine small" disabled={!ready || busy} onClick={()=>void fill()}>{busy?'Writing drafts…':'Fill the week'}</button></div>{notice&&<p className="fine" role="status">{notice}</p>}</section>;
}
