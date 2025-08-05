import type { CapacitorConfig } from '@capacitor/cli';
import * as dotenv from "dotenv";
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

const config: CapacitorConfig = {
    appId: 'com.example.streamecommerce',
    appName: 'stream-ecommerce',
    webDir: 'build/static',
    server: process.env.CAP_HOST === "server"
        ? {
            url: process.env.LOCAL_VITE_URL,
            cleartext: true,
            androidScheme: "http",
        }
        : {},
    android: {
        allowMixedContent: true,
    },
    plugins: {
        CapacitorStripe: {
            publishableKey: process.env.PUBLIC_STRIPE_PUBLISHABLE,
        },
    },
};

export default config;
