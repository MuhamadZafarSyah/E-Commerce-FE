/* eslint-disable @typescript-eslint/no-unused-vars */
import createInstance from "@/axios/instance"
import Footer from "@/components/Footer"
import { Navbar } from "@/components/Navbar"
import { Pagination } from "@/components/Pagination"
import { ProductCard } from "@/components/ProductCard"
import { SearchFilters } from "@/components/SeachFilters"
import ProductCardSkeleton from "@/components/Skeletons/ProductCardSkeletons"
import { ProductType } from "@/types/product.type"
import { useQuery } from "@tanstack/react-query"
import Head from "next/head"
import { useRouter } from "next/router"

export default function ProductListPage() {
    const router = useRouter()

    const { data, isSuccess, isLoading } = useQuery({
        queryKey: ["allProducts", router.query],
        queryFn: async () => {
            const response = await createInstance().get("/all-products", {
                params: {
                    ...router.query,
                    page: router.query.page || 1,
                    per_page: 9
                }
            })

            return response.data
        },
        refetchOnWindowFocus: false,

    })


    const { isLoading: LoadingCategory, data: DataCategories, isSuccess: categoriesSuccess } = useQuery({
        queryKey: ["allCategories"],
        queryFn: async () => {
            const response = await createInstance().get("/category");
            const data = response.data.data;

            return data.data;

        },
        refetchOnWindowFocus: false,

    });


    return (
        <>
            <Head>
                <title>All Products</title>
            </Head>
            <main >
                <Navbar />
                <div className="container min-h-screen max-w-6xl !md:px-4  mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h1 className="text-3xl font-bold">Products</h1>

                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-3">
                            {categoriesSuccess && (
                                <SearchFilters
                                    categories={DataCategories || []}
                                />

                            )}
                        </div>

                        <div className="lg:col-span-9">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {isLoading ? (
                                    Array.from({ length: 8 }).map((_, index) => (
                                        <ProductCardSkeleton key={index} />
                                    ))
                                ) : (
                                    data?.data.map((product: any) => (
                                        <ProductCard
                                            key={product.id}
                                            id={product.id}
                                            slug={product.slug}
                                            name={product.name}
                                            price={product.price}
                                            image={product.image}
                                            category={product.category.name} // Pastikan ini string
                                            stock={product.stock}
                                        />
                                    ))
                                )}
                            </div>

                            {isSuccess && data.data.length === 0 && (
                                <div className="text-center text-gray-500 mt-8">
                                    No products found matching your search
                                </div>
                            )}


                            {data?.meta && <Pagination meta={data.meta} />}
                        </div>



                    </div>
                </div>
                <Footer />
            </main >
        </>
    )
}