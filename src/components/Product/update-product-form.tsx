/* eslint-disable @next/next/no-img-element */
import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import Editor from "react-simple-wysiwyg";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RupiahInput from "../ui/currency-rupiah-input";
import createInstance from "@/axios/instance";

interface UpdateProductFormProps {
    product: {
        id: number;
        name: string;
        price: number;
        stock: number;
        weight: number;
        description: string;
        image: string;
        category: string;
        category_id: number;
        attributes: { key: string; value: string }[];
    };
}

export default function UpdateProductForm({ product }: UpdateProductFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(product.image);
    const [html, setHtml] = useState(product.description);
    const [attributes, setAttributes] = useState(product.attributes || []);
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: categories } = useQuery({
        queryKey: ["allCategories"],
        queryFn: async () => {
            const response = await createInstance().get("/category");
            const data = response.data.data;
            return data.data;
        },
    });

    const handleAttributeChange = (index: number, field: "key" | "value", value: string) => {
        const updatedAttributes = [...attributes];
        updatedAttributes[index][field] = value;
        setAttributes(updatedAttributes);
    };

    const handleAddAttribute = () => {
        setAttributes([...attributes, { key: "", value: "" }]);
    };

    const handleRemoveAttribute = (index: number) => {
        const updatedAttributes = attributes.filter((_, i) => i !== index);
        setAttributes(updatedAttributes);
    };

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
            const response = await createInstance().post(`/products/${product.id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
        {
            onSuccess: () => {
                toast.success("Product updated successfully");
                router.push("/dashboard/product");
                queryClient.invalidateQueries(["detailProduct"]);
            },
            onError: (error: { response: { data: { message: string } } }) => {
                console.log(error);
                const errorMessage = error.response?.data?.message || "Failed to update product";
                toast.error(errorMessage);
            },
        }
    );

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const imageInput = form.querySelector('input[type="file"]') as HTMLInputElement;
        if (!imageInput.files?.length) {
            formData.delete("image");
        }

        formData.set("description", html);
        formData.set("attributes", JSON.stringify(attributes));
        mutate(formData);
    };

    console.log(product);


    return (
        <div className="p-4 min-w-6xl">
            <h1 className="text-2xl font-semibold mb-2">Update Product</h1>
            <form id="product-form" method="post" onSubmit={onSubmit}>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div className="md:col-span-1 w-fit md:w-full">
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                            name="name"
                            id="productName"
                            defaultValue={product.name}
                            placeholder="Enter product name"
                        />
                    </div>
                    <div className="md:col-span-1 w-fit md:w-full">
                        <Label htmlFor="price">Price</Label>
                        <RupiahInput name="price" defaultValue={product.price} />
                    </div>
                    <div className="md:col-span-1 w-fit md:w-full">
                        <Label htmlFor="weight">Weight (gram)</Label>
                        <Input name="weight" id="weight" type="number" defaultValue={product.weight} />
                    </div>
                    <div className="md:col-span-1 w-fit md:w-full">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                            name="stock"
                            id="stock"
                            defaultValue={product.stock}
                            placeholder="Enter stock quantity"
                            type="number"
                        />
                    </div>
                    {categories && (
                        <div className="md:col-span-1 w-fit md:w-full">
                            <Label htmlFor="category">Category</Label>
                            <Select name="category_id">
                                <SelectTrigger className="w-full">
                                    <SelectValue defaultValue={String(product.category_id)} placeholder={product.category} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category: { id: number; name: string }) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="md:col-span-2">
                        <Label>Attributes</Label>
                        {attributes.map((attribute, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <Input
                                    placeholder="Key"
                                    value={attribute.key}
                                    onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                                />
                                <Input
                                    placeholder="Value"
                                    value={attribute.value}
                                    onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                                />
                                <Button
                                    variant="destructive"
                                    type="button"
                                    onClick={() => handleRemoveAttribute(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onClick={handleAddAttribute} className="mt-2">
                            Add Attribute
                        </Button>
                    </div>



                    <div className="md:col-span-2 col-span-1">
                        <Label>Current Image</Label>
                        <div className="mt-2 relative aspect-video w-[300px] md:w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                            <img
                                src={imagePreview || product.image || "/placeholder.svg"}
                                alt="Product"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="image">Update Product Image</Label>
                        <Input
                            id="image"
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file:mr-4 h-12 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Editor
                            name="description"
                            id="description"
                            value={html}
                            className="max-w-screen-sm md:max-w-full"
                            onChange={(e) => setHtml(e.target.value)}
                            containerProps={{ style: { resize: "vertical", minHeight: "400px" } }}
                        />
                    </div>
                </div>
            </form>
            <Button form="product-form" disabled={isLoading} type="submit" className="w-full">
                {isLoading ? (
                    <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                    </>
                ) : (
                    "Update Product"
                )}
            </Button>
        </div>
    );
}