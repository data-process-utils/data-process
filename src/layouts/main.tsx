'use client'
import {LanguageSelector} from "@/components/i18n/language-selector";
import {SideBar} from "@/layouts/SideBar";
import {ReactNode, useEffect, useState} from "react";
import {Flex} from "@chakra-ui/react";
import {useTitle} from "@/hooks/use-title";
import {useTranslator} from "@/hooks/use-translator";
import {routes} from "@/lib/routes";

export function MainLayout({children}: {children ?: ReactNode} ) {
    const [setTitle] = useTitle()
    const {translate} = useTranslator()

    const [location, setLocation] = useState('')


    useEffect(() => {
        setLocation(typeof window!== "undefined"? window.location.pathname : '')
    }, [])

    useEffect(() => {
        if (location) {
            setTitle(translate(routes[location].title))
        }
    }, [translate, location, setTitle])

    if (!location) return null; // Evita renderização inicial no servidor

    return (
        <Flex h="100vh" w="100vw" className="overflow-x-hidden">
            <Flex className="absolute top-5 right-5">
                <LanguageSelector className="z-10 bg-white rounded shadow shadow-purple-300 drop-shadow-2xl"/>
            </Flex>
            <Flex className="w-[250px] h-full mx-1 bg-zinc-50 border-r border-purple-300">
                <SideBar/>
            </Flex>
            <Flex className="p-5 flex-col w-full">
                <Flex direction="column">
                    <h1 className="font-medium text-2xl">
                        {translate(routes[location].title)}
                    </h1>
                    <h2 className="font-light">
                        {translate(routes[location].description)}
                    </h2>
                </Flex>
                <Flex w="100%" direction="column">
                    {children}
                </Flex>
            </Flex>
        </Flex>
    );
}
