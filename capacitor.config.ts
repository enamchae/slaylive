import type { CapacitorConfig } from '@capacitor/cli';
import * as dotenv from "dotenv";
dotenv.config();

const config: CapacitorConfig = {
  appId: 'com.example.streamecommerce',
  appName: 'stream-ecommerce',
  webDir: 'build/static',
  server: {
    // url: process.env.LOCAL_VITE_URL,
    // cleartext: true,
    androidScheme: "http",
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
