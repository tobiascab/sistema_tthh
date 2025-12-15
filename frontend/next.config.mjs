/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    env: {
        BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:8080',
        KEYCLOAK_URL: process.env.KEYCLOAK_URL || 'http://localhost:8081',
        KEYCLOAK_REALM: process.env.KEYCLOAK_REALM || 'cooperativa-reducto',
        KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID || 'tthh-frontend',
    },
};

export default nextConfig;
