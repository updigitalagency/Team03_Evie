import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
export function useBrowState<T>(userId:string|undefined,key:string,initial:T) {
  const [value,setValue]=useState<T>(initial);const [ready,setReady]=useState(!userId);const writes=useRef<Promise<void>>(Promise.resolve());
  useEffect(()=>{let active=true;setValue(initial);setReady(!userId);if(userId)void supabase.from('brow_down_state').select('value').eq('owner_id',userId).eq('key',key).maybeSingle().then(({data,error})=>{if(!active)return;if(error)toast.error('Could not load Brow Down data.');else if(data)setValue(data.value as T);setReady(true)});return()=>{active=false}; // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userId,key]);
  const save=(next:T)=>{setValue(next);if(!userId)return;writes.current=writes.current.then(async()=>{const {error}=await supabase.from('brow_down_state').upsert({owner_id:userId,key,value:next as Json,updated_at:new Date().toISOString()},{onConflict:'owner_id,key'});if(error)toast.error('Could not save Brow Down data.')})};
  return {value,save,ready};
}
