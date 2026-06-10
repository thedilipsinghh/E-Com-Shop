"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/redux/hooks"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Section } from "@/components/Section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useGetCartQuery, useRemoveFromCartMutation, useClearCartMutation, useUpdateCartItemQuantityMutation } from "@/redux/apis/cart.api"
import { useToast } from "@/components/Toast"
import { Trash2, Plus, Minus, ArrowRight, CreditCard, Truck, ShieldCheck } from "lucide-react"

export default function CartPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const { user } = useAppSelector((state: any) => state.auth || {})
  const isAuthenticated = !!user
  
  const { data: cartItems = [], isLoading, refetch } = useGetCartQuery(undefined, { skip: !isAuthenticated })
  const [removeFromCart] = useRemoveFromCartMutation()
  const [clearCart] = useClearCartMutation()
  const [updateQuantity] = useUpdateCartItemQuantityMutation()
  
  const [couponCode, setCouponCode] = useState("")
  
  const cartItemsArray = Array.isArray(cartItems) ? cartItems : []
  
  const subtotal = cartItemsArray.reduce((sum: number, item: any) => {
    const price = item.product?.price ? Number(item.product.price) : 0
    return sum + (price * item.quantity)
  }, 0)
  const tax = subtotal * 0.08
  const shipping = subtotal > 500 ? 0 : 50
  const total = subtotal + tax + shipping
  
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-10rem)]">
          <Section>
            <div className="mx-auto max-w-md py-16 text-center">
              <h2 className="text-xl font-semibold mb-4">Please Login</h2>
              <p className="text-muted-foreground mb-6">Login to view your cart</p>
              <Button onClick={() => router.push("/auth")}>Login</Button>
            </div>
          </Section>
        </main>
        <Footer />
      </>
    )
  }

  const handleQuantityChange = async (itemId: number, currentQty: number, delta: number) => {
    const newQty = currentQty + delta
    if (newQty < 1) return
    try {
      await updateQuantity({ cartItemId: itemId, quantity: newQty }).unwrap()
      refetch()
    } catch (error: any) {
      showError(error.data?.message || "Failed to update")
    }
  }

  const handleRemove = async (itemId: number) => {
    if (!confirm("Remove this item?")) return
    try {
      await removeFromCart(itemId).unwrap()
      refetch()
      showSuccess("Item removed")
    } catch (error: any) {
      showError(error.data?.message || "Failed to remove")
    }
  }

  const handleClear = async () => {
    if (!confirm("Clear all items?")) return
    try {
      await clearCart().unwrap()
      refetch()
      showSuccess("Cart cleared")
    } catch (error: any) {
      showError(error.data?.message || "Failed to clear")
    }
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-10rem)] bg-muted/30 py-8">
        <Section>
          <h1 className="text-2xl font-semibold mb-6">Shopping Cart ({cartItemsArray.length} items)</h1>
          
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : cartItemsArray.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add items to your cart to see them here</p>
              <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-xl border bg-background">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-semibold">Cart Items</h2>
                    <Button variant="ghost" size="sm" onClick={handleClear}>
                      <Trash2 className="h-4 w-4 mr-2" /> Clear All
                    </Button>
                  </div>
                  
                  <div className="divide-y">
                    {cartItemsArray.map((item: any) => (
                      <div key={item.id} className="p-4 flex gap-4">
                        <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          {item.product?.imageUrl ? (
                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-xs text-muted-foreground">No Image</div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product?.name || "Product"}</h3>
                          <p className="text-sm text-muted-foreground">₹{item.product?.price || "0"}</p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <Button variant="ghost" size="sm" onClick={() => handleRemove(item.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">₹{Number(item.product?.price || 0) * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Coupon */}
                <div className="rounded-xl border bg-background p-4">
                  <h3 className="font-medium mb-3">Apply Coupon</h3>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <div className="rounded-xl border bg-background p-6 sticky top-24">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({cartItemsArray.length} items)</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? <span className="text-green-500">Free</span> : `₹${shipping}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-green-500">Add ₹{500 - subtotal} more for free shipping</p>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span>Free shipping on orders above ₹500</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      <span>Multiple payment options</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </>
  )
}