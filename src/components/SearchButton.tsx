/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { Search } from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import createInstance from "@/axios/instance";

const SearchButton = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const [debounced] = useDebouncedValue(query, 300);
    const [products, setProducts] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await createInstance().get("/products");
            const data = response.data?.data?.data || [];
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open && products.length === 0) {
            fetchProducts();
        }
    }, [open, fetchProducts, products.length]);

    const normalizeText = (text: string): string[] => {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 0);
    };

    const calculateRelevanceScore = (searchTokens: string[], targetTokens: string[]): number => {
        let score = 0;
        const matchedTokens = new Set<string>();

        searchTokens.forEach(searchToken => {
            targetTokens.forEach(targetToken => {
                // Exact match
                if (searchToken === targetToken && !matchedTokens.has(targetToken)) {
                    score += 2;
                    matchedTokens.add(targetToken);
                }
                // Partial match
                else if (targetToken.includes(searchToken) && !matchedTokens.has(targetToken)) {
                    score += 1;
                    matchedTokens.add(targetToken);
                }
            });
        });

        if (matchedTokens.size === searchTokens.length) {
            score += 3;
        }

        return score;
    };

    useEffect(() => {
        if (!debounced) {
            setFilteredData([]);
            return;
        }

        if (products.length > 0) {
            const searchTokens = normalizeText(debounced);

            const searchResults = products
                .map(product => {
                    const productTokens = normalizeText(
                        `${product.name} ${product.category} ${product.attributes}`
                    );

                    const score = calculateRelevanceScore(searchTokens, productTokens);

                    return {
                        product,
                        score
                    };
                })
                .filter(result => result.score > 0)
                .sort((a, b) => b.score - a.score)
                .map(result => result.product);

            setFilteredData(searchResults);
        }
    }, [debounced, products]);

    useEffect(() => {
        if (!open) {
            setQuery("");
            setFilteredData([]);
        }
    }, [open]);

    const handleSelect = useCallback((callback: () => unknown) => {
        setOpen(false);
        callback();
    }, []);

    return (
        <>
            <Button
                onClick={(e) => {
                    e.preventDefault();
                    setOpen((prev) => !prev);
                }}
                variant="outline"
                className="relative p-0 h-10 w-full xl:w-60 justify-start px-3 py-2"
            >
                <Search className="h-4 w-4 xl:mr-2" aria-hidden="true" />
                <span className="xl:inline-flex">Search products...</span>
                <span className="sr-only">Search products</span>
                <span className="pointer-events-none absolute right-2 top-2 hidden h-6 select-none items-center gap-1 rounded-full border bg-muted px-1.5 text-xs font-medium opacity-100 xl:flex">
                    <span title="Control" className="no-underline">
                        Ctrl
                    </span>
                    K
                </span>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    value={query}
                    onValueChange={setQuery}
                    placeholder="Search products by name or category..."
                />
                <CommandList>
                    {loading ? (
                        <Skeleton className="h-8 w-full rounded-sm" />
                    ) : (
                        <>
                            <CommandEmpty
                                className={cn(
                                    filteredData.length === 0 ? "py-6 text-center text-sm" : "hidden"
                                )}
                            >
                                No products found.
                            </CommandEmpty>
                            {filteredData.length > 0 && (
                                <CommandGroup heading="Products">
                                    {filteredData.map((product) => (
                                        <CommandItem
                                            key={product.id}
                                            className="cursor-pointer"
                                            value={`${product.name} - ${product.category} - ${product.attributes}`}
                                            onSelect={() =>
                                                handleSelect(() =>
                                                    router.push(
                                                        `/detail-product/${product.slug}`
                                                    )
                                                )
                                            }
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-xs truncate">
                                                    {product.category}
                                                </span>
                                                <span className="font-medium truncate">
                                                    {product.name.length > (window.innerWidth > 1024 ? 64 : 40) ? (
                                                        `${product.name.slice(0, window.innerWidth > 1024 ? 64 : 40)}...`
                                                    ) : (
                                                        product.name
                                                    )}
                                                </span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
};

export default SearchButton;