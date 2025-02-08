import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateCartItemQuantity } from '@/query/cart';
import debounce from 'lodash/debounce';

export const useCartQuantityUpdate = () => {
    const queryClient = useQueryClient();
    const [updateQueue, setUpdateQueue] = useState<{ productId: number, change: number }[]>([]);

    const processUpdates = useCallback(debounce(async (updates: { productId: number, change: number }[]) => {
        const aggregatedUpdates = updates.reduce((acc, curr) => {
            const existing = acc.find(item => item.productId === curr.productId);
            if (existing) {
                existing.change += curr.change;
            } else {
                acc.push(curr);
            }
            return acc;
        }, [] as { productId: number, change: number }[]);

        for (const update of aggregatedUpdates) {
            try {
                const response = await updateCartItemQuantity(update.productId, update.change);

                if (response.message === 'Insufficient stock') {

                    toast.error(`Maximum stock available: ${response.available_stock}`);
                    continue;
                }

                queryClient.invalidateQueries({ queryKey: ['allCarts'] });
            } catch (error: any) {
                const errorMessage = error.response?.data.available_stock || 'Failed to update cart';
                toast.error("Sisa stock produk ini adalah: " + errorMessage);

            }
        }

        setUpdateQueue([]);
    }, 300), [queryClient]);

    const updateQuantity = useCallback((productId: number, change: number) => {
        const newQueue = [...updateQueue, { productId, change }];
        setUpdateQueue(newQueue);
        processUpdates(newQueue);
    }, [updateQueue, processUpdates]);

    return { updateQuantity };
};