import createInstance from "@/axios/instance";
import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar"
import ProductCardSkeleton from "@/components/Skeletons/ProductCardSkeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import WishlistCard, { WishlistItem } from "@/components/WishlistCard"
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Image from "next/image";

export default function WishlistPage() {
    const { data, isSuccess, isLoading, isError } = useQuery({
        queryKey: ["allWishlists"],
        queryFn: async () => {
            const response = await createInstance().get("/wishlist");
            const data = response.data.data.data;
            console.log(data);

            return data;
        },
        refetchOnWindowFocus: false,
    });

    if (isError) {
        return <p>Something went wrong...</p>;

    }

    return (
        <>
            <Head>
                <title>Wishlist</title>
            </Head >
            <main>
                <Navbar />
                <div className="container max-w-6xl min-h-screen mx-auto py-10">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold ">Wishlist</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {
                                    isLoading ? (
                                        <>
                                            <ProductCardSkeleton />
                                            <ProductCardSkeleton />
                                            <ProductCardSkeleton />
                                            <ProductCardSkeleton />
                                        </>
                                    ) : data?.length > 0 ? data?.map((item: WishlistItem) => (
                                        <WishlistCard key={item.id} item={item} />
                                    )) : (
                                        <div className="flex col-span-4 justify-center items-center w-full">
                                            <div className="flex flex-col justify-center items-center">
                                                <div className=" flex items-center justify-center">
                                                    <Image src="/image/no-wishlist.webp" alt="Empty Wishlist" width={300} height={300} />
                                                </div>
                                                <p className="text-center mt-4">Your wishlist is empty</p>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </>
    )
}