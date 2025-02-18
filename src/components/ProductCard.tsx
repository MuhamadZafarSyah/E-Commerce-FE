import createInstance from "@/axios/instance"
import { toRupiah } from "@/utils/toRupiah"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Eye, HeartIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import Image from "next/image"
interface ProductCardProps {
    id: number
    name: string
    price: number
    image: string
    category: string // Harus string bukan object
    stock: number
    slug: string
    is_in_wishlist: boolean | null
}

export function ProductCard({ name, price, image, category, slug, id, is_in_wishlist }: ProductCardProps) {

    const router = useRouter();

    const { mutate, isLoading } = useMutation({
        mutationFn: async () => {
            const instance = createInstance();
            const response = await instance.post("/wishlist", {
                product_id: id,
            });

            return response.data;
        },
        onSuccess: () => {
            router.push("/user/wishlist");
            toast.success("Product added to wishlist");
        },
        onError: (error: any) => {
            if (error === "Unauthorized") {
                toast.error("Please login first");
                router.push("/auth/login");
            } else {
                toast.error(error.response?.data.error || "Failed to add product to wishlist");
            }
        }
    });

    const handleAddToWishlist = async () => {
        await mutate();
    };

    const queryClient = useQueryClient();


    const { mutate: removeFromWishlist, isLoading: isLoadingRemove } = useMutation({
        mutationFn: async () => {
            const instance = createInstance();
            const response = await instance.delete(`/wishlist/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Product removed from wishlist");
            queryClient.invalidateQueries({ queryKey: ['allProducts'] });

        },
        onError: (error: {
            response: { data: { error: string } }; message: string
        }) => {
            toast.error(error.response?.data.error || "Failed to remove product from wishlist");
        },
    });

    const handleRemoveFromWishlist = () => {
        removeFromWishlist();
    };


    return (
        <Card key={id} className="p-4 w-full md:h-full h-full flex flex-col justify-between  overflow-hidden group relative space-y-4">
            <Card className="group-hover:opacity-90">
                <Link href={`/detail-product/${slug}`}>
                    <Image
                        className="w-full object-cover rounded-lg aspect-square"
                        src={image}
                        width={300}
                        height={500}
                        alt={name}
                    />
                </Link>
            </Card>
            <div className="flex mt-0 justify-between space-x-1">
                <div>
                    <h3 className="text-lg sm:text-sm md:text-sm  lg:text-lg ">
                        <Link href={`/detail-product/${slug}`}>
                            {name.length > 40 ? `${name.slice(0, 40)}...` : name}
                        </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">{category}</p>
                    <p className="text-lg font-semibold hidden md:block">{toRupiah(price)}</p>
                </div>
                <p className="text-lg font-semibold md:hidden">{toRupiah(price)}</p>
            </div>
            <div className="flex gap-4">

                {
                    is_in_wishlist ? (
                        <Button disabled={isLoadingRemove} onClick={handleRemoveFromWishlist}
                            variant="outline" size="icon" className="flex-shrink-0 z-40 bg-red-200">
                            <HeartIcon className="size-4 fill-red-600 text-red-600" />
                        </Button>
                    ) : (
                        <Button disabled={isLoading} onClick={handleAddToWishlist} variant="outline" size="icon" className="flex-shrink-0 z-40">
                            <HeartIcon className="size-4" />
                        </Button>

                    )
                }

                <Link className="w-full" href={`/detail-product/${slug}`}>
                    <Button variant="default" className="w-full">
                        <Eye className="size-4 me-1" /> Detail Product
                    </Button>
                </Link>
            </div>
        </Card >

    )
}

