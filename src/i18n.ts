import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// Determine if the application is running in production mode
const isProduction = process.env.APP_MODE === 'prod';

// Initialize i18n configuration
i18n
  .use(HttpApi)  // Use HttpApi to load translation files
  .use(LanguageDetector)  // Use LanguageDetector to detect user language
  .use(initReactI18next)  // Integrate with React
  .init({
    supportedLngs: ['en', 'fr'],  // List of supported languages
    fallbackLng: 'en',  // Default language if the detected language is not supported
    debug: !isProduction,  // Enable debug mode if not in production
    interpolation: {
      escapeValue: false,  // Disable escaping for security reasons
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',  // Path to load translation files
    },
  });

export default i18n;
