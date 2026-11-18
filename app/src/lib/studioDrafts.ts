export type StudioDrafts = { reel: string; caption: string; gbp: string; sms: string };

export function parseStudioDrafts(text: string): StudioDrafts {
  const parsed: unknown = JSON.parse(text.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/, ''));
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid draft format.');
  const value = parsed as Record<string, unknown>;
  if (!['reel', 'caption', 'gbp', 'sms'].every(key => typeof value[key] === 'string' && (value[key] as string).trim())) throw new Error('Incomplete drafts.');
  const limits: Record<string, number> = { reel: 90, caption: 60, gbp: 60, sms: 40 };
  if (Object.entries(limits).some(([key, limit]) => (value[key] as string).trim().split(/\s+/).length > limit)) throw new Error('A draft exceeded its word limit.');
  return value as StudioDrafts;
}

export async function requestStudioDrafts(request: (retry: boolean) => Promise<string>): Promise<StudioDrafts> {
  const first = await request(false);
  try { return parseStudioDrafts(first); } catch { return parseStudioDrafts(await request(true)); }
}
