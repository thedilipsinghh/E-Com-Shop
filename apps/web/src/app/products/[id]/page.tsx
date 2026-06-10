"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/redux/hooks";
import { setLoading, setError } from "@/redux/slices/productSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import { useAppSelector } from "@/redux/hooks";
import type { ProductType, User } from "@repo/types";
import type { RootState } from "@/redux/store";

type ApiProductResponse = {
  success: boolean;
  message?: string;
  data?: ProductType;
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoadingState] = useState(true);
  const [error, setErrorState] = useState<string | null>(null);
  const { user } = useAppSelector((state: RootState) => state.auth) as { user: User | null };

  // Fetch product from API
  const fetchProduct = async () => {
    try {
      dispatch(setLoading(true));
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json() as ApiProductResponse;
      if (data.success && data.data) {
        setProduct(data.data);
        setLoadingState(false);
        dispatch(setLoading(false));
      } else {
        throw new Error(data.message || "Failed to fetch product");
      }
    } catch (err: unknown) {
      console.error("Error fetching product:", err);
      const message = err instanceof Error ? err.message : "Failed to fetch product";
      setErrorState(message);
      dispatch(setError(message));
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [params.id, dispatch]);

  // Handle adding to cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      // Redirect to login or show login modal
      alert("Please log in to add items to cart");
      return;
    }

    if (!product) return;

    try {
      // Dispatch add to cart action
      dispatch(addToCart({
        productId: product.id,
        quantity: 1
      }));
      
      alert("Product added to cart!");
    } catch (err: unknown) {
      console.error("Error adding to cart:", err);
      alert("Failed to add product to cart");
    }
  };

  if (loading && !product) {
    return (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-10rem)] pb-24">
          <Section className="px-4">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Product Details
              </h1>
            </div>
            
            <div className="grid gap-6">
              <div className="w-full h-96">
                <Skeleton className="w-full h-96" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Button className="w-full h-12" disabled>
                  <Skeleton className="h-4 w-24" />
                </Button>
              </div>
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
                Product Details
              </h1>
            </div>
            
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
              <Button 
                variant="outline"
                onClick={() => window.history.back()}
                className="mt-4"
              >
                Go Back
              </Button>
            </div>
          </Section>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-10rem)] pb-24">
          <Section className="px-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Product not found</p>
              <Button 
                variant="outline"
                onClick={() => window.history.back()}
                className="mt-4"
              >
                Go Back
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
      <main className="min-h-[calc(100vh-10rem)] pb-24">
        <Section className="px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {product.name}
            </h1>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-[1fr_1fr]">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={product.imageUrl || '/placeholder.svg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Thumbnails (if we had more images) */}
              <div className="flex gap-4">
                {[1, 2, 3].map((index) => (
                  <Image
                    key={index}
                    src="/placeholder.svg"
                    alt={`Product ${index}`}
                    width={80}
                    height={80}
                    className="object-cover rounded border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                  />
                ))}
              </div>
            </div>
            
            {/* Product Details */}
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-muted-foreground tracking-wider text-sm">
                  {product.category}
                </p>
                <h2 className="text-3xl font-bold tracking-tight">
                  ${product.price.toFixed(2)}
                </h2>
                
                {product.brand && (
                  <div className="flex items-baseline gap-3 mt-2">
                    <p className="text-xs text-muted-foreground">Brand:</p>
                    <p className="text-xs font-medium">{product.brand}</p>
                  </div>
                )}
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <p className="text-lg font-medium">Description</p>
                <p className="text-muted-foreground">
                  {product.description || "No description available."}
                </p>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex items-baseline gap-3">
                <p className="text-xs text-muted-foreground">Stock:</p>
                <Badge 
                  variant={product.stockQuantity > 0 ? "default" : "destructive"}
                >
                  {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : "Out of Stock"}
                </Badge>
              </div>
              
              <Button 
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0 || !user}
                className="w-full h-12 mt-4"
              >
                {product.stockQuantity <= 0 ? "Out of Stock" : 
                 !user ? "Login to Buy" : 
                 "Add to Cart"}
              </Button>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          {/* Related Products Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">You May Also Like</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* In a real app, we would fetch related products based on category */}
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <Image
                    src="/placeholder.svg"
                    alt={`Related Product ${index}`}
                    width={320}
                    height={192}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="font-semibold">Related Product {index}</h3>
                  <p className="text-muted-foreground mt-2">$${(index + 1) * 10}.99</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
