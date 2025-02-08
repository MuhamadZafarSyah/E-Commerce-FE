import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AdminLayout from "@/components/layouts/admin";
import { useQuery } from "@tanstack/react-query";
import ModalCreateCategory from "@/components/Category/create-category-modal";
import { UpdateCategoryModal } from "@/components/Category/update-category-modal";
import DeleteCategoryModal from "@/components/Category/delete-category-modal";
import { Badge } from "@/components/ui/badge";
import createInstance from "@/axios/instance";
import { CategoryType } from "@/types/category.type";


function AdminCategoryPage() {


    const { isLoading, data } = useQuery({
        queryKey: ["allCategories"],
        queryFn: async () => {
            const response = await createInstance().get("/category");
            const data = response.data.data;
            return data.data;
        },
    });



    return (
        <AdminLayout className="w-full flex flex-col md:flex-row">
            <div className="flex justify-between items-center">
                <h1>AdminCategoryPage</h1>
                <ModalCreateCategory />
            </div>

            <ScrollArea className="h-fit w-full md:w-full rounded-md border px-4 pb-5">
                <Table>
                    <TableCaption>Data semua pengguna.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className=" md:w-[50px]">No.</TableHead>
                            <TableHead className=" md:w-[200px]">Name</TableHead>
                            <TableHead className=" md:w-[200px]">Status</TableHead>
                            <TableHead className=" md:w-[150px]">Product</TableHead>
                            <TableHead className=" md:w-[150px]">Date</TableHead>
                            <TableHead className=" md:w-[200px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.length > 0 ? (
                            data.map((category: CategoryType, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}.</TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>{
                                        category.status === "active" ? (
                                            <Badge>Active</Badge>
                                        ) : (
                                            <Badge variant={'destructive'}>Inactive</Badge>
                                        )
                                    }</TableCell>
                                    <TableCell>{category.products}</TableCell>
                                    <TableCell>{category.created_at}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            {category.id ? (
                                                <>
                                                    <DeleteCategoryModal categoryId={category.id} />
                                                    <UpdateCategoryModal categoryData={category} />
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

export default AdminCategoryPage;
