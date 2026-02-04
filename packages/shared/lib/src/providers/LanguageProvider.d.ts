import { LanguageType } from '../type';
declare const LanguageContext: import("react").Context<{
    language: LanguageType;
    changeLanguage: (lng: LanguageType) => void;
}>, LanguageProvider: ({ children, defaultLanguage, storageKey, }: {
    children: React.ReactNode;
    defaultLanguage?: LanguageType | undefined;
    storageKey?: string;
}) => import("react/jsx-runtime").JSX.Element;
export { LanguageContext, LanguageProvider };
//# sourceMappingURL=LanguageProvider.d.ts.map