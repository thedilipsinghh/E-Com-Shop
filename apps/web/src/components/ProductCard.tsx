import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Star, Heart, ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/Toast"
import { useAppSelector } from "@/redux/hooks"
import { useAddToCartMutation } from "@/redux/apis/cart.api"
import type { ProductType } from "@repo/types"

export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  imageUrl?: string | null
  rating: number
  reviews: number
  isNew?: boolean
  slug?: string
}

function mapApiProductToProduct(apiProduct: ProductType): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    price: Number(apiProduct.price),
    image: apiProduct.imageUrl || "/placeholder.jpg",
    imageUrl: apiProduct.imageUrl,
    rating: 4.5,
    reviews: 0,
    isNew: false,
  }
}

export function ProductCard({ product }: { product: ProductType }) {
  const router = useRouter()
  const { showSuccess, showError, showInfo } = useToast()
  const { user } = useAppSelector((state: any) => state.auth || {})
  const [addToCart, { isLoading }] = useAddToCartMutation()
  const [added, setAdded] = useState(false)
  
  const mappedProduct = mapApiProductToProduct(product)
  const discount = mappedProduct.originalPrice
    ? Math.round(((mappedProduct.originalPrice - mappedProduct.price) / mappedProduct.originalPrice) * 100)
    : 0

  const productUrl = mappedProduct.slug 
    ? `/products/${mappedProduct.slug}` 
    : `/products/${mappedProduct.id}`

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      router.push("/auth")
      return
    }
    
    try {
      await addToCart({
        productId: mappedProduct.id,
        quantity: 1
      }).unwrap()
      setAdded(true)
      showSuccess(`${mappedProduct.name} added to cart!`)
      setTimeout(() => setAdded(false), 2000)
    } catch (error: any) {
      console.error("Add to cart error:", error)
      showError(error.data?.message || "Failed to add to cart")
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:shadow-lg hover:border-primary/20">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={productUrl}>
          <img
            src={mappedProduct.image}
            alt={mappedProduct.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {mappedProduct.isNew && (
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground">
              -{discount}%
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="absolute inset-x-3 bottom-3">
          <Button 
            onClick={handleAddToCart}
            disabled={isLoading}
            size="sm" 
            className="w-full rounded-full"
          >
            {added ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>

        {/* Wishlist */}
        <button
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-all duration-300 hover:bg-background"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            showInfo("Wishlist feature coming soon!")
          }}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <Link href={productUrl} className="block">
          <h3 className="text-sm font-medium leading-tight tracking-tight hover:text-primary transition-colors">
            {mappedProduct.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium">{mappedProduct.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({mappedProduct.reviews})</span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-semibold">₹{mappedProduct.price}</span>
          {mappedProduct.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{mappedProduct.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}