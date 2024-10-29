'use client';

import {Flag} from "@/components/i18n/flag";
import {useEffect, useRef, useState} from "react";
import {Globe} from "react-feather";
import {useTranslation} from "@/contexts/language-context-provider";
import {useTranslator} from "@/hooks/use-translator";
import {Tooltip} from "@/components/ui/tooltip";
import {Flex} from "@chakra-ui/react";
import {Button} from "@/components/ui/button";


type LanguageSelectorProps = {
    className?: string
}

const locales = [
    "pt-BR", "en-US"
]


const languageColor = {
    "en-US": "blue.500",
    "pt-BR": "green.500"
}


export function LanguageSelector(props: LanguageSelectorProps) {
    const {setLocale} = useTranslation()
    const {translate} = useTranslator()
    const [selectedLanguage, setSelectedLanguage] = useState('pt-BR')

    const ref = useRef<HTMLDivElement>(null);

    const [hiddenLanguage, setHidden] = useState(true)

    async function handleChangeLanguage(language: string) {
        setLocale(language)
        setSelectedLanguage(language)
        setHidden(true)
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setHidden(true);
        }
    };


    useEffect(() => {
        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return <Flex ref={ref} {...props}>
        {hiddenLanguage ? <Tooltip content={translate('select_lang')}>
                <Button onClick={() => setHidden(prev => !prev)} size="sm" color="white"
                        bg={languageColor[selectedLanguage as 'pt-BR' | 'en-US']}>
                    <Globe/>
                </Button>
            </Tooltip>
            : locales.map((v, i) => {
                return <Flag image={`/${String(v).toLowerCase()}.png`} isSelected={selectedLanguage == v}
                             onClick={() => handleChangeLanguage(v)} key={i}/>
            })
        }
    </Flex>
}