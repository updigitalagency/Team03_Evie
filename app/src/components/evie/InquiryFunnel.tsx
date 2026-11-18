import { demo } from '@/data/demo';
import type { ImportedDataset } from '@/lib/importedAnalytics';
export default function InquiryFunnel({ data }: { data: ImportedDataset | null }) {
  if(data && !data.sample) return <section className="card view-card"><h2>From inquiry to appointment.</h2><p>Connect inquiry and response data to see the funnel.</p></section>;
  return <section className="card view-card"><span className="eyebrow">LAST 30 DAYS</span><h2>From inquiry to appointment.</h2><div className="table-scroll"><table><thead><tr><th>Source</th><th>Inquiries</th><th>Replied within 1 hour</th><th>Booked</th></tr></thead><tbody>{demo.inquiryFunnel.map(row=><tr key={row.source}><td>{row.source==='Website'?'Website form':row.source}</td><td>{row.inquiries}</td><td>{row.replied}</td><td>{row.booked}</td></tr>)}</tbody></table></div></section>;
}
