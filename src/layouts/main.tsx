import {Outlet, useLocation} from "react-router-dom";
import {SideBar} from "@/layouts/SideBar.tsx";
import {useTitle} from "@/hooks/useTitle.ts";
import {rotes} from "@/lib/utils.tsx";

export function RootLayout() {

    const location = useLocation()

    console.log(location.pathname) // prints current route path

    useTitle(rotes[location.pathname].title)

    return <div className="flex h-screen ">
        <div className="w-1/6 h-full  bg-zinc-50 border-r">
            <SideBar/>
        </div>
        <main className="p-5 flex-1 flex-col">
            <div>
                <h1 className="font-medium text-2xl" >{rotes[location.pathname].title}</h1>
                <h2 className="font-light">{rotes[location.pathname].description}</h2>
            </div>
            <div className="flex-1">
                <Outlet/>
            </div>
        </main>
    </div>
}