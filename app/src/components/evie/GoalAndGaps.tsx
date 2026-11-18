import { useState } from 'react';
import { toast } from 'sonner';
import { demo, money, type Approval } from '@/data/demo';
import { demoWeek, demoGoal, eligibleClients } from '@/data/demoWeek';
import { type ImportedDataset } from '@/lib/importedAnalytics';

const times = ['2:00 PM','11:00 AM','1:30 PM','3:00 PM','10:00 AM','12:00 PM'];
const dayNames: Record<string,string> = {Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday'};
export default function GoalAndGaps({ data, target, addDemo }: { data: ImportedDataset | null; target: number; addDemo: (item: Approval) => void }) {
  const [approved, setApproved] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const sample = !data || data.sample;
  if (!sample) return <><section className="card view-card"><span className="eyebrow">GOAL TRACKER</span><h2>Keep your goal in view.</h2><p>Monthly target: {money(target)}. Current net and pace require verified costs and spend.</p></section><section className="card view-card"><span className="eyebrow">GAP FILLER</span><h2>Fill the right openings.</h2><p>Live matching requires calendar access, verified service history and marketing consent.</p></section></>;
  const goal=demoGoal(target);
  const openHours=demo.openings.reduce((sum,slot)=>sum+slot.hours,0);
  const approve = async (slot: typeof demo.openings[number], time:string, client: ReturnType<typeof eligibleClients>[number]) => {
    const key=`gap-${slot.day}-${client.id}`;
    const body=`Hi ${client.name}, it’s Eve. I have a ${slot.service} opening ${dayNames[slot.day]} at ${time}. Would you like me to hold it for you?`;
    addDemo({id:key,title:`${slot.service} opening · ${client.name}`,type:'Message',effect:`${dayNames[slot.day]} at ${time} · ${money(demo.assumptions.averageCM)} contribution`,status:'Approved',time:'Today',body});
    setApproved(current=>[...current,key]);
    try { await navigator.clipboard.writeText(body); toast('Approved and copied for Square Messages. No message was sent.'); }
    catch { toast('Approved. Copy the message from Approvals; nothing was sent.'); }
  };
  return <>
    <section className="card view-card"><div className="view-card-head"><div><span className="eyebrow">OCTOBER GOAL</span><h2>Keep your goal in view.</h2></div><span className="pill">{goal.status}</span></div><div className="weekly-preview-grid"><div><strong>{money(goal.net)} / {money(target)}</strong><p>Net so far</p></div><div><strong>{goal.appointments} of {goal.needed}</strong><p>Appointments needed</p></div><div><strong>{goal.daysLeft} days</strong><p>Left this month</p></div></div><progress className="goal-progress" max={100} value={goal.progress} aria-label="Net goal progress"/><p>Approve the three actions on this page to close about {money(demo.extra.forecast)} of the gap.</p></section>
    <section className="card view-card"><span className="eyebrow">GAP FILLER</span><h2>Fill the right openings.</h2><div className="weekly-preview-grid"><div><strong>{demoWeek.filledHours} of {openHours} open hours</strong><p>Gaps filled this month</p></div><div><strong>{money(demo.assumptions.averageCM)}</strong><p>Expected contribution per filled slot</p></div></div><p className="fine">Approve &amp; send copies the message for Square Messages; it does not send it.</p><div className="gap-grid">{demo.openings.filter(slot=>!skipped.includes(slot.day)).map(slot=><article className="gap-card" key={slot.day}><span className="eyebrow">{dayNames[slot.day]} · {times[demo.openings.indexOf(slot)]}</span><h3>{slot.service} · {slot.hours} open hours</h3>{eligibleClients(slot.service).slice(0,expanded.includes(slot.day)?undefined:2).map(client=>{const time=times[demo.openings.indexOf(slot)];const key=`gap-${slot.day}-${client.id}`;return <div className="gap-client" key={client.id}><strong>{client.name}</strong><div className="reason-chips"><span>{slot.service}</span><span>Due {client.dueDays} days ago</span><span>{client.visitCount} visits</span></div><p>Hi {client.name}, it’s Eve. I have a {slot.service} opening {dayNames[slot.day]} at {time}. Would you like me to hold it for you?</p><button className="button ghost small" disabled={approved.includes(key)} onClick={()=>void approve(slot,time,client)}>{approved.includes(key)?'Approved':'Approve & send'}</button></div>})}{eligibleClients(slot.service).length>2&&<button className="link gap-more" aria-expanded={expanded.includes(slot.day)} onClick={()=>setExpanded(current=>current.includes(slot.day)?current.filter(day=>day!==slot.day):[...current,slot.day])}>{expanded.includes(slot.day)?'Show less':`Show ${eligibleClients(slot.service).length-2} more`}</button>}<button className="button quiet small" onClick={()=>setSkipped(old=>[...old,slot.day])}>Skip</button></article>)}</div></section>
  </>;
}
