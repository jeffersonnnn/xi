import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'xyz.worldcupxi.app',
  appName: '$XI',
  webDir: 'public',
  server: {
    // Point to your live deployed URL once deployed
    // url: 'https://worldcupxi.xyz',
    // For local development, comment the above and the WebView loads from webDir
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#0A0F0C',
    preferredContentMode: 'mobile',
  },
  android: {
    backgroundColor: '#0A0F0C',
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0A0F0C',
      showSpinner: false,
      launchAutoHide: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0A0F0C',
    },
  },
};

export default config;
