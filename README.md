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

## Commands for development and production
The security headers under `vercel.json`, are for the webpage that is deployed. Development does not use `vercel.json`, only `vite.config.js`.

Due to the security headers in `vite.config.js`, development for this project should follow the workflow below.

### 1. Development Mode - Development prior to deploying to production
Use `npm run dev` for normal development, just keep in mind that this will not reflect code ready for Production. When developing, `npm run dev` will grab the security headers in the variable `securityHeadersLocal` in file `vite.config.js`. These security headers are more relaxed for React + Vite. When in developement mode, React + Vite need to run inline (inject) scripts and styles for page speed. Remember, one of our security headers that the browser enforces is to avoid script or styles injection for security reasons.

DevTools, under `npm run dev`, will show the following general issues:

- Lighthouse tests: Lighthouse might not detect these security headers, ignore.
- Console: The Content Security Policy (CSP) is in report mode, it will show issues that are violating the CSP rules under the console. Review if there are any issues in the console.
- Improvements: Under the improvements tab/space, it will surely show that CSP is blocking execution of scripts or styles. If these are from React or Vite execution files, ignore.

### 2. Prduction Build - To validate production ready code
Because `npm run dev` does not show "the complete picture", we need a way to preview how our webpage will look when it's deployed. Running 
```
npm run build && npm run preview
```
will do the following:

- React + Vite will no longer use inline scripts/styles, as they will compile the project. 
- The project will use the security headers under `securityHeadersProduction` in file `vite.config.js`. These are the same security headers under `vercel.json`, they are strict and are not in report mode.
- If anything breaks, the page might not "load" and everything will be logged in DevTools.

DevTools might show the following:

- Lighthouse tests: Lighthouse will detect the security headers. You can check under Network > localhost or client.
- Console: Any issue will be logged in the console.
- Improvements: These will be real Improvements. They will be present in the deployed webpage, unless attended to.

So before a Pull Request, always verify that your code is prodcution ready, by running `npm run build && npm run preview`.
