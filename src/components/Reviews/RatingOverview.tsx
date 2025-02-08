import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { OverviewType } from "@/types/product.type";

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
    const percentage = (count / total) * 100;

    return (
        <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 w-8">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{stars}</span>
            </div>
            <div className="flex-1 h-2 bg-gray-200  rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${stars === 5 ? "bg-emerald-500 text-red-800" : "bg-emerald-400"}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="text-muted-foreground w-12">({count})</span>
        </div>
    );
}

export default function RatingOverview({ overview }: { overview: OverviewType }) {
    // Transform rating_distribution into array format needed by the component
    const distribution = overview.rating_distribution
        ? Object.entries(overview.rating_distribution)
            .map(([key, value]) => ({
                stars: parseInt(key),
                count: value.count
            }))
            .sort((a, b) => b.stars - a.stars)
        : [];

    const totalRatings = distribution.reduce((sum, item) => sum + item.count, 0);



    return (
        <div className="px-2">
            <Card className="max-w-2xl mx-auto">
                {overview.avg_rating ? (
                    <CardContent className="p-6 bg-muted/20">
                        <h2 className="text-xl font-bold mb-6 uppercase">buyer reviews</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <div className="flex items-baseline gap-2">
                                    <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                                    <span className="text-4xl font-bold">
                                        {Number(overview.avg_rating).toFixed(1)}
                                    </span>
                                    <span className="text-lg text-muted-foreground">/ 5.0</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {totalRatings} rating • {overview.total_reviews} ulasan
                                </p>
                            </div>


                            {/* Right column - Rating distribution */}
                            <div className="space-y-3">
                                {distribution.map(({ stars, count }) => (
                                    <RatingBar
                                        key={stars}
                                        stars={stars}
                                        count={count}
                                        total={totalRatings}
                                    />
                                ))}
                            </div>
                        </div>
                    </CardContent>
                ) : (
                    <CardContent className="p-6 md:h-36 flex bg-muted/40 justify-center items-center flex-col">
                        <div className="text-center md:text-lg text-base font-bold mb-2">There are no reviews for this product yet</div>
                        <div className="text-center md:text-base text-xs text-muted-foreground">Buy this product and be the first to leave a review</div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}