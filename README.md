# De Uno

A Spanish tutor for iPhone. It finds your level, then gives you endless typed-sentence practice with corrections and spaced review. It also has a grammar library and roleplay conversations. Champagne-and-city-lights night theme; correct answers sparkle.

- **Práctica** — one card at a time, no modules. Every answer is a full sentence you type. Claude grades it, shows your mistakes, and decides what comes next. Topics you miss come back a few cards later; topics you know come back after growing gaps.
- **Gramática** — 36 topics from A1 to C1 with tables, examples and "watch out" notes. Status (Nuevo / En progreso / Dominado) updates as you practice.
- **Rol** — 8 scenes plus your own. Your partner talks at your level and corrects each message.

## How it fits together

```
iPhone app (Expo / React Native)
   │  signs in with an email code, saves progress      ┌──────────────────────────┐
   ├──────────────────────────────────────────────────▶│ Supabase                 │
   │  asks the tutor: generate / grade / roleplay      │  • Auth (email codes)    │
   └──────────────────────────────────────────────────▶│  • profiles, usage tables│
                                                       │  • Edge Function "tutor" │──▶ Claude API
                                                       └──────────────────────────┘
```

The Anthropic API key lives only in the Supabase Edge Function, never in the app. Each user gets 400 tutor calls a day (change `TUTOR_DAILY_LIMIT`).

## Try it right now (no server)

Without a `.env` file the app opens in **offline mode**: no AI, no accounts, built-in practice sentences only.

```bash
npm install
```

```bash
npx expo start
```

Install **Expo Go** from the App Store on your iPhone, then scan the QR code with the iPhone Camera app.

## Turn on the AI tutor and accounts (one-time setup)

You need a free Supabase account and an Anthropic API key.

1. **Create a Supabase project** at [supabase.com](https://supabase.com/dashboard). Pick a region near you and save the database password somewhere safe.
2. **Install the Supabase CLI** and link this folder to the project (the project ref is in the dashboard URL):

   ```bash
   npx supabase login
   ```

   ```bash
   npx supabase link --project-ref YOUR-PROJECT-REF
   ```
3. **Create the tables:**

   ```bash
   npx supabase db push
   ```
4. **Store the Anthropic key on the server**, not in the app (create a key at [console.anthropic.com](https://console.anthropic.com)):

   ```bash
   npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
   ```
5. **Deploy the tutor function:**

   ```bash
   npx supabase functions deploy tutor
   ```
6. **Make sign-in send a 6-digit code.** In the dashboard go to Authentication → Emails → "Magic Link" template and make sure the body includes `{{ .Token }}`, e.g. `Your De Uno code is {{ .Token }}`.
   For more than a few test users, set up custom SMTP (Authentication → SMTP); Supabase's built-in email is rate-limited.
7. **Point the app at your project:** copy `.env.example` to `.env`, paste the Project URL and publishable (anon) key, then restart `npx expo start`.

### Optional server settings

```bash
npx supabase secrets set TUTOR_MODEL=claude-opus-5-5 TUTOR_DAILY_LIMIT=400
```

The tutor uses Claude Opus 5.5 by default, with structured JSON outputs and automatic fallback if a request is declined. Set `TUTOR_MODEL=claude-haiku-5-5` for a much cheaper, faster (and less thorough) tutor.

## Project layout

| Path | What it is |
|---|---|
| `src/app/` | Expo Router entry (`_layout.tsx`, `index.tsx`) |
| `src/screens/` | Sign-in, level check, Práctica, Gramática, Rol, stats |
| `src/components/` | UI kit, city skyline, sparkle burst, tab bar, feedback card |
| `src/lib/engine.ts` | Level tracking, topic choice, spaced review |
| `src/lib/content.ts` | Grammar library, level-check prompts, roleplay scenes |
| `supabase/functions/tutor/` | Edge Function: prompts, JSON schemas, Claude calls |
| `supabase/migrations/` | `profiles` and `usage` tables with row-level security |

## Checks

```bash
npx tsc --noEmit
```

## Later: putting it on the App Store

Not needed for Expo Go testing. When you want a real install: join the Apple Developer Program ($99/year), then `npx eas-cli@latest build --platform ios` and `npx eas-cli@latest submit`. You'll also need an app icon, screenshots and a privacy policy.
