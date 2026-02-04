/**
 * Provides the active language plus i18next translation helpers.
 * Consumers must wrap their tree with `LanguageProvider`.
 */
export declare const useLanguageTranslation: () => {
    t: import("i18next").TFunction<"translation", undefined>;
    i18n: import("i18next").i18n;
    language: import("../..").LanguageType;
    changeLanguage: (lng: import("../..").LanguageType) => void;
};
//# sourceMappingURL=useLanguageTranslation.d.ts.map