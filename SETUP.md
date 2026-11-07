# Setting up De Uno (no coding needed)

Four parts. Parts A and B are done in your web browser; part C on your computer and iPhone.

## A. Anthropic API key: lets the app talk to Claude

1. Go to **console.anthropic.com** and sign up (this is separate from your Claude.ai account).
2. Open **Billing** (Settings → Billing) and add a payment card and a small amount of credit, e.g. $5–10. Optional: set a monthly spend limit there.
3. Open **API Keys** → **Create Key**. Name it `De Uno`.
4. Copy the key (it starts with `sk-ant-`). It is shown only once. Keep it in a password manager or note for the next part. **Never share it in a chat, email or screenshot.**

## B. Supabase: accounts, saved progress, and the AI tutor

1. Go to **supabase.com/dashboard** → **New project**. Name: `de-uno`. Create and save a database password. Pick the region closest to you. Wait ~2 minutes while it starts.
2. **Create the tables.** Left menu → **SQL Editor** → **New query**. Open `supabase/migrations/20261107000000_init.sql` in this repository on GitHub, copy everything, paste it in, press **Run**. You should see "Success. No rows returned".
3. **Store the Anthropic key.** Left menu → **Edge Functions** → **Secrets** → add a secret named `ANTHROPIC_API_KEY` with your `sk-ant-...` key as the value → **Save**.
4. **Add the tutor.** Edge Functions → **Deploy a new function** → **Via Editor**. Name it exactly `tutor`. Delete the sample code, paste everything from `supabase/functions/tutor/index.ts`, then **Deploy**.
5. **Make sign-in emails send a code.** Left menu → **Authentication** → **Emails** (Templates) → **Magic Link**. Replace the message with:
   `Your De Uno code is {{ .Token }}` → **Save**.
6. **Copy two values for the app.** Click **Connect** at the top of the project (or Project Settings → API). Copy the **Project URL** and the **Publishable key** (or **anon public** key). These two are safe to share; send them to Claude to put into the app. Do **not** share the `service_role` / secret key.

## C. Run it on your iPhone

Your iPhone loads the app from your computer while you test, so you need both, on the same Wi-Fi.

1. **On your computer**, install **Node.js** from **nodejs.org** (the "LTS" button, then the installer, all defaults).
2. Install **GitHub Desktop** from **desktop.github.com** and sign in. Choose **Clone a repository** → `de-uno` → **Clone**. This downloads the app's code to a folder on your computer.
3. Open the **Terminal** app (Mac: press ⌘+Space, type Terminal) or **PowerShell** (Windows: Start menu, type PowerShell). In GitHub Desktop choose **Repository → Open in Terminal** (or **Open in Command Prompt** on Windows) so you start in the right folder.
4. Type this and press Enter. It downloads the building blocks the app needs (a few minutes, only the first time):
   `npm install`
5. Type this and press Enter. It starts the app server and shows a QR code:
   `npx expo start`
6. **On your iPhone**, install **Expo Go** from the App Store. Open the iPhone **Camera**, point it at the QR code, and tap the banner. De Uno opens inside Expo Go.

Next time you want to use it: open Terminal in the folder again, run `npx expo start`, scan the code. When there's an update, press **Fetch origin / Pull** in GitHub Desktop first.
If the phone can't connect, run `npx expo start --tunnel` instead.
