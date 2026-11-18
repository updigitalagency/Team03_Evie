import { useState } from 'react';
import { type Approval } from '@/data/demo';
import { googleDraft, metaDraft, type AdExportDetails } from '@/lib/adExports';

const save = (name:string,content:string,type:string) => {const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
export default function SpendDownloads({item}:{item:Approval}) {
  let creative:AdExportDetails|undefined;
  try { const parsed=item.body?JSON.parse(item.body):null; if(parsed?.kind==='ad-creative' && parsed.copy && parsed.audience && typeof parsed.daily==='number') creative=parsed as AdExportDetails; } catch { /* Older approvals do not carry creative details. */ }
  const found=item.title.match(/\$([\d,]+(?:\.\d{1,2})?)/);
  const [budget,setBudget]=useState(found?Number(found[1].replace(/,/g,'')):0);
  const daily=(budget/30).toFixed(2);
  return <div className="spend-downloads"><p>Drafts for review, not guaranteed imports. Compare headers and required fields with the current Google Ads Editor and Meta Ads Manager templates; confirm location targeting and account settings before launch.</p><label>Monthly budget for draft <span>$</span><input type="number" min="0" value={budget||''} onChange={e=>setBudget(Math.max(0,Number(e.target.value)))}/></label><span className="fine">Daily budget: ${daily} per platform, if used separately. Meta location type is intentionally blank until verified in your account. Age, interests, image and booking code need manual review in the platform.</span><div className="action-buttons"><button disabled={!budget} className="button ghost small" onClick={()=>save('google-ads-draft.csv',googleDraft(daily,creative),'text/csv;charset=utf-8')}>Google Ads Editor CSV</button><button disabled={!budget} className="button ghost small" onClick={()=>save('meta-ads-draft.csv',metaDraft(daily,creative),'text/csv;charset=utf-8')}>Meta bulk-import CSV</button><button className="button ghost small" onClick={()=>save('launch-checklist.txt','1. Review budget and split between platforms.\n2. Verify the URL, creative and ad copy.\n3. Confirm the 5-mile location around 90014.\n4. Map columns and required fields to the current platform import template.\n5. Check ads and targeting before publishing.\nNothing has been launched.','text/plain;charset=utf-8')}>Launch checklist</button></div></div>;
}
