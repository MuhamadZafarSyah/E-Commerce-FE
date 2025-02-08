import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import { toast } from "sonner";
import createInstance from "@/axios/instance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

interface AddToWishlistButtonProps {
    id: number;
}

function AddToWishlistButton({ id }: AddToWishlistButtonProps) {
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

    return (
        <Button className="w-full" size="lg" onClick={handleAddToWishlist} disabled={isLoading} variant="outline">
            <HeartIcon className="w-4 h-4 mr-2" />
            Add to wishlist
        </Button>
    );
}

export default AddToWishlistButton;

