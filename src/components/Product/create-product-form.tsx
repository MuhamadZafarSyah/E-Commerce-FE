import createInstance from "@/axios/instance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, SetStateAction, useState } from "react";
import Editor from "react-simple-wysiwyg";
import { toast } from "sonner";
import RupiahInput from "../ui/currency-rupiah-input";

export default function CreateProductForm() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const router = useRouter();
    const [attributes, setAttributes] = useState([{ key: "", value: "" }]);

    const handleAddField = () => {
        setAttributes([...attributes, { key: "", value: "" }]);
    };

    const handleRemoveField = (index: number) => {
        const newAttributes = attributes.filter((_, i) => i !== index);
        setAttributes(newAttributes);
    };


    const handleChange = (index: number, field: "key" | "value", value: string) => {
        const newAttributes = [...attributes];
        newAttributes[index][field] = value;
        setAttributes(newAttributes);
    };

    const [html, setHtml] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const { data } = useQuery({
        queryKey: ["allCategories"],
        queryFn: async () => {
            const response = await createInstance().get("/category");
            const data = response.data.data;
            return data.data;
        },
    });

    function onChange(e: { target: { value: SetStateAction<string> } }) {
        setHtml(e.target.value);
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const { mutate, isLoading } = useMutation(
        async (data: FormData) => {
            const response = await createInstance().post("/products", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
        {
            onSuccess: () => {
                toast.success("Success create products");
                router.push("/dashboard/product");
            },
            onError: (error: { response: { data: { message: string } } }) => {
                console.log(error);
                const errorMessage =
                    error.response?.data?.message || "Failed to create product";
                toast.error(errorMessage);
            },
        }
    );

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        formData.set("attributes", JSON.stringify(attributes));

        formData.set("description", html);

        // console.log(Object.fromEntries(formData.entries()));

        mutate(formData);
    };

    return (
        <div className=" min-w-6xl overflow-hidden">
            <h1 className="text-2xl font-semibold  mb-2">Create Product</h1>
            <form id="product-form" method="post" onSubmit={onSubmit}>
                <div className="md:grid md:gap-6 md:mb-6 md:grid-cols-2 md:space-y-0 space-y-5">
                    <div className="md:col-span-1 w-full md:w-full">
                        <Label htmlFor="productName">Product Name</Label>
                        <Input name="name" id="productName" placeholder="Enter product name" />
                    </div>
                    <div className="md:col-span-1 w-full md:w-full">
                        <Label htmlFor="price">Price</Label>
                        <RupiahInput name="price" />
                    </div>
                    <div className="md:col-span-1 w-full md:w-full">
                        <Label htmlFor="weight">Weight (gram)</Label>
                        <Input name="weight" id="weight" type="number" placeholder="Enter product weight" />
                    </div>
                    <div className="md:col-span-1 w-full md:w-full">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                            name="stock"
                            id="stock"
                            placeholder="Enter stock quantity"
                            type="number"
                        />
                    </div>
                    {data && (
                        <div className="md:col-span-1 w-full md:w-full">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                name="category_id"
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {data.map((category: { id: number; name: string }) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="md:col-span-2">
                        <Label htmlFor="attributes">Attributes</Label>
                        {attributes.map((attribute, index) => (
                            <div key={index} className="flex md:col-span-1 w-full md:w-full items-center md:flex-row flex-col gap-2 mb-2">
                                <Input
                                    placeholder="Key"
                                    value={attribute.key}
                                    onChange={(e) => handleChange(index, "key", e.target.value)}
                                />
                                <Input
                                    placeholder="Value"
                                    value={attribute.value}
                                    onChange={(e) => handleChange(index, "value", e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => handleRemoveField(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onClick={handleAddField} >
                            Add Attribute
                        </Button>
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Editor
                            name="description"
                            id="description"
                            value={html}
                            onChange={onChange}
                            className="text-black dark:text-white text-foreground w-full"
                            containerProps={{
                                style: { resize: "vertical", minHeight: "400px" },
                            }}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="image">Product Image</Label>
                        <Input
                            id="image"
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file:mr-4   w-full  h-12 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        />
                    </div>
                    {imagePreview && (
                        <div className="md:col-span-1">
                            <Label>Image Preview</Label>
                            <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                                <Image
                                    fill
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Preview"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <input
                    type="hidden"
                    name="attributes"
                    value={JSON.stringify(attributes)}
                />
            </form>
            <Button form="product-form" disabled={isLoading} type="submit" className="w-full mt-4">
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                    </>
                ) : (
                    "Create Product"
                )}
            </Button>
        </div>
    );
}
