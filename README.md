# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Environment variables

This app uses [Supabase](https://supabase.com) for data and authentication. You need a Supabase project and its public API credentials.

1. Copy the example file:

   ```bash
   cp .env.example .env
   ```

2. In your Supabase dashboard, go to **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

3. Fill them into `.env`:

   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

   > Use the bare project URL with **no path or trailing slash** (e.g. `https://abc123.supabase.co`, not `.../rest/v1`). Supabase appends its own paths.

4. Restart the dev server after changing `.env` — Vite only reads environment variables at startup.

`.env` is gitignored. Only the public `anon` key belongs here; never commit the `service_role` key. Access control is enforced through Supabase Row Level Security policies, not by hiding the anon key.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
