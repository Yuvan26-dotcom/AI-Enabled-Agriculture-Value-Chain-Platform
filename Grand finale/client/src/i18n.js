import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from './locales/en.json';
import hi from './locales/hi.json';
import ta from './locales/ta.json';
import mr from './locales/mr.json';
import gu from './locales/gu.json';
import te from './locales/te.json';
import kn from './locales/kn.json';
import bn from './locales/bn.json';
import ml from './locales/ml.json';
import pa from './locales/pa.json';
import or from './locales/or.json';
import ur from './locales/ur.json';
import as from './locales/as.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ta: { translation: ta },
      mr: { translation: mr },
      gu: { translation: gu },
      te: { translation: te },
      kn: { translation: kn },
      bn: { translation: bn },
      ml: { translation: ml },
      pa: { translation: pa },
      or: { translation: or },
      ur: { translation: ur },
      as: { translation: as }
    },
    lng: localStorage.getItem('i18nextLng') || "en", 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;