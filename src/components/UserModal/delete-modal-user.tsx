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
import { toast } from "sonner";
function ModalDeleteUser(props: { UserId: number, children: React.ReactNode }) {
    const { UserId, children } = props;


    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation(
        () => createInstance().delete(`/profile/${UserId}`),
        {
            onSuccess: () => {
                toast.success("Profile deleted successfully");
                queryClient.invalidateQueries(["allProfiles"]);
            },
            onError: (error) => {
                console.log(error);

            },
        },
    );
    const handleDeleteUser = async () => {
        if (!UserId) {
            toast.error("ID pengguna tidak valid.");
            return;
        }
        mutate();
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                >
                    {children}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure? </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteUser}>
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
export default ModalDeleteUser;
