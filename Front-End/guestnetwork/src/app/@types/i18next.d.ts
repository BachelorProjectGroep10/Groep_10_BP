import en from '../../../public/locales/en/common.json';
import nl from '../../../public/locales/nl/common.json';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'en';
        resources: {
            en: typeof en;
            nl: typeof nl;
        };
    }
}