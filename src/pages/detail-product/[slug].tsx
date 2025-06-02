/* eslint-disable react-hooks/rules-of-hooks */
import createInstance from "@/axios/instance";
import AddToWishlistButton from "@/components/AddToWishlist";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import RatingOverview from "@/components/Reviews/RatingOverview";
import ReviewComponent from "@/components/Reviews/ReviewCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import { toRupiah } from "@/utils/toRupiah";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, ShoppingCart } from "lucide-react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params || {};
    const instance = createInstance(context);

    try {
        if (!slug || typeof slug !== "string") {
            return { notFound: true };
        }

        const productResponse = await instance.get(`/products/detail-product/${slug}`);
        const productData = productResponse.data.data;

        if (!productData) {
            return { notFound: true };
        }

        const relatedResponse = await instance.get(`/all-products?category=${productData.category_slug}`);


        const relatedProducts = relatedResponse.data.data
            .filter((p: any) => p.id !== productData.id)
            .map((p: any) => ({
                id: p.id,
                name: p.name,
                description: p.description || '',
                price: p.price,
                category_id: p.category_id,
                is_in_wishlist: p.is_in_wishlist,
                category_name: p.category_name || p.category?.name || '',
                category_slug: p.category_slug || p.category?.slug || '',
                image: p.image,
                stock: p.stock,
                slug: p.slug,
                reviews: p.reviews || [],
                overview: p.overview || {
                    avg_rating: 0,
                    total_reviews: 0,
                    total_rating: 0
                },
            }));

        return {
            props: {
                product: {
                    id: productData.id,
                    name: productData.name,
                    description: productData.description || '',
                    price: productData.price,
                    is_in_wishlist: productData.is_in_wishlist,
                    category: productData.category || '',
                    category_id: productData.category_id,
                    category_name: productData.category || '',
                    category_slug: productData.category_slug || '',
                    image: productData.image,
                    stock: productData.stock,
                    slug: productData.slug,
                    reviews: productData.reviews || [],
                    overview: productData.overview || {
                        avg_rating: 0,
                        total_reviews: 0,
                        total_rating: 0
                    },
                },
                relatedProducts: relatedProducts.slice(0, 3)
            },
        };
    } catch (error: any) {
        console.error("Fetch error:", error?.response?.data || error.message);

        if (error?.response?.status === 404) {
            return { notFound: true };
        }

        return {
            props: {
                product: null,
                relatedProducts: [],
            },
        };
    }
};

// Product skeleton loading component
const ProductSkeleton = () => {
    return (
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-2 mx-auto py-6 md:pt-14 pt-4">
            <div className="grid gap-3 items-start order-1">
                <Card className="grid p-4 gap-4">
                    <Skeleton className="aspect-square w-full h-[500px] rounded-lg" />
                    <div className="grid md:hidden">
                        <Skeleton className="h-10 w-3/4 mb-2" />
                        <Skeleton className="h-6 w-1/2 mb-2" />
                        <Skeleton className="h-8 w-1/3 ml-auto" />
                    </div>
                </Card>
            </div>
            <div className="grid p-4 gap-4 md:gap-10 items-start order-2 md:order-1">
                <div className="hidden p-4 md:flex flex-col items-start w-full">
                    <div className="grid gap-4 w-full">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-6 w-1/3" />
                    </div>
                    <Skeleton className="h-10 w-1/3 ml-auto" />
                </div>

                <div className="grid gap-4 md:gap-10">
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-20" />
                    </div>
                </div>

                <Separator />

                <div className="grid gap-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
        </div>
    );
};

const RelatedProductsSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto px-2 py-8">
            <Skeleton className="h-10 w-48 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-48 w-full rounded-lg" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-8 w-1/3" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const ReviewsSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto px-2 py-8">
            <Skeleton className="h-48 w-full mb-8 rounded-lg" />
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                        <Skeleton className="h-20 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
};

