import { useEffect, useRef, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { toast } from 'sonner';
import { demo, money, type Approval } from '@/data/demo';
import { demoWeek, eligibleClients } from '@/data/demoWeek';
import { generate, saveDraft } from '@/lib/data';
import { summarize, type ImportedDataset } from '@/lib/importedAnalytics';
import Plan from './Plan';
import AdCreative from './AdCreative';
import ConnectedInsights from './ConnectedInsights';
import Brief from './Brief';
import Studio from './Studio';
import Approvals from './Approvals';
import MessageReview from './MessageReview';

export type CardKind = 'studio' | 'full-approvals' | 'seo' | 'ad-edit' | 'ad' | 'approvals' | 'gap' | 'draft' | 'channels' | 'money' | 'plan' | 'brief';
type Props={userId?:string;briefText?:string;update:(id:string,status:string)=>void;kind:CardKind;imported:ImportedDataset|null;queue:Approval[];approve:(id:string)=>void;add:(item:Approval)=>void;addDemo:(item:Approval)=>void;open:(page:string)=>void;target:number;setTarget:(target:number)=>void};
function Draft({imported,add,open}:{imported:ImportedDataset|null;add:(item:Approval)=>void;open:(page:string)=>void}) {
  const [body,setBody]=useState(''); const [error,setError]=useState(''); const [busy,setBusy]=useState(true); const [approved,setApproved]=useState(false); const started=useRef(false);
  useEffect(()=>{if(started.current)return;started.current=true;const context=imported?JSON.stringify({source:imported.sample?'Sample export':'Imported data',summary:summarize(imported),note:'Do not invent availability or results.'}):undefined;
    void generate('Write one short Instagram caption for this week in Eve’s warm, direct voice. Focus on nail care. Do not invent availability. End with a booking invitation.','studio',crypto.randomUUID(),context).then(text=>setBody(text)).catch(()=>setBody('I take time to care for your nails and choose a finish that suits your day. I’d love to see you at the studio.')).finally(()=>setBusy(false));
  },[imported]);
  const submit=async()=>{try{await saveDraft('Caption',body);add({id:`draft-${Date.now()}`,title:'Instagram caption',type:'Post',effect:'Weekly post',status:'Approved',time:'Today',body});setApproved(true)}catch{setError('I could not save the draft.')}};
  return <div className="conversation-card"><p className="conversation-card-copy">{busy?'I’m writing a post…':body}</p>{error&&<p className="card-note" role="alert">{error}</p>}<div className="conversation-card-actions"><button className="button wine small" disabled={busy||!body||approved} onClick={()=>void submit()}>{approved?'Approved':'Approve draft'}</button><button className="link" onClick={()=>open('Studio')}>Open Studio</button></div></div>;
}
export default function ConversationCard({userId,briefText,update,kind,imported,queue,approve,add,addDemo,open,target,setTarget}:Props){
  const [review,setReview]=useState<Approval|null>(null);const [approved,setApproved]=useState<string[]>([]); const sample=!imported||imported.sample;
  const summary=imported?summarize(imported):null;
  if(kind==='brief')return <div className="conversation-card inline-feature"><Brief userId={userId} data={imported} queue={queue} approve={approve} open={open} addDemo={addDemo}/></div>;
  if(kind==='studio')return <div className="conversation-card inline-feature"><Studio userId={userId} draft={briefText||''} setDraft={()=>{}} add={add} imported={imported} reviewMessage={item=>{add(item);setReview(item)}}/>{review&&<MessageReview item={review} close={()=>setReview(null)} connect={()=>open('Connect')}/>}</div>;
  if(kind==='full-approvals'||kind==='approvals')return <div className="conversation-card inline-feature"><Approvals queue={queue} approve={approve} update={update} open={open} onReviewClosed={()=>{}}/></div>;
  if(kind==='ad'||kind==='ad-edit')return <AdCreative imported={imported} add={add} openAudience={kind==='ad-edit'}/>;
  if(kind==='seo')return <div className="conversation-card seo-card"><ConnectedInsights data={imported} initialTab="Local search"/>{sample?<><p className="fine">Suggested content for your review</p>{demoWeek.searchInsights.map((query,i)=>{const id=`local-search-${i}`;const item=queue.find(q=>q.id===id);return <div className="conversation-row" key={id}><span>{['Guide to Downtown LA nail care','Gel-X extensions: what to expect','Russian manicure care guide'][i]}<small>{query.label}</small></span><button className="link" disabled={!!item} onClick={()=>addDemo({id,title:['Guide to Downtown LA nail care','Gel-X extensions: what to expect','Russian manicure care guide'][i],type:'Content',effect:'Local search visibility',status:'Needs your yes',time:'Today'})}>{item?'Added':'Add for approval'}</button></div>})}</>:<p>Connect Search Console to prepare content from your own queries.</p>}<button className="link" onClick={()=>open('Approvals')}>Review approvals</button></div>;
  if(kind==='draft')return <Draft imported={imported} add={add} open={open}/>;
  if(kind==='gap'){
    if(!sample)return <div className="conversation-card"><p>I need calendar access and verified client history to suggest matches.</p><button className="link" onClick={()=>open('Connect')}>Open connections</button></div>;
    const slot=demo.openings.find(item=>item.day==='Thu')!;return <div className="conversation-card"><strong>Thursday · 1:30 PM · {slot.service}</strong><p>{slot.hours} open chair-hours</p>{eligibleClients(slot.service).slice(0,2).map(client=>{const id=`gap-${slot.day}-${client.id}`;const body=`Hi ${client.name}, it’s Eve. I have a ${slot.service} opening Thursday at 1:30 PM. Would you like me to hold it for you?`;return <div className="conversation-row" key={id}><div><strong>{client.name}</strong><small>Due {client.dueDays} days ago · {client.visitCount} visits</small></div><button className="link" disabled={approved.includes(id)} onClick={()=>{addDemo({id,title:`${slot.service} opening · ${client.name}`,type:'Message',effect:`Thursday at 1:30 PM · ${money(demo.assumptions.averageCM)} contribution`,status:'Approved',time:'Today',body});setApproved(current=>[...current,id]);void navigator.clipboard.writeText(body).then(()=>toast('Copied for Square Messages. No message was sent.')).catch(()=>toast('Approved. Copy the message from Approvals.'))}}>{approved.includes(id)?'Approved':'Approve & copy'}</button></div>})}<button className="link" onClick={()=>open('Today')}>See all openings</button></div>;
  }
  if(kind==='channels'){
    const rows=imported?Object.entries(summary!.current.reduce<Record<string,number>>((acc,row)=>{const name=row.acquisition_channel||'Not attributed';acc[name]=(acc[name]||0)+1;return acc},{})).slice(0,4):demo.channels.slice(0,4).map(row=>[row.name,row.appts] as [string,number]);
    return <div className="conversation-card"><div className="conversation-table"><table><tbody>{rows.map(([name,count])=><tr key={name}><td>{name}</td><td><strong>{count} appointments</strong></td></tr>)}</tbody></table></div><button className="link" onClick={()=>open('Channels')}>See channels</button></div>;
  }
  if(kind==='money'){const points=summary?summary.months.map(m=>({month:m.month,value:m.gross})):[...demo.monthly].map(m=>({month:m.month,value:m.net}));return <div className="conversation-card"><p>{summary?'Reported gross':'Net profit'}</p><div className="conversation-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={points}><XAxis dataKey="month" tickLine={false} axisLine={false}/><Tooltip formatter={(value:number)=>money(value)}/><Area type="monotone" dataKey="value" stroke="var(--accent-text)" fill="var(--blush)" strokeWidth={2}/></AreaChart></ResponsiveContainer></div><div className="conversation-card-actions"><button className="link" onClick={()=>open('Money')}>See money</button><button className="link" onClick={()=>open('PrintMoney')}>Download PDF</button></div></div>}
  if(kind==='plan')return <div className="conversation-card inline-plan">{imported?<label className="slider-row"><span>Monthly net target <strong>{money(target)}</strong></span><input type="range" min={demo.assumptions.minTarget} max={demo.assumptions.maxTarget} step={500} value={target} onChange={e=>setTarget(Number(e.target.value))}/></label>:<Plan target={target} setTarget={setTarget}/>}<button className="link" onClick={()=>open('Plan')}>Open plan</button></div>;
  return <div className="conversation-card">{sample?<p className="conversation-card-copy">{demoWeek.brief}</p>:<p>Open the weekly brief for your latest letter.</p>}<button className="link" onClick={()=>open('Brief')}>Open brief</button></div>;
}
