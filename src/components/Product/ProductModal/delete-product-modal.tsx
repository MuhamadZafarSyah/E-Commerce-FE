import createInstance from "@/axios/instance";
import instance from "@/axios/instance";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
function ModalDeleteProduct(props: { productId: number }) {
    const { productId } = props;

    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation(
        (id: number) => createInstance().delete(`/products/${id}`),
        {
            onSuccess: () => {
                toast.success("Product deleted successfully");
                queryClient.invalidateQueries(["allProducts"]);
            },
            onError: (error: unknown) => {
                console.log(error);

            },
        },
    );
    const handleDeleteProduct = async () => {
        if (!productId) {
            toast.error("ID product tidak valid.");
            return;
        }
        await mutate(productId);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    className="h-9 rounded-md px-3 md:h-10 md:px-4 md:py-2"
                >
                    <Trash2 size={16} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure? </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this
                        product and remove it from your store.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteProduct}>
                        {
                            isLoading ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                "Delete"
                            )
                        }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
export default ModalDeleteProduct;

