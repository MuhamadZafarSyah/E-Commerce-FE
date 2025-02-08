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

function DeleteTransactionModal(props: { transactionId: number }) {
    const { transactionId } = props;

    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation(
        () => createInstance().delete(`/orders/${transactionId}`),
        {
            onSuccess: () => {
                toast.success("Transaction deleted successfully");
                queryClient.invalidateQueries(["allTransactions"]);
            },
            onError: (error: { response: { data: { message: string } } }) => {
                console.log(error);
                toast.error(error.response?.data.message);
            },
        },
    );

    const handleDeleteTransaction = async () => {
        if (!transactionId) {
            toast.error("ID transaction tidak valid.");
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
                        transaction and remove it from your records.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isLoading} onClick={handleDeleteTransaction}>
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

export default DeleteTransactionModal;

