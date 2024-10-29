'use client';

import {TranslateParams, useTranslation} from "@/contexts/language-context-provider";
import {TranslationKeys} from "@/i18n/tranlation";


export function useTranslator() {
    const {t} = useTranslation()

    function translate(key: TranslationKeys | string, params?: TranslateParams) {
        return t(key, params)
    }

    return {translate}
}