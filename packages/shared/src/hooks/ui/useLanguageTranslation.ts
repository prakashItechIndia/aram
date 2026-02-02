import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../providers/LanguageProvider';

/**
 * Provides the active language plus i18next translation helpers.
 * Consumers must wrap their tree with `LanguageProvider`.
 */
export const useLanguageTranslation = () => {
  const { t, i18n } = useTranslation();
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguageTranslation must be used within a LanguageProvider',
    );
  }

  return {
    t,
    i18n,
    language: context.language,
    changeLanguage: context.changeLanguage,
  };
};
