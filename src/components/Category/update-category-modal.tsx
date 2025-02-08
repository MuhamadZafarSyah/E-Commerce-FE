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
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import createInstance from "@/axios/instance";

type UpdateCategoryModalProps = {
    categoryData: {
        id: number;
        name: string;
        status: string;
    };
};

export function UpdateCategoryModal(props: UpdateCategoryModalProps) {
    const { categoryData } = props;
    const [name, setName] = useState(categoryData.name);
    const [status, setStatus] = useState(categoryData.status);
    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation(
        (data: { name?: string; status?: string }) =>
            createInstance().post(`/category/${categoryData.id}`, data),
        {
            onSuccess: () => {
                toast.success("Category updated successfully");
                queryClient.invalidateQueries(["allCategories"]);
            },
            onError: (error) => {
                console.log(error);

            },
        }
    );

    const handleUpdateCategory = async () => {
        const data = {} as { name?: string; status?: string };
        if (name !== categoryData.name) data.name = name;
        if (status !== categoryData.status) data.status = status;
        await mutate(data);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    className="h-9 rounded-md px-3 md:h-10 md:px-4 md:py-2"
                >
                    <Edit size={16} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Update Category</AlertDialogTitle>
                    <AlertDialogDescription>
                        Fill in the form below to update the category.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value || "")}
                        placeholder="Enter name"
                    />
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={status}
                        onValueChange={(value) => setStatus(value || "")}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleUpdateCategory}>
                        {isLoading ? "Updating..." : "Update"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

