import { jsx as _jsx } from "react/jsx-runtime";
import { useState, createContext, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const createLanguageProvider = (defaultLang, LContext) => {
    const LanguageProvider = ({ children, defaultLanguage = defaultLang, storageKey = 'language-preference', }) => {
        const setI18nLanguage = (lng) => {
            i18n.changeLanguage(lng);
        };
        const [language, setLanguage] = useState(() => {
            const st = localStorage.getItem(storageKey);
            const lng = st || defaultLanguage;
            setI18nLanguage(lng); // Avoids flicker in the beginning if not default stored in local storage
            return lng;
        });
        useEffect(() => {
            setI18nLanguage(language);
        }, [language]);
        const changeLanguage = (lng) => {
            localStorage.setItem(storageKey, lng);
            setLanguage(lng);
        };
        return (_jsx(LContext.Provider, { value: { language, changeLanguage }, children: children }));
    };
    return LanguageProvider;
};
function createLanguageContext(defaultLanguage) {
    const LanguageContext = createContext({
        language: defaultLanguage,
        changeLanguage: () => { },
    });
    return LanguageContext;
}
export function LanguageProviderCreator(defaultLanguage, resources) {
    i18n
        .use(initReactI18next) // Integrates with React
        .init({
        resources,
        lng: defaultLanguage, // Default language
        fallbackLng: defaultLanguage, // Fallback language if the current language doesn't have a translation
        interpolation: {
            escapeValue: false,
        },
    });
    const LanguageContext = createLanguageContext(defaultLanguage);
    const LanguageProvider = createLanguageProvider(defaultLanguage, LanguageContext);
    return {
        LanguageContext,
        LanguageProvider,
    };
}
