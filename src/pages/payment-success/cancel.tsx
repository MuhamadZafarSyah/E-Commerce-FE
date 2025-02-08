import { ShoppingBag, XCircle } from "lucide-react"
import Link from "next/link"

const PaymentCancel = () => {

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4">

            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-fade-in-up">
                <div className="animate-scale-in">
                    <XCircle className="w-20 h-20 text-orange-500 mx-auto mb-6" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4 animate-fade-in-up delay-200">Pembayaran Gagal!</h1>
                <p className="text-gray-600 mb-8 animate-fade-in-up delay-300">
                    Pembayaran Anda tidak berhasil. Silakan coba lagi atau hubungi dukungan pelanggan.
                </p>
                <div className="animate-fade-in-up delay-400">
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <ShoppingBag className="mr-2" />
                        Lanjutkan Belanja
                    </Link>
                </div>
            </div>
        </div>
    )
};

export default PaymentCancel;

