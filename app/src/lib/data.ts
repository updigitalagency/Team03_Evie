import { fetchEventSource } from '@microsoft/fetch-event-source';
import { supabase, SUPABASE_URL } from '@/integrations/supabase/client';
import { demo, type Approval } from '@/data/demo';

export async function signIn(email:string){return supabase.auth.signInWithOtp({email,options:{emailRedirectTo:`${window.location.origin}/`}})}
export async function loadWorkspace(userId:string){
  const {data:settings,error}=await supabase.from('studio_settings').select('settings').eq('studio_id',userId).maybeSingle();
  if(error)throw error;
  if(!settings){const result=await supabase.from('studio_settings').insert({studio_id:userId,settings:{demo_seeded:true,studio:demo.studio}});if(result.error&&result.error.code!=='23505')throw result.error;}
  const result=await supabase.from('approvals').select('*').eq('studio_id',userId).order('updated_at',{ascending:false});if(result.error)throw result.error;
  if(!result.data.length){const seeded=demo.approvals.map(item=>({studio_id:userId,item_key:item.id,title:item.title,type:item.type,effect:item.effect,status:item.status}));const inserted=await supabase.from('approvals').upsert(seeded,{onConflict:'studio_id,item_key',ignoreDuplicates:true});if(inserted.error)throw inserted.error;return demo.approvals.map(item=>({...item}));}
  return result.data.map(row=>({id:row.item_key,title:row.title,type:row.type,effect:row.effect||'',status:row.status,time:new Date(row.updated_at).toLocaleDateString(),body:row.message_body||undefined}));
}
export async function saveApproval(userId:string,item:Approval){const result=await supabase.from('approvals').upsert({studio_id:userId,item_key:item.id,title:item.title,type:item.type,effect:item.effect,status:item.status,message_body:item.body||null,approved_by:item.status==='Approved'?userId:null,approved_at:item.status==='Approved'?new Date().toISOString():null,updated_at:new Date().toISOString()},{onConflict:'studio_id,item_key'});if(result.error)throw result.error;}
export async function saveTheme(userId:string,dark:boolean){const current=await supabase.from('studio_settings').select('settings').eq('studio_id',userId).maybeSingle();if(current.error)throw current.error;const value=current.data?.settings;const settings=typeof value==='object'&&value!==null&&!Array.isArray(value)?value:{};const result=await supabase.from('studio_settings').upsert({studio_id:userId,settings:{...settings,theme:dark?'dark':'light'},updated_at:new Date().toISOString()});if(result.error)throw result.error;}
let pendingDemoCode: Promise<string|null> | null = null;
export function requestDemoCode() {
  if (!pendingDemoCode) pendingDemoCode = new Promise<string|null>(resolve => window.dispatchEvent(new CustomEvent('evie-request-demo-code',{detail:resolve}))).finally(() => { pendingDemoCode = null; });
  return pendingDemoCode;
}
export async function generate(prompt:string,mode:'chat'|'studio'|'discovery',sessionId:string,context?:string,onChunk?:(text:string)=>void,studio?:'brow-down'){
  const {data:{session}}=await supabase.auth.getSession();
  let demoCode=session?.user?null:localStorage.getItem('evie-demo-code');
  if(!session?.user&&!demoCode){demoCode=await requestDemoCode();if(!demoCode)throw new Error('Demo code entry cancelled.');}
  const body={prompt,mode,demoCode,studio,context:mode==='discovery'?'':context||JSON.stringify({studio:demo.studio,monthly:demo.monthly,channels:demo.channels,services:demo.services,clients:demo.clients,openings:demo.openings,assumptions:demo.assumptions,extra:demo.extra,source:'Demo data'})};
  const timeout=AbortSignal.timeout(mode==='studio'?90000:60000);
  if(mode==='studio'||mode==='discovery'){
    const result=await supabase.functions.invoke('evie-ai-2362fcb7a837',{headers:{'x-session-id':sessionId},signal:timeout,body});
    if(timeout.aborted)throw new Error('Evie took longer than 90 seconds. Please try again.');
    if(result.error){let message=result.error.message;const response='context' in result.error?result.error.context:null;if(response instanceof Response){if(response.status===401&&!session?.user)localStorage.removeItem('evie-demo-code');try{const payload=await response.clone().json();message=typeof payload.error==='string'?payload.error:payload.error?.message||message;}catch{/* Preserve the request error. */}}throw new Error(message);}
    const content=result.data?.text;
    if(typeof content!=='string'||!content.trim()){const raw=result.data;console.error('Studio empty response JSON shape:', {keys:raw&&typeof raw==='object'?Object.keys(raw):[],contentType:typeof content});throw new Error('AI returned an empty response.');}
    if(demoCode)localStorage.setItem('evie-demo-code',demoCode);return content;
  }
  let text=''; let done=false;
  try { await fetchEventSource(`${SUPABASE_URL}/functions/v1/evie-ai-2362fcb7a837`,{
    method:'POST',openWhenHidden:true,signal:timeout,
    fetch:async (_input,init)=>{const result=await supabase.functions.invoke('evie-ai-2362fcb7a837',{headers:{'x-session-id':sessionId},signal:init?.signal||undefined,body});if(result.error){const response='context' in result.error?result.error.context:null;if(response instanceof Response)return response;throw result.error;}if(!(result.data instanceof Response))throw new Error('AI returned an invalid response.');return result.data;},
    async onopen(response){const type=response.headers.get('content-type')||'';if(!response.ok){if(response.status===401&&!session?.user)localStorage.removeItem('evie-demo-code');const raw=await response.text();let message=`Request failed: ${response.status}`;try{const payload=JSON.parse(type.includes('text/event-stream')?(raw.match(/(?:^|\n)data:\s*(.+)/)?.[1]||'{}'):raw);message=typeof payload.error==='string'?payload.error:payload.error?.message||message;}catch{/* Preserve the status. */}throw new Error(message);}if(!type.includes('text/event-stream'))throw new Error('AI returned an invalid response.');},
    onmessage(event){if(!event.data)return;if(event.data==='[DONE]'){done=true;return;}let chunk;try{chunk=JSON.parse(event.data)}catch{return}if(!chunk||typeof chunk!=='object')return;if(chunk.error)throw new Error(typeof chunk.error==='string'?chunk.error:chunk.error.message||'AI is temporarily unavailable.');if(typeof chunk.text==='string'&&chunk.text){text+=chunk.text;onChunk?.(text);}},
    onclose(){if(!done)throw new Error('AI response ended unexpectedly.');},onerror(error){throw error;},
  }); } catch(error) { if(mode==='studio'&&timeout.aborted)throw new Error('Evie took longer than 90 seconds. Please try again.'); throw error; }
  if(mode==='studio'&&timeout.aborted)throw new Error('Evie took longer than 90 seconds. Please try again.');
  if(!done||!text.trim())throw new Error('AI returned an empty response.');if(demoCode)localStorage.setItem('evie-demo-code',demoCode);return text;
}

export async function saveDraft(title:string,content:string){const {data:{user},error}=await supabase.auth.getUser();if(error||!user)return false;const result=await supabase.from('drafts').insert({studio_id:user.id,title,content});if(result.error)throw result.error;return true;}

export async function loadTheme(userId:string){const result=await supabase.from('studio_settings').select('settings').eq('studio_id',userId).maybeSingle();if(result.error)throw result.error;const settings=result.data?.settings;return settings&&typeof settings==='object'&&!Array.isArray(settings)&&settings.theme==='dark';}
