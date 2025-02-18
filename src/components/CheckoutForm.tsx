/* eslint-disable @typescript-eslint/no-unused-vars */
import createInstance from "@/axios/instance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ShippingServiceSelection } from "./ShippingServiceSelection";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

type CheckoutFormData = {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    province: string;
    phone: string;
    email: string;
    courier: string;
};

const courierOptions = [
    { label: "JNE", value: "jne" },
    { label: "POS", value: "pos" },
    { label: "TIKI", value: "tiki" },
]


function CheckoutForm({
    total_amount,
    total_weight
}: {
    total_amount: number;
    total_weight: number;
}) {
    const [shippingDetails, setShippingDetails] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);



    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { isValid },
        watch
    } = useForm<CheckoutFormData>({
        mode: "onChange",
        defaultValues: {
            name: "",
            address: "",
            city: "",
            province: "",
            postalCode: "",
            phone: "",
            email: "",
            courier: "",
            country: "Indonesia"
        },
    });

    const selectedProvince = watch("province");
    const selectedCity = watch("city");

    // Fetch provinces
    const { data: provinces } = useQuery({
        queryKey: ["provinces"],
        queryFn: async () => {
            const response = await createInstance().get("/postage/provinces");
            return response.data.data || [];
        },

    });

    // Fetch cities based on selected province
    const { data: cities } = useQuery({
        queryKey: ["cities", selectedProvince],
        queryFn: async () => {
            if (!selectedProvince) return [];
            const res = await createInstance().get(`/postage/cities?province=${selectedProvince}`);
            return res.data.data || [];
        },
        enabled: !!selectedProvince,
    });

    const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
        if (!shippingDetails?.service) {
            return;
        }

        setIsProcessing(true);
        try {
            const selectedProvinceData = provinces?.find((p: any) => p.province_id === data.province);
            const selectedCityData = cities?.find((c: any) => c.city_id === data.city);

            const payload = {
                shipping_address: {
                    name: data.name,
                    address: data.address,
                    city: selectedCityData?.city_name || "",
                    province: selectedProvinceData?.province || "",
                    postalCode: shippingDetails.postalCode,
                    country: data.country,
                    phone: data.phone,
                    courier: data.courier,
                    shipping_service: shippingDetails.service.service,
                    shipping_cost: shippingDetails.service.cost[0].value
                },
                email: data.email,
                courier: data.courier,
                total_amount: shippingDetails.total
            };


            await mutateAsync(payload);
        } catch (error) {
            console.error("Error during checkout:", error);
        } finally {
            setIsProcessing(false);
        }
    }

    const handleServiceSelect = (details: any) => {
        setShippingDetails(details);
    };

    const { mutateAsync, isLoading } = useMutation(
        async (payload: any) => {
            const response = await createInstance().post("/checkout/create-session", payload);
            return response;
        },
        {
            onSuccess: (data) => {
                router.push(data.data.url);
            },
            onError: (error) => {
                console.error("Checkout error:", error);
            },
        }
    );
    const isFormComplete = () => {
        return isValid && shippingDetails?.service;
    };

    return (
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <Input id="name" {...field} />}
                />

            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Controller
                    name="email"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <Input id="email" {...field} />}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Controller
                    name="phone"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <Input id="phone" type="number" {...field} />}
                />
            </div>
            <div>
                <Label htmlFor="province">Province</Label>
                <Controller
                    name="province"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Provinsi" />
                            </SelectTrigger>
                            <SelectContent>
                                {provinces?.map((province: any) => (
                                    <SelectItem
                                        key={province.province_id}
                                        value={province.province_id}
                                    >
                                        {province.province}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div>
                <Label htmlFor="city">City</Label>
                <Controller
                    name="city"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!selectedProvince}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Kota" />
                            </SelectTrigger>
                            <SelectContent>
                                {cities?.map((city: any) => (
                                    <SelectItem
                                        key={city.city_id}
                                        value={city.city_id}
                                    >
                                        {`${city.type} ${city.city_name}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div>
                <Label htmlFor="courier">Courier</Label>
                <Controller
                    name="courier"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select courier" />
                            </SelectTrigger>
                            <SelectContent>
                                {courierOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Controller
                    name="address"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <Textarea id="address" {...field} />}
                />
            </div>
            {watch("city") && watch("courier") && (
                <ShippingServiceSelection
                    selectedCity={watch("city")}
                    courier={watch("courier")}
                    weight={total_weight}
                    onServiceSelect={handleServiceSelect}
                    total_amount={total_amount}
                />
            )}


            <Button
                type="submit"
                className="w-full"
                disabled={!isFormComplete() || isProcessing}
            >
                {isProcessing ? (
                    "Processing..."
                ) : !shippingDetails?.service ? (
                    "Please Select Shipping Service"
                ) : (
                    "Checkout"
                )}
            </Button>

        </form >
    );
}

export default CheckoutForm;

