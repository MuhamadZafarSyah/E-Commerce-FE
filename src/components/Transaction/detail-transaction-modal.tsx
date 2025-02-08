import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toRupiah } from "@/utils/toRupiah";
import { Pen } from "lucide-react";
import { TransactionType } from "@/types/transaction.type";



const DetailTransactionModal = ({ transaction }: { transaction: TransactionType }) => {
    const [isOpen, setIsOpen] = useState(false);

    const renderAddress = (address: string) => {
        const addressObj = JSON.parse(address);
        return (
            <>
                <p><strong>Address:</strong> {addressObj.address}</p>
                <p><strong>City:</strong> {addressObj.city}</p>
                <p><strong>Country:</strong> {addressObj.country}</p>
                <p><strong>Postal Code:</strong> {addressObj.postalCode}</p>
            </>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="h-9 rounded-md px-3 md:h-10 md:px-4 md:py-2">
                    <Pen size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transaction Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    <p><strong>Name:</strong> {transaction.fullname}</p>
                    <p><strong>Email:</strong> {transaction.email}</p>
                    <p><strong>Phone:</strong> {transaction.phone}</p>
                    <p><strong>Status:</strong> {transaction.status}</p>
                    {renderAddress(transaction.shipping_address)}
                    <p><strong>Total Amount:</strong> {toRupiah(transaction.total_amount)}</p>
                    <p><strong>Date:</strong> {transaction.created_at}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DetailTransactionModal;

