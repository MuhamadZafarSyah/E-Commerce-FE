import createInstance from "@/axios/instance";
import AdminLayout from "@/components/layouts/admin";
import UpdateProductForm from "@/components/Product/update-product-form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";

function UpdateProductPage() {
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            router.push("/dashboard/product");
        }
    }, [id, router]);

    const { data, isSuccess } = useQuery({
        queryKey: ["detailProduct", id],
        queryFn: async () => {
            if (typeof id === "string") {
                const response = await createInstance().get(`/products/${id}`);
                const data = response.data;
                return data.data;
            }
            throw new Error("Product ID is not valid");
        },
        enabled: !!id,
    });



    return (
        <AdminLayout>
            {isSuccess && <UpdateProductForm product={data} />}
        </AdminLayout>
    );
}
export default UpdateProductPage;
