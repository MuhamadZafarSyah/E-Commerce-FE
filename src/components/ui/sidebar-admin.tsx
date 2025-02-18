import createInstance from '@/axios/instance';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react'
import { toast } from 'sonner';
import ModeToggle from '../ModeToggle';
import Cookies from 'js-cookie'

const navItems = [
    {
        id: 1,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
        ),
        link: "/dashboard",
        text: "Dashboard",
    },
    {
        id: 2,
        icon: (
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="26" width="26" xmlns="http://www.w3.org/2000/svg">
                <path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z"></path>
            </svg>
        ),
        link: "/dashboard/product",
        text: "Product",
    },
    {
        id: 3,
        icon: (
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="26" width="26" xmlns="http://www.w3.org/2000/svg" >
                <path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-8-4h2v2h2v-2h2v-2h-2v-2h-2v2h-2z"></path>
            </svg>
        ), link: "/dashboard/category",
        text: "Category",
    },
    {
        id: 4,
        icon: (
            <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 512 512" height="26" width="26" xmlns="http://www.w3.org/2000/svg">
                <path d="M344 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96z" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"></path>
                <path d="M256 304c-87 0-175.3 48-191.64 138.6C62.39 453.52 68.57 464 80 464h352c11.44 0 17.62-10.48 15.65-21.4C431.3 352 343 304 256 304z" fill="none" strokeMiterlimit="10" strokeWidth="32"></path>
            </svg>
        ),
        link: "/dashboard/users",
        text: "Users",
    },
    {
        id: 5,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
            </svg>
        ),
        link: "/dashboard/transaction",
        text: "Transaction",
    },
];
const Sidebar = ({ className }: { className?: string }) => {
    const [sidebarToggled, setSidebarToggled] = useState(false)
    const toggleSidebar = () => {
        setSidebarToggled(sidebarToggled => !sidebarToggled)
    }
    const router = useRouter();



    const deleteAllCookies = () => {
        // Get all cookies
        const cookies = document.cookie.split(';');
        const domains = [
            '',
            '.muhamadzafarsyah.com',
            'muhamadzafarsyah.com',
            'www.muhamadzafarsyah.com',
            'api-ecommerce.muhamadzafarsyah.com'
        ];
        const paths = ['/', ''];

        // Iterate through all cookies
        for (const cookie of cookies) {
            const cookieName = cookie.split('=')[0].trim();

            domains.forEach(domain => {
                paths.forEach(path => {
                    // Using js-cookie
                    Cookies.remove(cookieName, {
                        domain: domain,
                        path: path
                    });

                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=${path}${domain ? `; domain=${domain}` : ''}`;
                });
            });
        }
    };

    const mutation = useMutation({
        mutationKey: ["logout"],
        mutationFn: () => {
            return createInstance().post("/logout");
        },
        onSuccess: () => {
            // Hapus semua cookies
            deleteAllCookies();

            // Clear local storage juga (opsional)
            localStorage.clear();
            sessionStorage.clear();

            toast.success("Logout Success");
            useAuthStore.getState().logout();
            router.push("/auth/login");
        },
    });

    const handleLogout = async () => {
        await mutation.mutate();
    };


    return (
        <div className={`${className} lg:w-64 lg:flex lg:flex-col lg:justify-between lg:overflow-hidden`}>
            <aside className={`
    fixed top-0 left-0 h-[100dvh] bg-background py-3 overflow-hidden w-11/12 max-w-[15rem] md:max-w-[1rem] lg:max-w-[15rem] z-50 transition-all   shadow-lg shadow-gray-200 dark:shadow-gray-800/60 flex flex-col justify-between px-4
    ${sidebarToggled ? "" : "-translate-x-full lg:-translate-x-0"}
`}>
                <div className="min-h-max py-4">
                    <Link href="/" className="flex items-center gap-x-3 font-semibold text-gray-800 dark:text-gray-200">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                            </svg>
                        </span>
                        E-Commerce
                    </Link>
                </div>
                <nav className="h-full pt-10">
                    <ul className="text-gray-700 dark:text-gray-300 space-y-3">
                        {navItems.map((navItem) => (
                            <div key={navItem.id}>
                                <Link
                                    href={navItem.link}
                                    className={`flex items-center gap-x-4 px-5 py-3 rounded-2xl border-2 ${router.pathname === navItem.link
                                        ? "bg-neutral-900 text-white"
                                        : "hover:bg-neutral-900 hover:text-white"
                                        }`}
                                >
                                    <h2 className="min-w-max inline-flex">{navItem.icon}</h2>
                                    <h1 className="inline-flex">{navItem.text}</h1>
                                </Link>
                            </div>
                        ))}
                    </ul>
                    <div className='w-full flex justify-center mt-5'>
                        <ModeToggle />
                    </div>
                </nav>
                <button onClick={handleLogout} className="w-full py-2.5 rounded-2xl bg-red-600 text-white font-semibold">
                    Logout
                </button>
            </aside>

            <main>
                <div className="flex lg:hidden justify-end right-2 top-2 p-4">
                    <button onClick={() => { toggleSidebar() }} className="p-3 rounded-full bg-gray-600 dark:bg-gray-500 outline-none w-12 aspect-square flex flex-col relative justify-center items-center">
                        <span className="sr-only">
                            toggle sidebar
                        </span>
                        <span className={`
                        w-6 h-0.5 rounded-full bg-gray-300 transition-transform duration-300 ease-linear
                        ${sidebarToggled ? "rotate-[40deg] translate-y-1.5" : ""}
                    `} />
                        <span className={`
                        w-6 origin-center  mt-1 h-0.5 rounded-full bg-gray-300 transition-all duration-300 ease-linear
                        ${sidebarToggled ? "opacity-0 scale-x-0" : ""}
                    `} />
                        <span className={`
                        w-6 mt-1 h-0.5 rounded-full bg-gray-300 transition-all duration-300 ease-linear
                        ${sidebarToggled ? "-rotate-[40deg] -translate-y-1.5" : ""}
                    `} />
                    </button>
                </div>
            </main>
        </div >
    )
}
export default Sidebar