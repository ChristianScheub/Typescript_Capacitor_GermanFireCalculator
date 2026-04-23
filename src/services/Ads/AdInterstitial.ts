import { AdMob } from "@capacitor-community/admob";
import type { AdOptions } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";
import { config } from "./config";

const showAdInterstitial = async () => {
  try {
    let adId: string;
      if (Capacitor.getPlatform() === "android") {
        adId = config.interstitial.android;
      } else if (Capacitor.getPlatform() === "ios") {
        adId = config.interstitial.ios;
      } else {
        adId = config.interstitial.android;
      }

    const options: AdOptions = {
      adId: adId
    };

    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  } catch (error) {
    console.warn('AdInterstitial failed:', error);
  }
};

export default showAdInterstitial;