import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import Image from "next/image"
import Link from "next/link"
import ModeToggle from "@/components/ModeToggle"
import Head from "next/head"

export default function index() {
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <div className="grid min-h-svh lg:grid-cols-2">
                <div className="relative hidden bg-muted lg:block">
                    <Image
                        fill
                        src="/image/login-page.jpg"
                        alt="Image"
                        sizes="(100vw, 100vh)"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.7]  "
                    />
                </div>
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <div className="flex w-full justify-between gap-2 ">
                        <Link href="/" className="flex items-center gap-2 font-medium">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <GalleryVerticalEnd className="size-4" />
                            </div>
                            Toko Online.
                        </Link>
                        <ModeToggle />
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-xs">
                            <LoginForm />
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
