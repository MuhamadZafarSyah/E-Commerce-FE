/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/transaction/detail-transaction/[id].tsx

import { useRouter } from 'next/router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import createInstance from '@/axios/instance'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { toRupiah } from '@/utils/toRupiah'
import { useState } from 'react'
import Head from 'next/head'
import { Navbar } from '@/components/Navbar'
import { Star } from 'lucide-react'
import Footer from '@/components/Footer'

export default function TransactionDetailPage() {
    const router = useRouter()
    const { id } = router.query
    const queryClient = useQueryClient()


    // Fetch order details
    const { data: order, isLoading, error } = useQuery({
        queryKey: ['orderDetails', id],
        queryFn: async () => {
            const response = await createInstance().get(`/my-orders/${id}`)
            console.log(response.data.data);
            return response.data.data
        },
        refetchOnWindowFocus: false,

        enabled: !!id,
    },)

    // Mutation untuk submit review
    const { mutate: submitReview } = useMutation({
        mutationFn: async (data: any) => {
            return createInstance().post('/reviews', data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['orderDetails', id])
        }
    })

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-4 space-y-8">
                <Skeleton className="h-8 w-48" />
                <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="border rounded-lg p-4 space-y-4">
                            <Skeleton className="h-6 w-64" />
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return <div className="text-center py-8">Error loading order details</div>
    }

    if (!order) {
        return <div className="text-center py-8">Order not found</div>
    }

    return (
        <>
            <Head>
                <title>Detail Transaction</title>
            </Head>
            <main>
                <Navbar />


                <div className="max-w-4xl min-h-screen mx-auto p-4">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">Order Details </h1>
                        <div className="mt-4 flex justify-between items-center gap-4">
                            <div>
                                <p className="text-muted-foreground">Order Date</p>
                                <p>{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Status</p>
                                <Badge className='bg-green-600 text-white' variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                    {order.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {order.items.map((item: any) => {
                            const existingReview = order.reviews?.find(
                                (r: any) => r.product_id === item.product.id
                            )

                            return (
                                <div key={item.id} className="border rounded-lg p-6">
                                    <div className="flex gap-4 mb-4 md:flex-row flex-col">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="size-36 object-contain rounded-lg"
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold">{item.product.name}</h3>
                                            <div className="mt-1 space-y-1">
                                                <p className="text-sm text-muted-foreground">
                                                    Price: {toRupiah(item.price)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Quantity: {item.quantity}
                                                </p>
                                                <p className="text-lg font-bold text-primary">
                                                    Total: {toRupiah(item.quantity * item.price)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {existingReview ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-1">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, index) => (
                                                        <Star
                                                            key={index}
                                                            className={`w-5 h-5 ${index < existingReview.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-400 text-gray-400'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            {existingReview.comment && (
                                                <p className="text-muted-foreground">{existingReview.comment}</p>
                                            )}
                                            <p className="text-sm text-muted-foreground mt-2">
                                                Reviewed on {new Date(existingReview.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ) : (
                                        <ReviewForm
                                            productId={item.product.id}
                                            orderId={order.id}
                                            onSubmit={submitReview}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

function ReviewForm({ productId, orderId, onSubmit }: any) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            product_id: productId,
            order_id: orderId,
            rating,
            comment
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-3xl animate-rating ${rating >= star ? 'text-yellow-400' : 'text-gray-300'
                            } hover:text-yellow-400 transition-colors`}
                    >
                        ★
                    </button>
                ))}
            </div>

            <Textarea
                placeholder="Write your review (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
            />

            <Button
                type="submit"
                disabled={!rating}
                className="w-full"
            >
                Submit Review
            </Button>
        </form>
    )
}