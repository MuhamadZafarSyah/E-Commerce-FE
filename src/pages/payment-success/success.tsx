import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { CheckCircle, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"

const Confetti = dynamic(() => import("react-confetti"), {
    ssr: false,
})
const PaymentSuccess = () => {
    const router = useRouter();
    const { session_id } = router.query;

    const [showConfetti, setShowConfetti] = useState(false)
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        handleResize()
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    useEffect(() => {
        if (session_id) {
            // Lakukan sesuatu dengan session_id, seperti memverifikasi status pembayaran
            setShowConfetti(true)

            // Delay hiding confetti to ensure window size is set
            const hideTimer = setTimeout(() => {
                setShowConfetti(false)
            }, 5000)

            return () => {
                clearTimeout(hideTimer)
            }
        }
    }, [session_id]);

    if (!session_id) {
        return <p>Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
            {showConfetti && (
                <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />
            )}
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-fade-in-up">
                <div className="animate-scale-in">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4 animate-fade-in-up delay-200">Payment Successful!</h1>
                <p className="text-gray-600 mb-8 animate-fade-in-up delay-300">
                    Thank you for your purchase. Your order is being processed and will be shipped soon.
                </p>
                <div className="animate-fade-in-up delay-400">
                    <Link
                        href="/all-products"
                        className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <ShoppingBag className="mr-2" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    )
};

export default PaymentSuccess;

