import { useState } from 'react';
import { demoWeek } from '@/data/demoWeek';
import type { ImportedDataset } from '@/lib/importedAnalytics';
export default function ConnectedInsights({ data, initialTab='Instagram' }: { data: ImportedDataset | null; initialTab?: 'Instagram'|'Local search'|'Website' }) {
  const [tab,setTab]=useState<'Instagram'|'Local search'|'Website'>(initialTab);
  if(data && !data.sample) return <section className="card view-card"><h2>Connected insights.</h2><p>Connect your accounts to see post, search and traffic insights.</p></section>;
  const posts=[...demoWeek.instagram].sort((a,b)=>b.saves/b.reach-a.saves/a.reach);
  return <section className="card view-card"><div className="view-card-head"><div><span className="eyebrow">CONNECTED INSIGHTS</span><h2>See what brings clients in.</h2></div><div className="segmented">{(['Instagram','Local search','Website'] as const).map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</div></div>{tab==='Instagram'?<div className="table-scroll"><table><thead><tr><th>Caption</th><th>Code</th><th>Reach</th><th>Likes</th><th>Saves</th><th>Saves / reach</th><th>Bookings</th></tr></thead><tbody>{posts.map(post=><tr key={post.id}><td>{post.caption}</td><td>{post.code}</td><td>{post.reach.toLocaleString()}</td><td>{post.likes}</td><td>{post.saves}</td><td>{(100*post.saves/post.reach).toFixed(1)}%</td><td>{post.bookings}</td></tr>)}</tbody></table></div>:tab==='Local search'?<div className="pnl">{demoWeek.searchInsights.map(item=><div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div>:<div className="pnl">{demoWeek.websiteInsights.map(item=><div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div>}</section>;
}
