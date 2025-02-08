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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader } from "lucide-react";
import createInstance from "@/axios/instance";

interface dataCategory {
    name?: string;
    status?: string;
}

function ModalCreateCategory() {

    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation(
        (data: dataCategory) => createInstance().post('/category', data),
        {
            onSuccess: () => {
                toast.success("Category created successfully");
                queryClient.invalidateQueries(["allCategories"]);
            },
            onError: (error: { response: { data: { message: string; }; }; }) => {
                console.log(error);

                toast.error(error.response?.data.message);
            },
        },
    );
    const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const data: dataCategory = {
            name: formData.get("name") as string,
            status: formData.get("status") as string,
        };
        mutate(data);

    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                >
                    Create Category
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                    <DialogDescription>
                        Fill the form below to create a new category.
                    </DialogDescription>
                </DialogHeader>

                <form id="createCategory" onSubmit={handleCreateCategory} method="post">
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" placeholder="Category Name" className="col-span-3" name="name" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <Select name="status">
                                <SelectTrigger className="w-full col-span-3">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="w-full col-span-3">
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>

                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button type="submit" form="createCategory" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Loading...</>) : (
                            "Save"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export default ModalCreateCategory;

