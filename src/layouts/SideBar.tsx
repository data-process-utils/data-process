'use client'
import {routes} from "@/lib/routes";
import Link from "next/link";
import {useTranslator} from "@/hooks/use-translator";
import {BuildNumber} from "@/components/build/build-number";


export function SideBar() {


    if (typeof window !== "undefined") {
        console.log();
    }

    const {translate} = useTranslator()


    const makeLinks = () => {
        // {}

        const keys: string[] = Object.keys(routes)
        return keys.map((route) => (
            <li key={route}
                className={`${typeof window !== "undefined" && window.location.pathname === route ? 'bg-purple-600' : 'bg-purple-500'} } 
                     transition-colors ease-in-out cursor-pointer
                     py-3 px-3 mt-3 my-1 rounded-lg hover:bg-purple-700 w-full
                     text-white
                     active:bg-purple-500`}>
                <Link href={route} className="flex w-full justify-between">
                    {translate(routes[route].title)} {routes[route].icon}
                </Link>
            </li>
        ))
    }

    return <aside className="w-full mx-1">
        <nav className="flex flex-col w-full ">
            <ul className="flex flex-col w-full items-center h-[89vh] max-h-[89vh] overflow-y-auto">
                {

                    makeLinks()
                }
            </ul>
            <BuildNumber/>
        </nav>
    </aside>
}

