import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [react()],

        server: {
            proxy: {
                '/api': {
                    target: env.production.VITE_API_URL,
                    changeOrigin: true,
                },

                '/admin': {
                    target: env.VITE_ADMIN_URL,
                    changeOrigin: true,
                },

                '/auth': {
                    target: env.VITE_AUTH_URL,
                    changeOrigin: true,
            },
            },
        },
    }
})