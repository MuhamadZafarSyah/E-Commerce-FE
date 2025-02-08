import { Skeleton } from '../ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { AspectRatio } from '../ui/aspect-ratio'

const ProductCardSkeleton = () => {
    return (
        <Card className='h-full overflow-hidden rounded-2xl flex flex-col justify-between'>
            <CardHeader className='p-0'>
                <AspectRatio ratio={1 / 1} className='m-3'>
                    <div className='absolute rounded-2xl inset-0 bg-gradient-to-t from-transparent to-zinc-950/50' />
                    <Skeleton className='w-full h-full rounded-2xl' />
                </AspectRatio>
            </CardHeader>
            <CardContent className='grid gap-2.5 p-4'>
                <Skeleton className='h-6 w-52' />
                <Skeleton className='h-6 w-1/2' />
            </CardContent>
            <CardFooter className='p-4 flex justify-between gap-4 items-center'>
                <Skeleton className='h-8 w-12' />
                <Skeleton className='h-8 w-full' />
            </CardFooter>
        </Card>
    )
}

export default ProductCardSkeleton
