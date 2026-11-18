import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

// Each feature has its own row, so saving one preference cannot overwrite another.
export function useOwnerState<T>(userId: string | undefined, key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const writes = useRef<Promise<void>>(Promise.resolve());
  const [ready, setReady] = useState(!userId);
  useEffect(() => {
    let active = true;
    setValue(initial); setReady(!userId);
    if (userId) void supabase.from('evie_weekly_state').select('value').eq('studio_id', userId).eq('key', key).maybeSingle().then(({ data, error }) => {
      if (!active) return;
      if (error) toast.error('Could not load saved preferences.');
      else if (data) setValue(data.value as T);
      setReady(true);
    });
    return () => { active = false; };
    // Initial values are constants supplied by the caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, key]);
  const save = useCallback(async (next: T) => {
    setValue(next);
    if (!userId) return;
    writes.current = writes.current.then(async () => {
      try {
        const { error } = await supabase.from('evie_weekly_state').upsert({ studio_id: userId, key, value: next as Json, updated_at: new Date().toISOString() }, { onConflict: 'studio_id,key' });
        if (error) throw error;
      } catch { toast.error('Could not save this change.'); }
    });
    await writes.current;
  }, [key, userId]);
  return { value, save, ready };
}
