export interface EnvConfig {
    baseUrl: string
    port: number
    buildPort: number
    isDev: boolean
}

/**
 * Gets the environment configuration based on the current environment
 * Handles both local development and Vercel production environments
 */
function getEnvConfig(): EnvConfig {
    const isDev = import.meta.env.DEV

    // For local development
    if (isDev) {
        const port = import.meta.env.VITE_PORT
            ? parseInt(import.meta.env.VITE_PORT as string, 10)
            : 5173

        const buildPort = import.meta.env.VITE_BUILD_PORT
            ? parseInt(import.meta.env.VITE_BUILD_PORT as string, 10)
            : 4173
        const host = import.meta.env.VITE_HOST || 'localhost'

        return {
            baseUrl: `http://${host}:${port}`,
            port,
            buildPort,
            isDev
        }
    }

    // For production (Vercel)
    const prodUrl = import.meta.env.VITE_PROD_URL || 'https://cta-widget.vercel.app'

    return {
        baseUrl: prodUrl,
        port: 443, // Standard HTTPS port
        buildPort: 443,
        isDev
    }
}

export const env = getEnvConfig() 