'use client'
import {createContext, useState, useEffect, ReactNode, useContext} from 'react';

export type TranslateParams = {
    [key: string]: string | number | undefined; // pode incluir strings, números ou undefined
};


type LanguageContext = {
    setLocale: (language: string) => void;
    t: (key: string, params?: TranslateParams) => string;
}


export const TranslationContext = createContext<LanguageContext>({} as LanguageContext);

export const TranslationProvider = ({children}: { children: ReactNode }) => {
    const [locale, setLocale] = useState('pt-BR'); // idioma padrão
    const [translations, setTranslations] = useState({} as never);

    useEffect(() => {
        const loadTranslations = async () => {
            const response = await fetch(`/locales/${locale.toLowerCase()}.json`);
            const data = await response.json();
            // console.log(data)
            setTranslations(data);
        };

        loadTranslations().catch((error) => {
            console.error("Error loading translations:", error);
        });
    }, [locale]);


    const t = (key: string, params?: TranslateParams) => {
        let translation = (translations[key] || key) as string;

        if (params) {
            // Substitui os parâmetros na string de tradução
            Object.entries(params).forEach(([paramKey, paramValue]) => {
                if (paramValue !== undefined) { // Verifica se o valor não é undefined
                    translation = translation.replace(`{{${paramKey}}}`, String(paramValue));
                }
            });
        }

        return translation;
    };


    return <TranslationContext.Provider value={{setLocale, t}}>
        {children}
    </TranslationContext.Provider>

}

export const useTranslation = () => {
    return useContext(TranslationContext);
};
