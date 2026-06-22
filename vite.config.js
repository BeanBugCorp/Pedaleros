import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Security headers for "npm run dev". These headers, directives and values
// are here to not break normal devevelopment. The CSP is not strict, as the one in preview.
const securityHeadersLocal = {
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'X-Content-Type-Options': 'nosniff',
  'content-security-policy-report-only':
    "default-src 'self'; font-src 'self' https://fonts.gstatic.com data:; style-src 'self' https://fonts.googleapis.com; script-src 'self'; img-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  'Strict-Transport-Security': 'max-age=3600; includeSubDomains',
}

// Strict CSP to preview production. Run "npm run build && npm run preview". This will
// compile scripts and css that are run inline or injected by React + Vite.
const securityHeadersProduction = {
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'X-Content-Type-Options': 'nosniff',
  'content-security-policy':
    "default-src 'self'; font-src 'self' https://fonts.gstatic.com data:; style-src 'self' https://fonts.googleapis.com; script-src 'self'; img-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; require-trusted-types-for 'script'; trusted-types 'none'",
  'Strict-Transport-Security': 'max-age=3600; includeSubDomains',
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { headers: securityHeadersLocal },
  preview: { headers: securityHeadersProduction },
})
