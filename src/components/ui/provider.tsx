"use client"

import {ChakraProvider, createSystem, defaultConfig, defineConfig,} from "@chakra-ui/react"
import {ColorModeProvider} from "./color-mode"
import {PropsWithChildren} from "react";


const config = defineConfig({

    theme: {

        tokens: {

            colors: {},
        },
    },

},)

const system = createSystem(defaultConfig, config)

export function Provider(props: PropsWithChildren) {
    return (
        <ChakraProvider value={system}>
            <ColorModeProvider forcedTheme="light">{props.children}</ColorModeProvider>
        </ChakraProvider>
    )
}
