import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AdminLayout from "@/components/layouts/admin";
import { useQuery } from "@tanstack/react-query";
import { UserType } from "@/types/user.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, } from "lucide-react";
import createInstance from "@/axios/instance";
import ModalDeleteUser from "@/components/UserModal/delete-modal-user";
import InactiveUserModal from "@/components/UserModal/inactive-user-modal";
import { DetailUserModal } from "@/components/UserModal/detail-user-modal";

function AdminUserPage() {

    const { isLoading, data } = useQuery({
        queryKey: ["allProfiles"],
        queryFn: async () => {
            const response = await createInstance().get("/profile");
            const data = response.data.data

            return data.data;
        },
    });



    return (
        <AdminLayout className="w-full flex flex-col md:flex-row">
            <div>AdminUserPage</div>
            <ScrollArea className="h-fit w-full md:w-full rounded-md border px-4 pb-5">
                <Table>
                    <TableCaption>Data semua pengguna.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">No.</TableHead>
                            <TableHead className="w-[200px]">Full Name</TableHead>
                            <TableHead className="w-[200px]">Email</TableHead>
                            <TableHead className="w-[150px]">Telepon</TableHead>
                            <TableHead className="w-[150px]">Role</TableHead>
                            <TableHead className="w-[150px]">Status</TableHead>
                            <TableHead className="w-[150px]">Dibuat Pada</TableHead>
                            <TableHead className="w-[200px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.length > 0 ? (
                            data.map((user: UserType, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{user.fullname}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        {
                                            user.isActive ? (
                                                <Badge className="bg-green-500">Active</Badge>
                                            ) : (
                                                <Badge variant="destructive">Inactive</Badge>
                                            )
                                        }
                                    </TableCell>
                                    <TableCell>{user.created_at}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            {user.id ? (
                                                <>
                                                    <DropdownMenu >
                                                        <DropdownMenuTrigger asChild>
                                                            <Button size="icon" className="bg-destrucive" variant="outline">
                                                                <EllipsisVertical />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 ">
                                                            <DropdownMenuLabel>Actions User</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuGroup className=" flex flex-col space-y-2">
                                                                <ModalDeleteUser UserId={user.user_id} >
                                                                    Delete
                                                                </ModalDeleteUser>
                                                                <DetailUserModal User={user} />
                                                                <InactiveUserModal UserId={user.id} isActive={user.isActive} Fullname={user.fullname} />
                                                            </DropdownMenuGroup>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>


                                                </>
                                            ) : (
                                                <p>ID tidak valid</p>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    {isLoading ? <p>Loading...</p> : <p>Data tidak ditemukan.</p>}
                                </TableCell>
                            </TableRow>
                        )}

                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </AdminLayout>
    );
}

export default AdminUserPage;