function DetailProductPage({ product, relatedProducts }: any) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Simulate loading delay
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); // Optional: simulate network delay

        return () => clearTimeout(timer);
    }, []);

    const queryClient = useQueryClient();

    const { mutate, isLoading: isAddingToCart } = useMutation({
        mutationFn: async () => {
            const instance = createInstance();
            const response = await instance.post("/carts", {
                product_id: product?.id,
                quantity: 1,
            });

            return response.data;
        },
        onSuccess: () => {
            toast.success("Product added to cart");
            queryClient.invalidateQueries({ queryKey: ['cart'] });

            router.push('/user/cart');

        },
        onError: (error: {
            response: { data: { error: string } }; message: string
        }) => {

            if (error.response?.data.error === "Stok produk tidak mencukupi") {
                toast.error("Product stock is not enough or check your cart");
            }
        }
    });

    const handleReadMore = () => {
        setIsExpanded(!isExpanded);
    };

    if (!isMounted) return null;

    if (!product && !isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Product not found or error occurred</h1>
                    <Button onClick={() => router.push('/')}>Back to Home</Button>
                </div>
            </div>
        );
    }

    // Skeleton loading state
    if (isLoading) {
        return (
            <div>
                <Head>
                    <title>Loading... - Detail Product</title>
                </Head>
                <main>
                    <Navbar />
                    <ProductSkeleton />
                    <ReviewsSkeleton />
                    <RelatedProductsSkeleton />
                </main>
                <footer className="bg-background text-foreground border-t">
                    <div className="mx-auto py-10">
                        <p className="text-center text-xs text-foreground">© 2025 Muhamad Zafar Syah, Inc. All rights reserved</p>
                    </div>
                </footer>
            </div>
        );
    }

    const fullDescription = product.description;
    const shortDescription = fullDescription.slice(0, 500);

    return (
        <div>
            <Head>
                <title>{product.name} - Detail Product</title>
            </Head>
            <main>
                <Navbar />
                <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-2 mx-auto py-6 md:pt-14 pt-4">
                    <div className="grid gap-3 items-start order-1">

                        <Card className="grid p-4 gap-4">
                            <Image
                                width={500}
                                height={500}
                                src={product.image}
                                alt="Product Image"
                                className="aspect-square object-cover border border-gray-500 w-fullz rounded-lg overflow-hidden dark:border-gray-800"
                            />
                            <div className="grid md:hidden">
                                <h1 className="font-bold text-xl sm:text-3xl">{product.name}</h1>
                                <p className="mt-2">Category: {product.category}</p>
                                <div className="md:text-4xl text-2xl font-bold ml-auto">{toRupiah(product.price)}</div>
                            </div>
                        </Card>
                    </div>
                    <div className="grid p-4 gap-4 md:gap-10 items-start order-2 md:order-1">
                        <div className="hidden p-4 md:flex flex-col items-start">
                            <div className="grid gap-4">
                                <h1 className="font-bold text-3xl lg:text-4xl">{product.name}</h1>

                                <div>
                                    <p>Category: {product.category}</p>
                                </div>
                                <h2 >Total Stock: {product.stock}</h2>
                            </div>
                            <div className="text-4xl font-bold ml-auto col-span-2" >{toRupiah(product.price)}</div>
                        </div>


                        <form onSubmit={(e) => {
                            e.preventDefault();
                        }} className="grid gap-4 md:gap-10">
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Button
                                    onClick={() => mutate()}
                                    size="lg"
                                    className="w-full"
                                    disabled={isAddingToCart}
                                >
                                    {isAddingToCart ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <ShoppingCart className="size-4 me-2" />
                                            Add to cart
                                        </>
                                    )}
                                </Button>
                                <AddToWishlistButton is_in_wishlist={product.is_in_wishlist} id={product.id} />
                            </div>
                        </form>
                        <Separator />


                        <div className={`grid gap-4 text-sm leading-loose description`}>
                            <div
                                className="description"
                                dangerouslySetInnerHTML={{
                                    __html: isExpanded ? fullDescription : shortDescription
                                }}
                            />

                            {fullDescription.length > 500 && (
                                <Button variant="link" onClick={handleReadMore}>
                                    {isExpanded ? "Read Less" : "Read More"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>



                {product.reviews && (
                    <div>
                        <RatingOverview overview={product.overview} />
                        <ReviewComponent reviews={product.reviews} />
                    </div>
                )}
                {/* Related Products Section - Uncomment and fix */}
                {relatedProducts.length > 0 && (
                    <div className="max-w-6xl mx-auto px-2 py-8">
                        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct: any) => (
                                <ProductCard key={relatedProduct.id}
                                    is_in_wishlist={relatedProduct.is_in_wishlist}
                                    id={relatedProduct.id}
                                    slug={relatedProduct.slug}
                                    name={relatedProduct.name}
                                    price={relatedProduct.price}
                                    image={relatedProduct.image}
                                    category={relatedProduct.category_name} // Pastikan ini string
                                    stock={relatedProduct.stock} />
                            ))}
                        </div>
                    </div>
                )}

            </main>
            <footer className="bg-background text-foreground border-t">
                <div className="mx-auto py-10">
                    <p className="text-center text-xs text-foreground">© 2025 Muhamad Zafar Syah, Inc. All rights reserved</p>
                </div>
            </footer>
        </div>
    );
}

export default DetailProductPage;