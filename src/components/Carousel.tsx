"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import Autoplay from "embla-carousel-autoplay"

const banners = [
    {
        title: "Summer Sale",
        description: "Get up to 50% off on selected items",
        bgColor: "from-purple-500 to-pink-500",
    },
    {
        title: "New Arrivals",
        description: "Check out our latest collection",
        bgColor: "from-blue-500 to-teal-500",
    },
    {
        title: "Free Shipping",
        description: "On orders over $100",
        bgColor: "from-orange-500 to-red-500",
    },
]

export function BannerCarousel() {
    const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {banners.map((banner, index) => (
                    <CarouselItem key={index}>
                        <div
                            className={`h-[500px] w-full bg-gradient-to-r ${banner.bgColor} flex items-center justify-center text-white`}
                        >
                            <Card className="bg-transparent border-none shadow-none">
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <h2 className="text-4xl font-bold mb-4">{banner.title}</h2>
                                    <p className="text-xl mb-8">{banner.description}</p>
                                    <Button size="lg" variant="secondary">
                                        Shop Now
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}

