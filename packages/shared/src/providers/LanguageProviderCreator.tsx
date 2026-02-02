import React, { useState, createContext, useEffect } from 'react';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const createLanguageProvider = <LType extends string>(
  defaultLang: LType,
  LContext: ReturnType<typeof createLanguageContext<LType>>,
) => {
  const LanguageProvider = ({
    children,
    defaultLanguage = defaultLang,
    storageKey = 'language-preference',
  }: {
    children: React.ReactNode;
    defaultLanguage?: LType;
    storageKey?: string;
  }) => {
    const setI18nLanguage = (lng: LType) => {
      i18n.changeLanguage(lng);
    };

    const [language, setLanguage] = useState<LType>(() => {
      const st = localStorage.getItem(storageKey) as LType;
      const lng = st || defaultLanguage;
      setI18nLanguage(lng); // Avoids flicker in the beginning if not default stored in local storage
      return lng;
    });

    useEffect(() => {
      setI18nLanguage(language);
    }, [language]);

    const changeLanguage = (lng: LType) => {
      localStorage.setItem(storageKey, lng);
      setLanguage(lng);
    };

    return (
      <LContext.Provider value={{ language, changeLanguage }}>
        {children}
      </LContext.Provider>
    );
  };

  return LanguageProvider;
};

function createLanguageContext<LType extends string>(defaultLanguage: LType) {
  const LanguageContext = createContext<{
    language: LType;
    changeLanguage: (lng: LType) => void;
  }>({
    language: defaultLanguage,
    changeLanguage: () => {},
  });
  return LanguageContext;
}

export function LanguageProviderCreator<
  LType extends string,
  TType extends object,
>(
  defaultLanguage: LType,
  resources: { [key in LType]: { translation: TType } },
) {
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

  const LanguageContext = createLanguageContext<LType>(defaultLanguage);
  const LanguageProvider = createLanguageProvider<LType>(
    defaultLanguage,
    LanguageContext,
  );

  return {
    LanguageContext,
    LanguageProvider,
  };
}
