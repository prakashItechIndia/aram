import React from 'react';
export declare function LanguageProviderCreator<LType extends string, TType extends object>(defaultLanguage: LType, resources: {
    [key in LType]: {
        translation: TType;
    };
}): {
    LanguageContext: React.Context<{
        language: LType;
        changeLanguage: (lng: LType) => void;
    }>;
    LanguageProvider: ({ children, defaultLanguage, storageKey, }: {
        children: React.ReactNode;
        defaultLanguage?: LType | undefined;
        storageKey?: string;
    }) => import("react/jsx-runtime").JSX.Element;
};
//# sourceMappingURL=LanguageProviderCreator.d.ts.map