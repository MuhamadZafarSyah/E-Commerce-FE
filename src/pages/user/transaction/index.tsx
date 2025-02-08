import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import TransactionHistory from "@/components/transaction-history";
import Head from "next/head";

export default function TransactionsPage() {
    return (
        <>
            <Head>
                <title>Transaction History</title>
            </Head>
            <main>
                <Navbar />
                <div className="max-w-6xl  min-h-screen  container mx-auto py-10 px-4">
                    <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
                    <TransactionHistory />
                </div>
                <Footer />
            </main>

        </>
    )
}

