import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './i18n/locales/de.json';

const resources = {
  de: {
    translation: de
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'de', // Standardsprache auf Deutsch
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false // React macht das bereits
    }
  });

export default i18n;