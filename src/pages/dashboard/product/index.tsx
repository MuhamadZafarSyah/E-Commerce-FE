import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AdminLayout from "@/components/layouts/admin";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/types/product.type";
import Link from "next/link";
import { Edit, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { toRupiah } from '@/utils/toRupiah';
import createInstance from '@/axios/instance';
import ModalDeleteProduct from '@/components/Product/ProductModal/delete-product-modal';

function AdminProductPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { isLoading, data, isSuccess } = useQuery({
        queryKey: ["allProducts"],
        queryFn: async () => {
            try {
                const response = await createInstance().get("/products");
                return response.data?.data?.data || [];
            } catch (error) {
                return [];
            }
        },
    });

    if (!data) {
        return <p>Loading...</p>;
    }

    const products = Array.isArray(data) ? data : [];

    const filteredProducts = products.filter((product: ProductType) => {
        if (!product) return false;
        return (
            product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);


    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    console.log(data);

    return (
        <AdminLayout className="w-full flex flex-col md:flex-row">
            <div className="flex flex-col space-y-4 mb-4">
                <div className="flex justify-between items-center">
                    <h1>AdminProductPage</h1>
                    <Link href={"/dashboard/product/create"}>
                        <Button >Tambah Produk</Button>
                    </Link>
                </div>
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <ScrollArea className="h-fit w-full md:w-full rounded-md border px-4 pb-5">
                <Table>
                    <TableCaption>Data semua produk.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">No.</TableHead>
                            <TableHead className="w-[200px]">Name</TableHead>
                            <TableHead className="w-[150px]">Price</TableHead>
                            <TableHead className="w-[150px]">Image</TableHead>
                            <TableHead className="w-[150px]">Category</TableHead>
                            <TableHead className="w-[150px]">Stock</TableHead>
                            <TableHead className="w-[150px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : currentProducts.length > 0 ? (
                            currentProducts.map((product: ProductType, index: number) => (
                                <TableRow key={product.id}>
                                    <TableCell>{startIndex + index + 1}</TableCell>
                                    <TableCell>
                                        {product.name?.slice(0, 20) + (product.name?.length > 20 ? "..." : "")}
                                    </TableCell>
                                    <TableCell>{toRupiah(product.price)}</TableCell>
                                    <TableCell>
                                        <img
                                            src={product.image}
                                            className="w-20 h-20 object-contain"
                                            alt={product.name}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {/* 5. Pastikan kategori ditampilkan dengan benar */}
                                        {product.category}
                                    </TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell className="">
                                        <div className="flex justify-end space-x-2">
                                            <ModalDeleteProduct productId={product.id} />
                                            <Link href={`/dashboard/product/edit/${product.id}`}>
                                                <Button
                                                    className="h-9 rounded-md px-3 md:h-10 md:px-4 md:py-2"
                                                    variant="default"
                                                >
                                                    <Edit size={16} />
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    Data tidak ditemukan
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <div className="mt-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious

                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                        {getPageNumbers().map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    onClick={() => setCurrentPage(page)}
                                    isActive={currentPage === page}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </AdminLayout>
    );
}

export default AdminProductPage;