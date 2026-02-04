import en from '../common/locales/en';
import { LanguageProviderCreator } from './LanguageProviderCreator';
import de from '../common/locales/de';
const resources = {
    en: {
        translation: en,
    },
    de: {
        translation: de,
    },
};
const defaultLang = 'en';
const { LanguageContext, LanguageProvider } = LanguageProviderCreator(defaultLang, resources);
export { LanguageContext, LanguageProvider };
