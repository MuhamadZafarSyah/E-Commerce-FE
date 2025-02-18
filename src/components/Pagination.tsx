import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"

export function Pagination({ meta }: { meta: any }) {
    const router = useRouter()
    const { query } = router
    const currentPage = Number(query.page) || 1

    const handlePageChange = (page: number) => {
        router.push({
            pathname: router.pathname,
            query: { ...query, page }
        })
    }

    return (
        <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-muted-foreground">
                Showing {meta?.per_page} of {meta?.per_page} products
            </div>
            <div className="flex gap-2">
                {Array.from({ length: meta?.last_page || 0 }).map((_, index) => {
                    const page = index + 1
                    const isCurrent = page === currentPage
                    return (
                        <Button
                            key={page}
                            variant={isCurrent ? "default" : "outline"}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}