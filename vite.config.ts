import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '')

  const port = env.VITE_PORT ? parseInt(env.VITE_PORT) : 5173
  const previewPort = env.VITE_PREVIEW_PORT ? parseInt(env.VITE_PREVIEW_PORT) : 4173
  const host = env.VITE_HOST || 'localhost'

  return {
    plugins: [react()],
    server: {
      host,
      port,
    },
    preview: {
      host,
      port: previewPort,
    },
  }
})
