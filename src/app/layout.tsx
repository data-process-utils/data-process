import type {Metadata} from "next";
import "./globals.css";

import {ReactNode} from "react";
import {MainLayout} from "@/layouts/main";
import {Provider} from "@/components/ui/provider";
import {TranslationProvider} from "@/contexts/language-context-provider";
import {Theme} from "@chakra-ui/react";
// import {TranslationProvider} from "@/contexts/language-context-provider";

export const metadata: Metadata = {
    title: "Json Finder",
    description: "Aplicação voltada para processamento de dados em JSON posteriomente sera implementado processamentos nos formatos XLSX/XLS/XML,CSV",
};


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (

        <html lang="pt-BR" suppressHydrationWarning>
        <body>
        <Provider>
            <Theme appearance="light">
                <TranslationProvider>


                    <MainLayout> {children}</MainLayout>

                </TranslationProvider>
            </Theme>

        </Provider>
        </body>
        </html>

    );
}
