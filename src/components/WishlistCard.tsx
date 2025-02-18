
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, HeartIcon } from "lucide-react";
import Link from "next/link";
import { toRupiah } from "@/utils/toRupiah";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createInstance from "@/axios/instance";
import { toast } from "sonner";
import Image from "next/image";

export interface WishlistItem {
    id: number;
    category_id: number;
    attributes: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    stock: number;
    status: string;
    created_at: string;
    updated_at: string;
    category: string;
    user_id: number;
}

interface WishlistCardProps {
    item: WishlistItem;
}

export default function WishlistCard({ item }: WishlistCardProps) {

    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation({
        mutationFn: async () => {
            const instance = createInstance();
            const response = await instance.delete(`/wishlist/${item.id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Product removed from wishlist");
            queryClient.invalidateQueries({ queryKey: ['allWishlists'] });

        },
        onError: (error: {
            response: { data: { error: string } }; message: string
        }) => {
            toast.error(error.response?.data.error || "Failed to remove product from wishlist");
        },
    });

    const handleRemoveFromWishlist = () => {
        mutate();
    };





    return (
        <Card className="p-4 w-full md:h-full h-full flex flex-col justify-between  overflow-hidden group relative space-y-4">
            <Card className="group-hover:opacity-90">
                <Link href={`/detail-product/${item.slug}`}>
                    <Image
                        className="w-full object-cover rounded-lg aspect-square"
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={300}
                        height={500}
                    />
                </Link>
            </Card>
            <div className="flex mt-0 justify-between space-x-1">
                <div>
                    <h3 className="text-lg sm:text-sm md:text-sm  lg:text-lg ">
                        <Link href={`/detail-product/${item.slug}`}>
                            {item.name.length > 40 ? `${item.name.slice(0, 40)}...` : item.name}
                        </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <p className="text-lg font-semibold hidden md:block">{toRupiah(item.price)}</p>
                </div>
                <p className="text-lg font-semibold md:hidden">{toRupiah(item.price)}</p>
            </div>
            <div className="flex gap-4">
                <Button disabled={isLoading} onClick={handleRemoveFromWishlist}
                    variant="outline" size="icon" className="flex-shrink-0 z-40 bg-red-200">
                    <HeartIcon className="size-4 fill-red-600 text-red-600" />
                </Button>
                <Link className="w-full" href={`/detail-product/${item.slug}`}>
                    <Button variant="default" className="w-full">
                        <Eye className="size-4 me-1" /> Detail Product
                    </Button>
                </Link>
            </div>
        </Card >

    );
}
