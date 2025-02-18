import createInstance from "@/axios/instance";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { HeartIcon } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "sonner";

interface AddToWishlistButtonProps {
    id: number;
    is_in_wishlist: boolean | null;
}

function AddToWishlistButton({ id, is_in_wishlist }: AddToWishlistButtonProps) {
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
            toast.success("Product already in wishlist");
            router.push("/user/wishlist");
        },
        onError: (error: {
            response: { data: { error: string } }; message: string
        }) => {
            toast.error(error.response?.data.error || "Failed to add product to wishlist");
        }
    });

    const handleAddToWishlist = async () => {
        await mutate();
    };


    const { mutate: removeFromWishlist, isLoading: isLoadingRemove } = useMutation({
        mutationFn: async () => {
            const instance = createInstance();
            const response = await instance.delete(`/wishlist/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Product removed from wishlist");
            router.push("/user/wishlist");
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
        <>
            {
                is_in_wishlist ? (
                    <Button className="w-full bg-red-600 text-white " size="lg" onClick={handleRemoveFromWishlist} disabled={isLoadingRemove} variant="ghost">
                        <HeartIcon className="w-4  h-4 mr-2" />
                        Remove from wishlist
                    </Button>
                ) : (
                    <Button className="w-full" size="lg" onClick={handleAddToWishlist} disabled={isLoading} variant="outline">
                        <HeartIcon className="w-4 h-4 mr-2" />
                        Add to wishlist
                    </Button>
                )
            }
        </>
    );
}

export default AddToWishlistButton;

