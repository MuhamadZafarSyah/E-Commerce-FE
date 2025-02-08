
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Card } from "../ui/card"
import { Star } from "lucide-react"
import { ReviewType } from "@/types/product.type";
import { formatDateTime } from "@/utils/formatDateTime";




export default function ReviewComponent({ reviews }: { reviews: ReviewType[] }) {

    return (
        <div className="mx-auto  space-y-6 py-8 px-4 md:px-6">
            {reviews.length > 0 ? (
                <>
                    <h2 className="md:text-3xl text-2xl font-bold text-center ">What they say?</h2>
                    <Card className="space-y-4 max-w-4xl mx-auto bg-muted/20">
                        {reviews.map((review) => (
                            <div key={review.id} >
                                <div className="flex p-4 gap-4">
                                    <Avatar className="size-10 border">
                                        <AvatarImage className="object-cover" src={review.user_image} alt={review.fullname} />
                                        <AvatarFallback>{review.fullname.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1 w-full">
                                        <div className="flex gap-4 w-full items-start">
                                            <div className="grid gap-0.5 text-sm">
                                                <h3 className="font-semibold">{review.fullname}</h3>
                                                <time className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(review.created_at)}</time>
                                            </div>
                                            <div className="flex items-center gap-0.5 ml-auto">
                                                {[...Array(5)].map((_, index) => (
                                                    <Star
                                                        key={index}
                                                        className={`w-5 h-5 ${index < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-400 text-gray-400'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-sm leading-loose text-gray-500 dark:text-gray-400">
                                            <p>{review.comment}</p>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                            </div>
                        ))}
                    </Card>
                </>
            ) : null}
        </div>
    )
}

