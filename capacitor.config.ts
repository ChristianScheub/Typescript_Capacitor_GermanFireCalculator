import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.scheub.fireCalculator',
  appName: 'Fire Rechner',
  webDir: 'dist',
  ios: {
    contentInset: 'never',
    backgroundColor: '#F0F0EC',
  },
  android: {
    backgroundColor: '#F0F0EC',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#F0F0EC',
      showSpinner: false,
    },
  },
};

export default config;
