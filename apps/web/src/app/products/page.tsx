"use client";

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProductsQuery } from "@/redux/apis/product.api";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpDown, Tag, X } from "lucide-react"

function ProductsContent() {
  const { data: products = [], isLoading, error, refetch } = useGetProductsQuery();
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    const cat = searchParams.get("category")
    if (cat) {
      setSelectedCategory(cat)
    }
    const sort = searchParams.get("sort")
    if (sort === "new") {
      setSortBy("newest")
    } else if (sort === "price-low") {
      setSortBy("price-low")
    } else if (sort === "price-high") {
      setSortBy("price-high")
    }
  }, [searchParams, products])

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setSortBy("newest")
  }

  const categories = ["All", ...Array.from(new Set(products.map((p: any) => p.category)))]

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (product.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return Number(a.price) - Number(b.price)
      }
      if (sortBy === "price-high") {
        return Number(b.price) - Number(a.price)
      }
      return new Date(b.createdAt || b.id).getTime() - new Date(a.createdAt || a.id).getTime()
    })

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-10rem)] pb-24">
          <Section className="px-4">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                All Products
              </h1>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array(8).fill(0).map((_, index) => (
                <Skeleton key={index} className="w-full aspect-square" />
              ))}
            </div>
          </Section>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-10rem)] pb-24">
          <Section className="px-4">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                All Products
              </h1>
            </div>
            
            <div className="text-center py-12">
              <p className="text-destructive">Failed to load products</p>
              <Button 
                variant="outline"
                onClick={() => refetch()}
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          </Section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-10rem)] pb-24 bg-muted/10">
        <Section className="px-4 py-8">
          
          {/* Top Bar with Title and Quick Filter Toggle */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Shop Our Collection
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="lg:hidden flex items-center gap-2"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </Button>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block space-y-6">
              <div className="rounded-xl border bg-background p-6 space-y-6 sticky top-24">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
                  </h3>
                  {(searchQuery || selectedCategory !== "All" || sortBy !== "newest") && (
                    <Button variant="ghost" size="sm" className="text-xs h-auto p-0 hover:text-primary" onClick={handleClearFilters}>
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" /> Category
                  </h4>
                  <div className="space-y-1.5">
                    {categories.map((cat: string) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filters Panel */}
            {showMobileFilters && (
              <div className="lg:hidden rounded-xl border bg-background p-6 space-y-6 animate-in slide-in-from-top duration-200">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
                  </h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowMobileFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Category Selector */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat: string) => (
                      <Button
                        key={cat}
                        variant={selectedCategory === cat ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(cat)}
                        className="rounded-full"
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Sorting options on Mobile */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm bg-background"
                  >
                    <option value="newest">Newest Arrival</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button className="flex-1" onClick={() => setShowMobileFilters(false)}>Apply Filters</Button>
                  <Button variant="outline" onClick={handleClearFilters}>Reset</Button>
                </div>
              </div>
            )}

            {/* Products Search & List Column */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Search and Sort Toolbar */}
              <div className="flex flex-col sm:flex-row gap-4 bg-background p-4 rounded-xl border">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full bg-muted/20 border-muted"
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm bg-background font-medium focus:ring-1 focus:ring-primary cursor-pointer outline-none"
                  >
                    <option value="newest">Sort by: Newest</option>
                    <option value="price-low">Sort by: Price: Low to High</option>
                    <option value="price-high">Sort by: Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Products List Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-background rounded-xl border">
                  <p className="text-muted-foreground text-lg mb-2">No products match your search or filter criteria.</p>
                  <p className="text-muted-foreground text-sm mb-4">Try clearing some filters or searching for something else.</p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}