import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import instance from "@/axios/instance";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserCheck, UserRoundX } from "lucide-react"
import createInstance from "@/axios/instance";




function InactiveUserModal(props: { UserId: number, isActive: boolean, Fullname: string }) {
    const { UserId, isActive, Fullname } = props;


    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation(
        () => createInstance().post(`/profile/${UserId}/inactivate`),
        {
            onError: (error) => {
                console.log(error);
            },
            onSuccess: () => {
                toast.success("Pengguna berhasil dinonaktifkan");
                queryClient.invalidateQueries(["allProfiles"]);
            },
        });

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleInactiveUser = async () => {
        if (!UserId) {
            toast.error("ID pengguna tidak valid.");
            return;
        }
        mutate();
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="default" size="sm" className={`${isActive ? "" : " hover:bg-green-500 bg-green-600"} `}
                    onClick={handleOpen}>
                    {
                        isActive ? (
                            <UserRoundX size={16} />

                        ) :
                            (
                                <UserCheck size={16} />
                            )
                    }
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{isActive ? "Nonaktifkan" : "Aktifkan"} Pengguna {Fullname}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin {isActive ? "Nonaktifkan" : "Aktifkan"} pengguna ?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline" onClick={handleClose}>
                            Batal
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            variant="destructive"
                            onClick={handleInactiveUser}
                            disabled={isLoading}
                        >
                            {isActive ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default InactiveUserModal;
