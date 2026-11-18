import { useState } from 'react';
import { money } from '@/data/demo';
import { demoWeek } from '@/data/demoWeek';
import type { ImportedDataset } from '@/lib/importedAnalytics';
import { useOwnerState } from '@/lib/weeklyState';

const categories = ['Service', 'Product', 'Tip', 'Fee', 'Refund'] as const;
function guess(raw: unknown): string | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  const type = String(record.Type ?? record.Category ?? record['Transaction Type'] ?? '').toLowerCase();
  return categories.find(c => type.includes(c.toLowerCase())) ?? null;
}
export default function TransactionTriage({ data, userId }: { data: ImportedDataset | null; userId?: string }) {
  const { value: confirmed, save, ready } = useOwnerState<Record<string,string>>(data && !data.sample ? userId : undefined, 'transaction-categories', {});
  const [choice, setChoice] = useState<Record<string,string>>({});
  const rows = data && !data.sample ? data.rows : demoWeek.transactions;
  const list = rows.map((row, i) => ({ key: 'id' in row && row.id ? row.id : `sample-${i}`, description: row.service || 'Transaction', amount: row.gross, suggested: guess(row.raw) }));
  const guessed = list.filter(r => r.suggested).length;
  const queued = list.filter(row=>!confirmed[row.key]);
  return <section className="card view-card"><span className="eyebrow">TRANSACTION TRIAGE</span><h2>Review transaction categories.</h2><p className="fine">{data && !data.sample ? (list.length ? `${Math.round(100*guessed/list.length)}% suggested automatically` : 'No imported transactions to review.') : `${Math.round(100*demoWeek.categorization.automatic/demoWeek.categorization.total)}% categorization quality · ${queued.length} transactions to review`}</p><div className="pnl">{queued.slice(0,100).map(row=><div key={row.key}><span>{row.description} · {row.amount === null ? 'Amount unavailable' : money(row.amount)}<br/><small>Suggested: {row.suggested || 'Needs review'}{confirmed[row.key] ? ` · Confirmed: ${confirmed[row.key]}` : ''}</small></span><span><select aria-label={`Category for ${row.description}`} value={choice[row.key] || confirmed[row.key] || row.suggested || ''} onChange={e=>setChoice({...choice,[row.key]:e.target.value})}><option value="">Choose category</option>{categories.map(c=><option key={c}>{c}</option>)}</select> <button className="button ghost small" disabled={!ready || !(choice[row.key] || row.suggested) || (!userId && !!data && !data.sample)} onClick={()=>void save({...confirmed,[row.key]:choice[row.key] || row.suggested!})}>Confirm</button></span></div>)}</div>{!userId&&data&&!data.sample&&<p className="fine">Sign in to save confirmations.</p>}</section>;
}
