import { SVGProps, JSX, useState } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { useQuery } from "@tanstack/react-query";
import createInstance from "@/axios/instance";
import { toRupiah } from "@/utils/toRupiah";
import { ProductType } from "@/types/product.type";
import CheckoutForm from "@/components/CheckoutForm";
import { useCartQuantityUpdate } from "@/hooks/useCartQuantityUpdate";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import Footer from "@/components/Footer";

export default function Component() {
    const [totalWeight, setTotalWeight] = useState(0);

    const { isLoading, data, isSuccess } = useQuery({
        queryKey: ["allCarts"],
        queryFn: async () => {
            const response = await createInstance().get("/carts");
            const data = response.data;

            if (data.data.products) {
                const calculatedWeight = data.data.products.reduce((total: number, item: ProductType) => {
                    return total + (item.weight * item.quantity);
                }, 0);
                setTotalWeight(calculatedWeight);
            }

            return data.data;
        },
    });

    const { updateQuantity } = useCartQuantityUpdate();

    const handleQuantityChange = (productId: number, change: number) => {
        updateQuantity(productId, change);
    };

    const hasProducts = isSuccess && data && 'products' in data;
    const showEmptyState = isSuccess && (!data || !('products' in data) || data.products.length === 0);

    return (
        <>
            <Head>
                <title>My Cart</title>
            </Head>
            <main>
                <Navbar />
                <div className="mx-auto min-h-screen max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-[1fr_400px] gap-8 px-4 md:px-6 py-12">
                        <div>
                            <h1 className="text-2xl font-bold mb-6">My Cart</h1>
                            <div className="space-y-6">
                                {hasProducts && (
                                    data.products.map((item: ProductType) => (
                                        <div
                                            key={`${item.product_id}`}
                                            className="flex items-center justify-between relative border-b pb-6 transition-colors hover:bg-muted/20 rounded-lg p-4"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center items-start gap-4">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={80}
                                                    height={80}
                                                    className="rounded-lg object-cover"
                                                    style={{ aspectRatio: "80/80", objectFit: "cover" }}
                                                />
                                                <div>
                                                    <span className="absolute right-2 top-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">Stock: {item.stock}</span>
                                                    <h3 className="font-semibold text-lg hidden md:block">{item.name}</h3>
                                                    <h3 className="font-semibold text-lg block md:hidden">{item.name.length > 35 ? `${item.name.slice(0, 35)}..` : item.name}</h3>
                                                    <div className="-space-y-px mt-2 md:mt-0 md:-space-y-0">
                                                        <h4 className="text-muted-foreground text-sm">Unit : {toRupiah(item.price)}</h4>
                                                        <h4 className="font-medium text-sm mt-2">Total : {toRupiah(item.total)}</h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => handleQuantityChange(item.product_id, -1)}
                                                    className="hover:bg-muted/20 rounded-full"
                                                >
                                                    <MinusIcon className="h-4 w-4" />
                                                </Button>
                                                <span className="text-lg font-medium">{item.quantity}</span>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => handleQuantityChange(item.product_id, 1)}
                                                    className="hover:bg-muted/20 rounded-full"
                                                >
                                                    <PlusIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}

                                {showEmptyState && (
                                    <div className="bg-muted text-foreground p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-fade-in-up">
                                        <div className="animate-scale-in">
                                            <ShoppingCart className="w-20 h-20 text-orange-500 mx-auto mb-6" />
                                        </div>
                                        <h1 className="text-3xl font-bold mb-4 animate-fade-in-up delay-200">Your Cart is Empty!</h1>
                                        <p className="mb-8 animate-fade-in-up delay-300">
                                            Your cart is currently empty. Please shop for products first.
                                        </p>
                                        <div className="animate-fade-in-up delay-400">
                                            <Link
                                                href="/all-products"
                                                className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105"
                                            >
                                                <ShoppingBag className="mr-2" />
                                                Continue Shopping
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {hasProducts && (
                            <div className="bg-muted/40 rounded-lg p-6 space-y-4 shadow-lg h-fit">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Shipping address</h2>
                                    <Button size="icon" variant="outline" className="hover:bg-muted/20 rounded-full">
                                        <CodeIcon className="h-5 w-5" />
                                    </Button>
                                </div>
                                <div>
                                    <CheckoutForm
                                        total_amount={data.total_amount}
                                        total_weight={totalWeight}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </main>
        </>
    )
}

function CodeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    )
}

function MinusIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
        </svg>
    )
}

function PlusIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}