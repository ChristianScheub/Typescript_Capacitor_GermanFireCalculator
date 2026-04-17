import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import type { BannerAdOptions } from '@capacitor-community/admob';
import { Capacitor } from "@capacitor/core";
import { config } from './config';

  const showBanner = async () => {
    let adId: string;
    if (Capacitor.getPlatform() === 'android') {
      adId = config.banner.android;
    } else if (Capacitor.getPlatform() === 'ios') {
      adId = config.banner.ios;
    } else {
      adId = config.banner.android;
    }

    const options: BannerAdOptions = {
      adId: adId,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0
    };
    await AdMob.showBanner(options);
  };

  export default showBanner;