import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.scheub.fireCalculator',
  appName: 'Fire Rechner',
  webDir: 'dist',
  backgroundColor: '#0d0d0d',
  ios: {
    contentInset: 'always',
  },
  android: {
    backgroundColor: '#0d0d0d',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#0d0d0d',
      showSpinner: false,
    },
  },
};

export default config;
