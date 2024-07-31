// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

const initI18n = async () => {
  await i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      supportedLngs: ['en', 'fr'],
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
    });
};

export default initI18n;
