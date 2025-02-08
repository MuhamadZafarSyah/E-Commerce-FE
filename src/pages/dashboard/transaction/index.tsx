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
import { Badge } from "@/components/ui/badge";
import createInstance from "@/axios/instance";
import { toRupiah } from "@/utils/toRupiah";
import DeleteTransactionModal from "@/components/Transaction/delete-transaction-modal";
import DetailTransactionModal from "@/components/Transaction/detail-transaction-modal";
import { TransactionType } from "@/types/transaction.type";

const badge = (status: string) => {
    if (status === "paid") {
        return <Badge className="bg-green-500">Paid</Badge>;
    } if (status === "failed") {
        return <Badge variant={"destructive"}>Failed</Badge>;
    } if (status === "pending") {
        return <Badge className="bg-yellow-500">Pending</Badge>;
    } else {
        return <Badge>Unknown</Badge>;
    }
}

function AdminTransactionPage() {

    const { isLoading, data } = useQuery({
        queryKey: ["allTransactions"],
        queryFn: async () => {
            const response = await createInstance().get("/orders");
            const data = response.data.data;
            console.log(data.data);
            return data.data;
        },
    });



    return (
        <AdminLayout className="w-full flex flex-col md:flex-row">
            <div className="flex justify-between items-center">
                <h1>AdminTransactionPage</h1>
            </div>

            <ScrollArea className="h-fit w-full md:w-full rounded-md border px-4 pb-5">
                <Table>
                    <TableCaption>Data semua pengguna.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className=" md:w-[50px]">No.</TableHead>
                            <TableHead className=" md:w-[200px]">Name</TableHead>
                            <TableHead className=" md:w-[200px]">Email</TableHead>
                            <TableHead className=" md:w-[200px]">Phone</TableHead>
                            <TableHead className=" md:w-[200px]">Status</TableHead>
                            <TableHead className=" md:w-[150px]">Total Amount</TableHead>
                            <TableHead className=" md:w-[150px]">Date</TableHead>
                            <TableHead className=" md:w-[200px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.length > 0 ? (
                            data.map((orders: TransactionType, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}.</TableCell>
                                    <TableCell>{orders.fullname}</TableCell>
                                    <TableCell>{orders.email}</TableCell>
                                    <TableCell>{orders.phone}</TableCell>
                                    <TableCell>
                                        {badge(orders.status)}
                                    </TableCell>
                                    <TableCell>{toRupiah(orders.total_amount)}</TableCell>
                                    <TableCell>{orders.created_at}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            {orders.id ? (
                                                <>
                                                    <DeleteTransactionModal transactionId={orders.id} />
                                                    <DetailTransactionModal transaction={orders} />
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

export default AdminTransactionPage;