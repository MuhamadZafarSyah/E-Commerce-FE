import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/router"
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { CategoryType } from "@/types/category.type"

export function SearchFilters({ categories }: { categories: CategoryType[] }) {
    const router = useRouter()
    const { query } = router

    const [localCategory, setLocalCategory] = useState(query.category?.toString() || '')
    const [localMinPrice, setLocalMinPrice] = useState(query.min_price?.toString() || '')
    const [localMaxPrice, setLocalMaxPrice] = useState(query.max_price?.toString() || '')
    const [localSort, setLocalSort] = useState(query.sort?.toString() || 'created_at:desc')
    const [localSearch, setLocalSearch] = useState(query.q?.toString() || '')

    useEffect(() => {
        setLocalCategory(query.category?.toString() || '')
        setLocalMinPrice(query.min_price?.toString() || '')
        setLocalMaxPrice(query.max_price?.toString() || '')
        setLocalSort(query.sort?.toString() || 'created_at:desc')
        setLocalSearch(query.q?.toString() || '')
    }, [query])

    const handleApplyFilters = () => {
        const newQuery: any = {}

        if (localSearch) newQuery.q = localSearch
        if (localCategory) newQuery.category = localCategory
        if (localMinPrice) newQuery.min_price = localMinPrice
        if (localMaxPrice) newQuery.max_price = localMaxPrice
        if (localSort) newQuery.sort = localSort

        newQuery.page = 1

        router.push({
            pathname: router.pathname,
            query: newQuery
        })
    }
    const handlePriceChange = (value: string, type: 'min' | 'max') => {
        const cleanValue = value.replace(/[^\d-]/g, '').replace(/-+/g, '-');

        const numValue = parseInt(cleanValue.replace(/-/g, ''), 10);
        if (isNaN(numValue)) return;

        if (type === 'min') {
            setLocalMinPrice(cleanValue);
        } else {
            setLocalMaxPrice(cleanValue);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleApplyFilters()
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <Label>Search</Label>
                <Input
                    placeholder="Search products..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>

            <div>
                <Label>Category</Label>
                <Select
                    value={localCategory}
                    onValueChange={setLocalCategory}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.slug}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Price Range</Label>
                <div className="flex gap-2 flex-col">
                    <Input
                        placeholder="Min price"
                        type="number"
                        min="0"
                        pattern="[0-9]*"
                        value={localMinPrice}
                        onChange={(e) => handlePriceChange(e.target.value, 'min')}
                    />
                    <Input
                        placeholder="Max price"
                        type="number"
                        min="0"
                        pattern="[0-9]*"
                        value={localMaxPrice}
                        onChange={(e) => handlePriceChange(e.target.value, 'max')}
                    />
                </div>
            </div>

            <div>
                <Label>Sort By</Label>
                <Select
                    value={localSort}
                    onValueChange={setLocalSort}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="price:asc">Price: Low to High</SelectItem>
                        <SelectItem value="price:desc">Price: High to Low</SelectItem>
                        <SelectItem value="created_at:desc">Newest</SelectItem>
                        <SelectItem value="created_at:asc">Oldest</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={handleApplyFilters}
                    className="w-full"
                >
                    Apply Filters
                </Button>

                {(query.q || query.category || query.min_price || query.max_price) && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            router.push(router.pathname)
                            setLocalSearch('')
                            setLocalCategory('')
                            setLocalMinPrice('')
                            setLocalMaxPrice('')
                            setLocalSort('created_at:desc')
                        }}
                        className="flex items-center gap-2"
                    >
                        <X size={16} />
                    </Button>
                )}
            </div>
        </div>
    )
}