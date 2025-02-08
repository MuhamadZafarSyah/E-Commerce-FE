import { Button } from "@/components/ui/button"

export function Banner() {
    return (
        <div className="relative h-[500px] bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 text-center">
                <h1 className="text-5xl font-bold mb-4">Summer Sale</h1>
                <p className="text-xl mb-8">Get up to 50% off on selected items</p>
                <Button size="lg" variant="secondary">
                    Shop Now
                </Button>
            </div>
        </div>
    )
}

