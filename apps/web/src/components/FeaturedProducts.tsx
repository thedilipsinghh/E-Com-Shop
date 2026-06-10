"use client"

import { ProductCard } from "./ProductCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useGetProductsQuery } from "@/redux/apis/product.api"

export function FeaturedProducts() {
  const { data: products, isLoading } = useGetProductsQuery()

  if (isLoading) {
    return (
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Featured Products
              </h2>
              <p className="mt-2 text-muted-foreground">
                Handpicked essentials, loved by our community.
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-border bg-muted aspect-square" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const productList = products || []

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Featured Products
            </h2>
            <p className="mt-2 text-muted-foreground">
              Handpicked essentials, loved by our community.
            </p>
          </div>
          <Button asChild variant="ghost" className="group">
            <Link href="/products">
              View All <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {productList.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
