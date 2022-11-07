import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { ru, en, ge } from "./locales";

i18n.use(initReactI18next).init({
  resources: { en, ru, ge },
  fallbackLng: "en",
  detection: {
    order: ["queryString", "cookie"],
  },
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: true,
  },
});

export default i18n;
