import createInstance from "@/axios/instance"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { TransactionType } from "@/types/transaction.type"
import { toRupiah } from "@/utils/toRupiah"
import { useQuery } from "@tanstack/react-query"
import { ArrowDownCircle, ArrowUpCircle, Clock, Search, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useRouter } from 'next/router'
import { useState } from "react"
import { ScrollArea } from "./ui/scroll-area"

export default function TransactionHistory() {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedOrder, setSelectedOrder] = useState<TransactionType | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const { isLoading, data: orders = [] } = useQuery({
        queryKey: ["allOrders"],
        queryFn: async () => {
            const response = await createInstance().get("/my-orders");
            return response.data.data;
        },
    });

    const filteredOrders = orders.filter((order: TransactionType) => {
        const searchTerm = search.toLowerCase();
        const matchesSearch =
            order.status.toLowerCase().includes(searchTerm) ||
            order.shipping_address.toLowerCase().includes(searchTerm) ||
            order.total_amount.toString().includes(search) ||
            order.items.some(item =>
                item.product.name.toLowerCase().includes(searchTerm)
            );

        const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const getOrderIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "paid":
                return <ArrowUpCircle className="h-6 w-6 text-green-500" />
            case "pending":
                return <Clock className="h-6 w-6 text-gray-500" />
            default:
                return <ArrowDownCircle className="h-6 w-6 text-red-500" />
        }
    }

    const parseShippingAddress = (addressString: string) => {
        try {
            return JSON.parse(addressString);
        } catch (error: unknown) {
            console.log(error);
            return { name: "Unknown", address: "N/A", city: "N/A", country: "N/A" };
        }
    }

    const handleCardClick = (order: TransactionType) => {
        if (order.status.toLowerCase() === "paid") {
            router.push(`/user/transaction/detail-transaction/${order.id}`)
        } else {
            setSelectedOrder(order)
            setIsDialogOpen(true)
        }
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 w-full sm:w-[300px]"
                    />
                </div>
                <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                >
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <p className="text-center">Loading orders...</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredOrders.map((order: TransactionType) => {
                        const shippingAddress = parseShippingAddress(order.shipping_address);
                        return (
                            <Card
                                key={order.id}
                                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => handleCardClick(order)}
                            >
                                <CardContent className="p-0">
                                    <div className="flex items-center p-4 bg-muted">
                                        <div className="mr-4">{getOrderIcon(order.status)}</div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold">{shippingAddress.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn("font-bold",
                                                order.status === "paid" ? "text-green-500" : "text-foreground")}>
                                                {toRupiah(order.total_amount)}
                                            </p>
                                            <Badge variant={order.status === "paid" ? "default" : "secondary"}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-background">
                                        <p className="text-sm text-muted-foreground">
                                            {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.country}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-start font-serif">Order Details</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">Status</p>
                                    <Badge variant="secondary">{selectedOrder.status}</Badge>
                                </div>
                                <div>
                                    <p className="font-semibold">Total Amount</p>
                                    <p className="font-bold">{toRupiah(selectedOrder.total_amount)}</p>
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold mb-2">Items</p>
                                <ScrollArea className="h-[280px] rounded-md border p-4">
                                    <div className="space-y-4">
                                        {selectedOrder.items.map((item, index) => (
                                            <div key={index} className="border rounded-lg p-2">
                                                <div className="flex gap-2 md:flex-row flex-col">
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        className="size-24 object-contain rounded-lg"
                                                    />
                                                    <div className="space-y-1">
                                                        <h3 className="text-sm font-semibold">{item.product.name}</h3>
                                                        <p className="text-xs text-muted-foreground">
                                                            Price: {toRupiah(item.price)}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Qty: {item.quantity}
                                                        </p>
                                                        <p className="text-sm font-bold text-primary">
                                                            Total: {toRupiah(item.quantity * item.price)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <div className="animate-fade-in-up delay-400 mx-auto">
                            <Link
                                href={selectedOrder?.payment_url}
                                className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                <ShoppingBag className="mr-2" />
                                Pay Now
                            </Link>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {!isLoading && filteredOrders.length === 0 && (
                <p className="text-center text-muted-foreground mt-8">No orders found.</p>
            )}
        </div>
    )
}