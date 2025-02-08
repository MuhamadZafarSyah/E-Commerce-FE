import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { UserType } from "@/types/user.type";
import { Textarea } from "../ui/textarea";


export function DetailUserModal({ User }: { User: UserType }) {
    const [isOpen, setIsOpen] = useState(false);


    const handleClose = () => setIsOpen(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" >
                    Lihat Detail
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detail Pengguna</DialogTitle>
                    <DialogDescription>
                        Detail pengguna {User.fullname}.
                    </DialogDescription>
                </DialogHeader>
                <DialogDescription className="space-y-4">
                    <div>
                        <Label>Nama Lengkap</Label>
                        <Input value={User.fullname} readOnly />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input value={User.email} readOnly />
                    </div>
                    <div>

                        <Label>Nomor Telepon</Label>
                        <Input value={User.phone} readOnly />
                    </div>
                    <div>
                        <Label>Alamat</Label>
                        <Textarea value={User.address} readOnly />
                    </div>
                </DialogDescription>
                <DialogFooter>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleClose}>
                            Tutup
                        </Button>
                    </DialogTrigger>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
