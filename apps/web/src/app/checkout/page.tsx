"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/redux/hooks"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Section } from "@/components/Section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGetCartQuery, useClearCartMutation } from "@/redux/apis/cart.api"
import { useGetAddressesQuery } from "@/redux/apis/profile.api"
import { useCreateOrderMutation } from "@/redux/apis/order.api"
import { useToast } from "@/components/Toast"
import { Radio, Truck, CreditCard, MapPin, Check } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const { user } = useAppSelector((state: any) => state.auth || {})
  
  const { data: cartItems = [] } = useGetCartQuery(undefined, { skip: !user })
  const { data: addresses = [] } = useGetAddressesQuery(undefined, { skip: !user })
  const [clearCart] = useClearCartMutation()
  const [createOrder] = useCreateOrderMutation()
  
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod")
  const [isProcessing, setIsProcessing] = useState(false)
  
  const cartItemsArray = Array.isArray(cartItems) ? cartItems : []
  const addressesArray = Array.isArray(addresses) ? addresses : []
  
  useEffect(() => {
    if (addressesArray.length > 0 && selectedAddress === null) {
      const defaultId = addressesArray.find((a: any) => a.isDefault)?.id || addressesArray[0]?.id
      if (defaultId) setSelectedAddress(defaultId)
    }
  }, [addressesArray, selectedAddress])
  
  const subtotal = cartItemsArray.reduce((sum: number, item: any) => 
    sum + (Number(item.price) * item.quantity), 0)
  const tax = subtotal * 0.08
  const shipping = subtotal > 500 ? 0 : 50
  const total = subtotal + tax + shipping

  if (!user) {
    router.push("/auth")
    return null
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showError("Please select a delivery address")
      return
    }
    
    if (cartItemsArray.length === 0) {
      showError("Your cart is empty")
      return
    }

    const addr = addressesArray.find((a: any) => a.id === selectedAddress)
    if (!addr) {
      showError("Selected address is invalid")
      return
    }

    const addressString = `${addr.fullName}, ${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}, ${addr.city}, ${addr.state} - ${addr.postalCode}. Phone: ${addr.phone}`
    
    setIsProcessing(true)
    
    try {
      await createOrder({
        userId: Number(user.id),
        shippingAddress: addressString,
        billingAddress: addressString,
        paymentMethod: paymentMethod === "cod" ? "COD" : "Online"
      }).unwrap()
      
      await clearCart().unwrap()
      
      showSuccess("Order placed successfully!")
      router.push("/account?tab=orders")
    } catch (error: any) {
      showError(error.data?.message || "Failed to place order")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-10rem)] bg-muted/30 py-8">
        <Section>
          <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
          
          {cartItemsArray.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
              <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Column - Address & Payment */}
              <div className="lg:col-span-2 space-y-6">
                {/* Delivery Address */}
                <div className="rounded-xl border bg-background p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5" /> Delivery Address
                  </h2>
                  
                  {addressesArray.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-4">No address saved</p>
                      <Button variant="outline" onClick={() => router.push("/account?tab=address")}>
                        Add Address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addressesArray.map((addr: any) => (
                        <label
                          key={addr.id}
                          className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedAddress === addr.id
                              ? "border-primary bg-primary/5"
                              : "hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddress === addr.id}
                            onChange={() => setSelectedAddress(addr.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{addr.label || "Address"}</p>
                            <p className="text-sm text-muted-foreground">{addr.fullName}</p>
                            <p className="text-sm text-muted-foreground">{addr.addressLine1}</p>
                            <p className="text-sm text-muted-foreground">
                              {addr.city}, {addr.state} {addr.postalCode}
                            </p>
                            <p className="text-sm text-muted-foreground">{addr.phone}</p>
                            {addr.isDefault && (
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded mt-2 inline-block">
                                Default
                              </span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Payment Method */}
                <div className="rounded-xl border bg-background p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" /> Payment Method
                  </h2>
                  
                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        paymentMethod === "cod" 
                          ? "border-primary bg-primary/5" 
                          : "hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                      />
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                      </div>
                    </label>
                    
                    <label
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors opacity-50 ${
                        paymentMethod === "online" 
                          ? "border-primary bg-primary/5" 
                          : "hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        disabled
                      />
                      <div>
                        <p className="font-medium">Online Payment</p>
                        <p className="text-sm text-muted-foreground">Coming soon</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Order Summary */}
              <div>
                <div className="rounded-xl border bg-background p-6 sticky top-24">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  
                  {/* Items Preview */}
                  <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                    {cartItemsArray.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-12 h-12 rounded bg-muted overflow-hidden">
                          {item.product?.imageUrl && (
                            <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{item.product?.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">₹{Number(item.price) * item.quantity}</p>
                      </div>
                    ))}
                    {cartItemsArray.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{cartItemsArray.length - 3} more items
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? <span className="text-green-500">Free</span> : `₹${shipping}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6" 
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || !selectedAddress}
                  >
                    {isProcessing ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Processing...
                      </>
                    ) : (
                      <>Place Order (₹{total.toFixed(2)})</>
                    )}
                  </Button>
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