import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import createInstance from "@/axios/instance";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { CircleUser, Menu, Package2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ModeToggle from "./ModeToggle";
import SearchButton from "./SearchButton";
import Cookies from "js-cookie"


export function Navbar() {

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();

    const getUserRole = useAuthStore((state) => state.user) as { role: string };



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
    function isActive(path: string) {
        return router.pathname === path;
    }

    return (
        <header className="sticky z-50 top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">

                <Link
                    href="/"
                    className={` transition-colors hover:text-foreground ${isActive('/') ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                    Home
                </Link>
                <Link
                    href="/user/transaction"
                    className={` transition-colors hover:text-foreground ${isActive('/user/transaction') ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                    Orders
                </Link>
                <Link
                    href="/all-products"
                    className={` transition-colors hover:text-foreground ${isActive('/all-products') ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                    Products
                </Link>
                <Link
                    href="/user/wishlist"
                    className={` transition-colors hover:text-foreground ${isActive('/user/wishlist') ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                    Wishlist
                </Link>
                <Link
                    href="/user/cart"
                    className={` transition-colors hover:text-foreground ${isActive('/user/cart') ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                    Cart
                </Link>
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            href="#"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <Package2 className="h-6 w-6" />
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        <Link
                            href="/"
                            className={` transition-colors hover:text-foreground ${isActive('/') ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/user/transaction"
                            className={` transition-colors hover:text-foreground ${isActive('/user/transaction') ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                            Orders
                        </Link>
                        <Link
                            href="/all-products"
                            className={` transition-colors hover:text-foreground ${isActive('/all-products') ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                            Products
                        </Link>
                        <Link
                            href="/user/wishlist"
                            className={` transition-colors hover:text-foreground ${isActive('/user/wishlist') ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                            Wishlist
                        </Link>
                        <Link
                            href="/user/cart"
                            className={` transition-colors hover:text-foreground ${isActive('/user/cart') ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                            Cart
                        </Link>

                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <form className="ml-auto flex-1 sm:flex-initial">
                    <div className="relative">
                        {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                        /> */}
                        <SearchButton />
                    </div>
                </form>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" >
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        {getUserRole ? getUserRole.role === "admin" && (
                            <Link className="hover:text-foreground" href="/dashboard">
                                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                            </Link>
                        ) : null}
                        {isAuthenticated ? (
                            <>
                                <Link className="hover:text-foreground" href="/user/my-profile">
                                    <DropdownMenuItem>Settings</DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="bg-destructive text-background dark:text-foreground" onClick={handleLogout}>Logout</DropdownMenuItem>
                            </>
                        ) : (
                            <Link href="/auth/login">
                                <DropdownMenuItem className="bg-background text-foreground">Login</DropdownMenuItem>
                            </Link>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <ModeToggle />
            </div>
        </header>
    )
}

