import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host:true,
    port:5170,
    watch:{
      usePolling: true
    },
    allowedHosts: [
      '.csb.app'           
    ]
  }
})
