import { FunctionsHttpError } from '@supabase/supabase-js';
import { isConfigured, supabase } from './supabase';

export type TutorTask = 'generate' | 'grade' | 'placement' | 'rp_open' | 'rp_turn';
export type TutorError = { code: string; message: string };

const MESSAGES: Record<string, string> = {
  daily_limit: "You've reached today's practice limit. It resets tomorrow.",
  rate_limited: 'The tutor is busy right now. Wait a minute and try again.',
  not_signed_in: 'Your session expired. Sign in again.',
  refused: "The tutor couldn't answer that one. Try a different sentence.",
  offline: "Can't reach the tutor. Check your connection and try again.",
};

/** Calls the `tutor` Edge Function. Throws a TutorError with a readable message. */
export async function tutor<T>(task: TutorTask, data: unknown): Promise<T> {
  if (!isConfigured) throw { code: 'offline', message: MESSAGES.offline } as TutorError;
  const { data: out, error } = await supabase.functions.invoke('tutor', { body: { task, data } });
  if (!error) return out as T;
  let code = 'offline';
  if (error instanceof FunctionsHttpError) {
    try { code = (await error.context.json()).code ?? 'server_error'; } catch { code = 'server_error'; }
  }
  throw { code, message: MESSAGES[code] ?? "The tutor didn't answer. Try again in a moment." } as TutorError;
}

export const errorText = (e: unknown) => (e as TutorError)?.message ?? MESSAGES.offline;
