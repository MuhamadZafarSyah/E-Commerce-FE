import createInstance from "@/axios/instance";
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
function DeleteCategoryModal(props: { categoryId: number }) {
    const { categoryId } = props;

    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation(
        () => createInstance().delete(`/category/${categoryId}`),
        {
            onSuccess: () => {
                toast.success("Category deleted successfully");
                queryClient.invalidateQueries(["allCategories"]);
            },
            onError: (error: { response: { data: { message: string } } }) => {
                console.log(error);
                toast.error(error.response?.data.message);
            },
        },
    );
    const handleDeleteCategory = async () => {
        if (!categoryId) {
            toast.error("ID kategori tidak valid.");
            return;
        }
        await mutate();
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
                        This action cannot be undone. This will permanently delete the
                        category and remove it from your store.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteCategory}>
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
export default DeleteCategoryModal;

