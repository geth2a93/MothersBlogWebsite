import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [react()],

        server: {
            proxy: {
                '/api': {
                    target: "https://mothersblogwebsitebackend.onrender.com/api",
                    changeOrigin: true,
                },

                '/admin': {
                    target:"https://mothersblogwebsitebackend.onrender.com/admin",
                    changeOrigin: true,
                },

                '/auth': {
                    target: "https://mothersblogwebsitebackend.onrender.com/auth",
                    changeOrigin: true,
            },
            },
        },
    }
})