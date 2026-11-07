# Setting up De Uno (no coding, no payment)

Everything here uses free plans: Google Gemini (AI), Supabase (accounts and saved progress), Vercel (puts the app online).
All steps are in your web browser. When you finish, De Uno is an icon on your iPhone home screen.

## Part 1. Free Gemini key: lets the app use Google's AI

1. Go to **aistudio.google.com** and sign in with your Google account.
2. Click **Get API key** (left menu), then **Create API key**. If it asks for a project, let it create one.
3. Copy the key (it starts with `AIza`) into your notes.
   Keep it private: don't send it in chats, emails or screenshots. You'll paste it into Supabase in Part 2.
4. Optional: on the same page, check the free-tier limits for your key (requests per minute and per day).

Note: on Google's free tier, what you send (your practice sentences) may be used by Google to improve its products.

## Part 2. Supabase: accounts, saved progress, and the AI tutor

1. Go to **supabase.com/dashboard** and click **New project**.
   Name: `de-uno`. Create a database password and save it. Region: the one closest to you. Wait about 2 minutes.
2. **Create the tables.**
   On GitHub, open `supabase/migrations/20261107000000_init.sql` in this repository and copy all of it.
   In Supabase: left menu, **SQL Editor**, then **New query**. Paste, then click **Run**. You should see "Success".
3. **Store your Gemini key.**
   Left menu, **Edge Functions**, then **Secrets**. Add a secret named `GEMINI_API_KEY` with your `AIza...` key as the value. Click **Save**.
4. **Add the tutor.**
   **Edge Functions**, then **Deploy a new function**, then **Via Editor**. Name it exactly `tutor`.
   Delete the sample code. On GitHub, open `supabase/functions/tutor/index.ts`, copy all of it, paste it in, then click **Deploy**.
5. **Make sign-in emails send a code.**
   Left menu, **Authentication**, then **Emails** (Templates), then **Magic Link**.
   Replace the message with `Your De Uno code is {{ .Token }}` and click **Save**.
6. **Send Claude two values.**
   Click **Connect** at the top of the project. Copy the **Project URL** and the **Publishable key** (or **anon public** key) and send them to Claude, who puts them into the app.
   These two are safe to share. Never share the `service_role` or secret key.

## Part 3. Vercel: puts the app online for free

Do this after Claude confirms the two Supabase values are in the app.

1. Go to **vercel.com** and click **Sign Up**, then **Continue with GitHub**. Choose the free **Hobby** plan.
2. Click **Add New…**, then **Project**. Find `de-uno` and click **Import**.
   If you don't see it, click **Adjust GitHub App Permissions** and allow `de-uno`.
3. Leave every setting as it is and click **Deploy**. Wait 2–4 minutes.
4. When it says **Congratulations**, click the preview to open your app. Copy the address (something like `de-uno.vercel.app`).
5. Back in **Supabase**: **Authentication**, then **URL Configuration**. Set **Site URL** to that address and click **Save**.

Every time Claude updates the code on GitHub, Vercel updates the app automatically within a few minutes.

## Part 4. Put De Uno on your iPhone home screen

1. On your iPhone, open **Safari** (it must be Safari) and go to your Vercel address.
2. Tap the **Share** button (square with an arrow), then **Add to Home Screen**, then **Add**.
3. Open De Uno from its new icon. It runs full screen, like an app.
4. Sign in with your email, type the 6-digit code you receive, and take the level check.

To share De Uno with someone, send them the address and these Part 4 steps. Each person signs in with their own email, so everyone's progress is separate.

## Switching to Claude later (optional, paid)

In Supabase **Edge Functions → Secrets**, delete `GEMINI_API_KEY` and add `ANTHROPIC_API_KEY` with a key from console.anthropic.com. The tutor switches to Claude automatically.
