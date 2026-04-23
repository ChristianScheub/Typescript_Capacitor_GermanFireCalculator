import { useEffect, useCallback } from "react";
import { Capacitor } from "@capacitor/core";
import initializeAds from "./AdConsentForm";
import showBanner from "./AdBanner";
import showAdInterstitial from "./AdInterstitial";

const AD_INTERVAL_MINUTES = 30;

export const AdManager: React.FC = () => {
  const canShowAd = (): boolean => {
    const lastAdTime = localStorage.getItem("lastAdTime");
    if (!lastAdTime) return true;

    const lastAdTimestamp = Number.parseInt(lastAdTime, 10);
    const now = Date.now();
    const elapsedMinutes = (now - lastAdTimestamp) / (1000 * 60);
    return elapsedMinutes >= AD_INTERVAL_MINUTES;
  };

  const showAdWithCheck = useCallback(async () => {
    if (Capacitor.getPlatform() === "ios") {
      return;
    }
    if (canShowAd()) {
      try {
        await showAdInterstitial();
        localStorage.setItem("lastAdTime", Date.now().toString());
      } catch (err) {
        console.warn('Ad interstitial failed:', err);
      }
    }
  }, []);

  const initialize = useCallback(async () => {
    try {
      await initializeAds();
      await showBanner();
    } catch (err) {
      console.warn('Ad initialization failed:', err);
    }

    setTimeout(() => {
      showAdWithCheck();
    }, 6000);
  }, [showAdWithCheck]);

  useEffect(() => {
    const timer = setTimeout(() => {
      initialize();
    }, 1000);

    const interval = setInterval(() => {
      showAdWithCheck();
    }, 60000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [initialize, showAdWithCheck]);

  return null;
};