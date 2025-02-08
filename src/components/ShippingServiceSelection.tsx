import React, { useState, useEffect } from 'react';
import { Card } from "./ui/card";
import createInstance from "@/axios/instance";
import { toRupiah } from "@/utils/toRupiah";
import { toast } from 'sonner';

export const ShippingServiceSelection = ({
    selectedCity,
    courier,
    weight,
    onServiceSelect,
    total_amount
}: {
    selectedCity: string;
    courier: string;
    weight: number;
    onServiceSelect: (data: any) => void;
    total_amount: number;
}) => {
    const [shippingOptions, setShippingOptions] = useState<{ service: string; description: string; cost: { value: number; etd: string }[] }[]>([]);
    const [selectedService, setSelectedService] = useState<{ service: string; cost: { value: number; etd: string }[] } | null>(null);
    const [loading, setLoading] = useState(false);
    const [postalCode, setPostalCode] = useState("");

    useEffect(() => {
        if (selectedCity && courier && weight) {
            fetchShippingCost();
        }
    }, [selectedCity, courier, weight]);

    const fetchShippingCost = async () => {
        try {
            setLoading(true);
            const response = await createInstance().post('/postage/cek-ongkir', {
                origin: selectedCity,
                destination: "154",
                weight: weight,
                courier: courier
            });

            if (response.data.success) {
                setShippingOptions(response.data.data.rajaongkir.results[0].costs);
                setPostalCode(response.data.data.rajaongkir.destination_details.postal_code);
                onServiceSelect({ postalCode: response.data.data.rajaongkir.destination_details.postal_code });
            }
        } catch (error) {
            toast.error("Berat Produk Melebihi 30Kg");
            console.error('Error fetching shipping cost:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleServiceSelect = (service: any) => {
        setSelectedService(service);
        onServiceSelect({
            service: service,
            postalCode: postalCode,
            total: total_amount + service.cost[0].value
        });
    };

    if (loading) {
        return <div>Loading shipping options...</div>;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Shipping Service</h3>
            <div className="grid gap-4">
                {shippingOptions.map((option: any) => (
                    <Card
                        key={option.service}
                        className={`p-4 cursor-pointer relative transition-all ${selectedService?.service === option.service
                            ? 'border-2 border-primary'
                            : 'hover:border-gray-400'
                            }`}
                        onClick={() => handleServiceSelect(option)}
                    >
                        <div className="flex justify-between items-center">
                            <div className={`size-2  absolute top-2 left-2 rounded-full ${selectedService?.service === option.service ? 'bg-primary' : "bg-background"}`}></div>
                            <div>
                                <h4 className="font-medium mt-1">{option.service}</h4>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                                <p className="text-sm">Estimated: {option.cost[0].etd}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">{toRupiah(option.cost[0].value)}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {selectedService && (
                <div className="mt-4 p-4 bg-muted/40 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span>Subtotal</span>
                        <span>{toRupiah(total_amount)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span>Shipping</span>
                        <span>{toRupiah(selectedService.cost[0].value)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 font-semibold">
                        <span>Total</span>
                        <span>{toRupiah(total_amount + selectedService.cost[0].value)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};