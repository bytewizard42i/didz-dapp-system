import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// didz-landing is a fully static site — no backend, no env vars required.
// Vercel auto-detects Vite; `npm run build` outputs static files to dist/.
export default defineConfig({
  plugins: [react()],
  build: {
    // Inline small assets to keep request count low; large media stays as files.
    assetsInlineLimit: 4096,
  },
});
