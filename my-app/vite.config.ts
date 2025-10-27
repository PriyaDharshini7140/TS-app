import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// Resolve __dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@mui/x-date-pickers/AdapterDateFns', 'date-fns']
  },
  resolve: {
    alias: [
      // AdapterDateFns imports a deep path that isn't exported by date-fns package.json.
      // Map that import to the installed ESM implementation so Vite/esbuild can pre-bundle it.
      {
        find: 'date-fns/_lib/format/longFormatters',
        // Redirect AdapterDateFns' default import to a small shim that provides
        // a default export. The shim imports the real implementation by absolute
        // path and re-exports it as default.
        replacement: path.resolve(__dirname, 'src/shims/date-fns-longFormatters.js')
      }
    ]
  }
})
