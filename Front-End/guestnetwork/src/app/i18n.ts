import i18next from 'i18next';
import nl from '../../public/locales/nl/common.json';
import en from '../../public/locales/en/common.json';
import { initReactI18next } from 'react-i18next';

i18next
  .use(initReactI18next)
  .init({
    lng: 'en',                   
    fallbackLng: 'en',
    defaultNS: 'common',  
    fallbackNS: 'common',
    resources: {
      en: {
        common: en,
      },
      nl: {
        common: nl,
      },
    },
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18next;
