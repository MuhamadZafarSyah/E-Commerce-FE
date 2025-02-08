import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { ProductType } from "@/types/product.type";
import createInstance from "@/axios/instance";
import Head from "next/head";
import ProductCardSkeleton from "@/components/Skeletons/ProductCardSkeletons";
import Link from "next/link";
import { CategoryType } from "@/types/category.type";
import Footer from "@/components/Footer";


export default function Home() {


  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const response = await createInstance().get("/all-products?take=8");
      const data = response.data;
      return data;
    },
  });


  const { isLoading: LoadingCategory, data: DataCategories, isSuccess: categoriesSuccess } = useQuery({
    queryKey: ["allCategories"],
    queryFn: async () => {
      const response = await createInstance().get("/category");
      const data = response.data.data;

      return data.data;
    },
    refetchOnWindowFocus: false,

  });

  return (
    <>
      <Head>
        <title>Toko Online</title>
      </Head>
      <main>
        <Navbar />
        <div>
          <section className="relative lg:min-h-[1000px] pt-24 pb-10 sm:pt-32 sm:pb-16 lg:pb-24">
            <div className="absolute inset-x-0 bottom-0 z-10  lg:flex">
              <img className="hidden w-full lg:block" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/5/credit-cards.png" alt="" />
              <img className="block w-full lg:hidden" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/5/credit-cards-mobile.png" alt="" />
            </div>

            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-20">
              <div className="max-w-xl mx-auto text-center">
                <h1 className="text-4xl font-bold sm:text-6xl">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700  dark:from-green-300 dark:to-white to-foreground "> Seamless Payment <br /> E-Commerce  </span>
                </h1>
                <p className="mt-5 text-base text-foreground sm:text-xl">Effortless transactions and secure payments for your online shopping experience. Shop smarter, pay seamlessly.</p>

                <Link href="/all-products" title="" className="inline-flex items-center px-6 py-4 mt-8 font-semibold text-foreground transition-all duration-200  dark:bg-muted dark:text-white rounded-lg sm:mt-16 bg-muted" role="button">
                  Start Shopping
                  <svg className="w-6 h-6 ml-8 -mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>

                <div className="grid p-4 bg-gray-400 md:bg-background rounded-md bg-clip-padding md:bg-opacity-100 backdrop-filter backdrop-blur-sm bg-opacity-10 grid-cols-1 px-12 mt-12 text-left gap-x-12 gap-y-8 sm:grid-cols-3 sm:px-0">
                  <div className="flex items-center">
                    <svg className="flex-shrink-0" width="31" height="25" viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M25.1667 14.187H20.3333C17.6637 14.187 15.5 16.3507 15.5 19.0203V19.8258C15.5 19.8258 18.0174 20.6314 22.75 20.6314C27.4826 20.6314 30 19.8258 30 19.8258V19.0203C30 16.3507 27.8363 14.187 25.1667 14.187Z" stroke="#28CC9D" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <p className="ml-3 text-sm text-foreground ">Over 50,000 seamless transactions</p>
                  </div>

                  <div className="flex items-center">
                    <svg className="flex-shrink-0" width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 12.6667L9.25 15L16 8" stroke="#28CC9D" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <p className="ml-3 text-sm text-foreground ">Zero hidden fees, full transparency</p>
                  </div>

                  <div className="flex items-center">
                    <svg className="flex-shrink-0" width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 11H3C1.89543 11 1 11.8954 1 13V21C1 22.1046 1.89543 23 3 23H17C18.1046 23 19 22.1046 19 21V13C19 11.8954 18.1046 11 17 11Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <p className="ml-3 text-sm text-foreground ">Fast & secure online payments</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="max-w-7xl mx-auto">
            <section
              id="categories"
              aria-labelledby="categories-heading"
              className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 md:pt-10 lg:pt-24 sm:pb-28"
            >
              <div className="flex items-end justify-between">
                <div className="flex flex-col space-y-4">
                  <h2 className="max-w-sm text-3xl md:text-5xl text-start text-bg-primary font-bold leading-[1.1]">
                    Featured Categories
                  </h2>
                  <h3 className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                    Discover a wide range of products from our e-commerce platform
                  </h3>
                </div>

              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {LoadingCategory ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="border text-card-foreground shadow-sm relative h-full w-full overflow-hidden rounded-lg bg-transparent transition-colors group hover:bg-primary">
                      <div className="flex flex-col space-y-1.5 p-6">
                        <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-full" />
                      </div>
                      <div className="p-6 pt-0 space-y-1.5">
                        <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
                        <div className="w-16 h-4 bg-gray-200 animate-pulse rounded" />
                      </div>
                    </div>
                  ))
                ) : isSuccess ? (
                  DataCategories?.map((category: CategoryType) => (
                    <a key={category.id} href={`/all-products?category=${category.slug}`}>
                      <div className="border text-card-foreground shadow-sm relative h-full w-full overflow-hidden rounded-lg bg-transparent transition-colors group hover:bg-primary">
                        <div className="flex flex-col space-y-1.5 p-6">

                        </div>
                        <div className="p-6 pt-0 space-y-1.5">
                          <h3 className="text-2xl font-semibold leading-none tracking-tight capitalize text-bg-primary group-hover:text-white">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-white group-hover:text-white">
                            {category.products} Products
                          </p>
                        </div>
                      </div>
                    </a>
                  ))

                ) : null}
              </div>
            </section>
            <section
              id="products"
              aria-labelledby="product-heading"
              className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 md:pt-10 lg:pt-24"
            >
              <div className="flex items-end justify-between">
                <div className="flex flex-col space-y-4">
                  <h2 className="text-3xl md:text-5xl text-start text-bg-primary font-bold leading-[1.1]">
                    Popular Products
                  </h2>
                  <h3 className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                    Explore all products we offer from around the world
                  </h3>
                </div>
                <Link
                  href="/all-products"
                  className="hidden md:flex gap-1 text-bg-primary hover:translate-x-1 hover:text-bg-primary transition-all"
                >
                  Shop the collection{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-right"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4  gap-4  ">
                {isSuccess ? (
                  data?.data.map((product: ProductType) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      slug={product.slug}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      category={product.category.name} // Pastikan ini string
                      stock={product.stock}
                    />
                  ))
                ) : isLoading ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))
                ) : null}
              </div>
              <Link
                className="items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 before:ease relative overflow-hidden text-foreground transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-1000 duration-700 h-10 px-4 py-2 mx-auto bg-primary flex w-fit hover:before:-translate-x-48"
                href="/all-products"
              >
                View all products
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </section>
          </div>
        </div>
        <Footer />
      </main>
    </>
  )
}
