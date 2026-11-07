// De Uno tutor: the only place the Anthropic API key is used.
// POST { task, data } with the user's Supabase session token → JSON result.
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { BadInput, TASKS } from './tasks.ts';

const MODEL = Deno.env.get('TUTOR_MODEL') ?? 'claude-opus-5-5';
const DAILY_LIMIT = Number(Deno.env.get('TUTOR_DAILY_LIMIT') ?? '400');

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const reply = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return reply(405, { code: 'method_not_allowed' });

  // 1. Who is calling? (Supabase also verifies the JWT before this runs.)
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  });
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return reply(401, { code: 'not_signed_in' });

  // 2. Build the task.
  let spec;
  try {
    const body = await req.json();
    const build = TASKS[body?.task];
    if (!build) throw new BadInput('unknown task');
    spec = build(body.data ?? {});
  } catch (e) {
    return reply(400, { code: 'bad_request', message: e instanceof BadInput ? e.message : 'invalid JSON' });
  }

  // 3. Daily limit per user.
  const { data: calls, error: usageErr } = await supabase.rpc('bump_usage');
  if (usageErr) return reply(500, { code: 'usage_error' });
  if (Number(calls) > DAILY_LIMIT) return reply(429, { code: 'daily_limit' });

  // 4. Ask Claude for schema-valid JSON.
  try {
    const res = await anthropic.beta.messages.create({
      model: MODEL,
      max_tokens: 8000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: spec.effort, format: { type: 'json_schema', schema: spec.schema } },
      messages: [{ role: 'user', content: spec.prompt }],
    });
    if (res.stop_reason === 'refusal') return reply(422, { code: 'refused' });
    if (res.stop_reason === 'max_tokens') return reply(502, { code: 'truncated' });
    const text = res.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('');
    return reply(200, JSON.parse(text));
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return reply(429, { code: 'rate_limited' });
    if (e instanceof Anthropic.APIError) {
      console.error('Anthropic API error', e.status, e.message);
      return reply(502, { code: 'upstream_error' });
    }
    console.error('Tutor error', e);
    return reply(500, { code: 'server_error' });
  }
});
