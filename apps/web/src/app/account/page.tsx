"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Section } from "@/components/Section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { setUser, clearUser } from "@/redux/slices/authSlice"
import { useSignoutMutation } from "@/redux/apis/auth.api"
import { useGetProfileQuery, useUpdateProfileMutation, useUpdateUserMutation, useGetAddressesQuery, useCreateAddressMutation, useDeleteAddressMutation, useSetDefaultAddressMutation } from "@/redux/apis/profile.api"
import { useGetCartQuery, useRemoveFromCartMutation, useClearCartMutation } from "@/redux/apis/cart.api"
import { useGetUserOrdersQuery, useGetOrderItemsQuery, useCancelOrderMutation } from "@/redux/apis/order.api"
import { useToast } from "@/components/Toast"
import { Trash2, MapPin, Plus, Star, User, Package, Heart, Settings, LogOut, ShoppingCart, ChevronRight, ArrowLeft, CheckCircle2, Clock, ShieldAlert, Loader2, Truck } from "lucide-react"

function OrderTrackingStepper({ status }: { status: string }) {
  const steps = [
    { label: "Order Placed", statusKey: "pending", icon: Clock },
    { label: "Dispatched", statusKey: "shipping", icon: Truck },
    { label: "Delivered", statusKey: "delivered", icon: CheckCircle2 }
  ]

  if (status === "cancelled") {
    return (
      <div className="rounded-lg bg-red-50 border border-red-100 p-4 flex items-center gap-3 text-red-700 max-w-xl mx-auto">
        <ShieldAlert className="h-5 w-5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-sm">Order Cancelled</p>
          <p className="text-xs">This order has been cancelled and will not be shipped.</p>
        </div>
      </div>
    )
  }

  const currentStepIndex = steps.findIndex(s => s.statusKey === status)
  const activeIndex = currentStepIndex !== -1 ? currentStepIndex : (status === "processing" ? 0 : 2)

  return (
    <div className="relative flex justify-between items-center max-w-xl mx-auto py-6">
      {/* Line connecting the steps */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2 z-0">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {steps.map((step, idx) => {
        const StepIcon = step.icon
        const isCompleted = idx <= activeIndex
        const isActive = idx === activeIndex
        return (
          <div key={idx} className="relative z-10 flex flex-col items-center gap-1.5 bg-background px-3">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                isCompleted 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "bg-background border-muted text-muted-foreground"
              } ${isActive ? "ring-4 ring-primary/20" : ""}`}
            >
              <StepIcon className="h-5 w-5" />
            </div>
            <span className={`text-xs font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function OrderItemsDetail({ orderId }: { orderId: number }) {
  const { data: items = [], isLoading } = useGetOrderItemsQuery(orderId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item: any) => (
        <div key={item.id} className="flex gap-4 p-3 border rounded-lg bg-muted/20">
          <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
            {item.product?.imageUrl ? (
              <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{item.product?.name || "Product"}</p>
            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-semibold">₹{Number(item.price) * item.quantity}</p>
            <p className="text-xs text-muted-foreground">₹{item.price} each</p>
          </div>
        </div>
      ))}
    </div>
  )
}

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().min(10, "Mobile must be at least 10 digits"),
  phone: z.string().min(10, "Phone must be at least 10 digits").optional(),
})

const addressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Phone is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean().optional(),
})

type UserForm = z.infer<typeof userSchema>
type AddressForm = z.infer<typeof addressSchema>

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: User },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "address", label: "Addresses", icon: MapPin },
  { id: "cart", label: "Cart", icon: ShoppingCart },
  { id: "settings", label: "Account Settings", icon: Settings },
]

function AccountContent() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { showSuccess, showError } = useToast()
  const { user, token } = useAppSelector((state: any) => state.auth || {})
  
  const [signout] = useSignoutMutation()
  const [updateProfile, { isLoading: profileLoading }] = useUpdateProfileMutation()
  const [updateUser, { isLoading: userLoading }] = useUpdateUserMutation()
  const [createAddress, { isLoading: addressLoading }] = useCreateAddressMutation()
  const [deleteAddress] = useDeleteAddressMutation()
  const [setDefaultAddress] = useSetDefaultAddressMutation()
  const [removeFromCart] = useRemoveFromCartMutation()
  const [clearCart] = useClearCartMutation()
  
  const { data: profileData, refetch: refetchProfile } = useGetProfileQuery(undefined, { skip: !user })
  const { data: addresses = [] } = useGetAddressesQuery(undefined, { skip: !user })
  const { data: cartItems = [], refetch: refetchCart } = useGetCartQuery(undefined, { skip: !user })
  const { data: userOrders = [], isLoading: ordersLoading } = useGetUserOrdersQuery(Number(user?.id), { skip: !user })
  const [cancelOrder, { isLoading: cancelOrderLoading }] = useCancelOrderMutation()
  
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setSelectedOrderId(null)
  }

  const searchParams = useSearchParams()

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])
  
  const userForm = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: user?.name || "", mobile: profileData?.profile?.phone || "" },
  })
  
  const addressForm = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "Home",
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isDefault: false,
    },
  })
  
  const cartItemsArray = Array.isArray(cartItems) ? cartItems : []
  const cartTotal = cartItemsArray.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
  const cartCount = cartItemsArray.reduce((sum: number, item: any) => sum + item.quantity, 0)

  if (!user) {
    router.push("/auth")
    return null
  }

  const handleLogout = async () => {
    try { await signout().unwrap() } catch {}
    router.push("/")
  }

  const handleUpdateUser = async (data: UserForm) => {
    try {
      const result: any = await updateUser({ 
        name: data.name, 
        mobile: data.mobile 
      }).unwrap()
      if (result.success && result.data) {
        dispatch(setUser({ user: result.data, token: token! }))
      }
      showSuccess("Profile updated!")
      refetchProfile()
    } catch (error: any) {
      showError(error.data?.message || "Update failed")
    }
  }

  const handleAddAddress = async (data: AddressForm) => {
    try {
      await createAddress({ ...data, country: data.country || "India" }).unwrap()
      showSuccess("Address added!")
      setShowAddressForm(false)
      addressForm.reset()
      refetchProfile()
    } catch (error: any) {
      showError(error.data?.message || "Failed to add address")
    }
  }

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Delete this address?")) return
    try {
      await deleteAddress(id).unwrap()
      showSuccess("Address deleted!")
      refetchProfile()
    } catch (error: any) {
      showError(error.data?.message || "Failed to delete")
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultAddress(id).unwrap()
      showSuccess("Default address set!")
      refetchProfile()
    } catch (error: any) {
      showError(error.data?.message || "Failed to set default")
    }
  }

  const handleRemoveFromCart = async (itemId: number) => {
    try {
      await removeFromCart(itemId).unwrap()
      refetchCart()
    } catch (error: any) {
      showError(error.data?.message || "Failed to remove")
    }
  }

  const handleClearCart = async () => {
    if (!confirm("Clear all items from cart?")) return
    try {
      await clearCart().unwrap()
      refetchCart()
      showSuccess("Cart cleared!")
    } catch (error: any) {
      showError(error.data?.message || "Failed to clear cart")
    }
  }

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) return
    try {
      await cancelOrder(orderId).unwrap()
      showSuccess("Order cancelled successfully")
    } catch (error: any) {
      showError(error.data?.message || "Failed to cancel order")
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Welcome back, {user?.name}!</h2>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-xl border p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleTabChange("orders")}>
                <Package className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">My Orders</p>
                <p className="text-2xl font-semibold">{userOrders.length}</p>
              </div>
              <div className="rounded-xl border p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleTabChange("wishlist")}>
                <Heart className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-sm text-muted-foreground">Wishlist</p>
                <p className="text-2xl font-semibold">0</p>
              </div>
              <div className="rounded-xl border p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleTabChange("address")}>
                <MapPin className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-sm text-muted-foreground">Addresses</p>
                <p className="text-2xl font-semibold">{addresses.length}</p>
              </div>
              <div className="rounded-xl border p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleTabChange("cart")}>
                <ShoppingCart className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-sm text-muted-foreground">Cart Items</p>
                <p className="text-2xl font-semibold">{cartCount}</p>
              </div>
            </div>
            
            <div className="rounded-xl border p-6">
              <h3 className="font-semibold mb-4">Account Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{profileData?.profile?.phone || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Default Address</p>
                  <p className="font-medium">{profileData?.defaultAddress ? `${profileData.defaultAddress.city}, ${profileData.defaultAddress.state}` : "Not set"}</p>
                </div>
              </div>
            </div>
          </div>
        )
      
      case "orders":
        return (
          <div className="space-y-4">
            {selectedOrderId === null ? (
              <>
                <h2 className="text-xl font-semibold">My Orders</h2>
                {ordersLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="rounded-xl border p-8 text-center">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">You haven't placed any orders yet</p>
                    <p className="text-muted-foreground mb-4">Once you place orders, they will appear here</p>
                    <Button onClick={() => router.push("/products")}>Start Shopping</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order: any) => (
                      <div key={order.id} className="rounded-xl border bg-background p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                            <p className="font-semibold text-sm">#{order.id}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Placed On</p>
                            <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                            <p className="font-semibold text-sm">₹{order.totalAmount}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium uppercase ${
                              order.status === "pending" ? "bg-blue-50 text-blue-700 border-blue-200" :
                              order.status === "shipping" ? "bg-amber-50 text-amber-700 border-amber-200" :
                              order.status === "delivered" ? "bg-green-50 text-green-700 border-green-200" :
                              "bg-red-50 text-red-700 border-red-200"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-md">
                            <span className="font-medium text-foreground">Address:</span> {order.shippingAddress}
                          </p>
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrderId(order.id)}>
                            View details & track
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedOrderId(null)}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to orders
                  </Button>
                </div>
                
                {(() => {
                  const currentOrder = userOrders.find((o: any) => o.id === selectedOrderId)
                  if (!currentOrder) return <p className="text-center py-8">Order not found</p>

                  return (
                    <div className="space-y-6">
                      <div className="rounded-xl border bg-background p-6 space-y-6">
                        <div className="flex justify-between items-start flex-wrap gap-4">
                          <div>
                            <h2 className="text-lg font-bold">Order Details</h2>
                            <p className="text-sm text-muted-foreground">ID: #{currentOrder.id} | Placed on {new Date(currentOrder.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs px-3 py-1 rounded-full border font-semibold uppercase ${
                              currentOrder.status === "pending" ? "bg-blue-50 text-blue-700 border-blue-200" :
                              currentOrder.status === "shipping" ? "bg-amber-50 text-amber-700 border-amber-200" :
                              currentOrder.status === "delivered" ? "bg-green-50 text-green-700 border-green-200" :
                              "bg-red-50 text-red-700 border-red-200"
                            }`}>
                              {currentOrder.status}
                            </span>
                            {currentOrder.status === "pending" && (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                disabled={cancelOrderLoading}
                                onClick={() => handleCancelOrder(currentOrder.id)}
                              >
                                {cancelOrderLoading ? "Cancelling..." : "Cancel Order"}
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="border-y py-6 my-4">
                          <p className="text-sm font-semibold mb-4 text-center">Order Tracking Timeline</p>
                          <OrderTrackingStepper status={currentOrder.status} />
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 border-t pt-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Delivery Address</h4>
                            <p className="text-sm">{currentOrder.shippingAddress}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Payment Info</h4>
                            <p className="text-sm"><span className="font-medium">Method:</span> {currentOrder.paymentMethod}</p>
                            <p className="text-sm mt-1">
                              <span className="font-medium">Payment Status:</span>{" "}
                              <span className={`text-xs px-2 py-0.5 rounded border font-medium ${
                                currentOrder.paymentStatus === "paid" ? "bg-green-50 text-green-700 border-green-200" :
                                currentOrder.paymentStatus === "refunded" ? "bg-orange-50 text-orange-700 border-orange-200" :
                                "bg-amber-50 text-amber-700 border-amber-200"
                              }`}>
                                {currentOrder.paymentStatus}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border bg-background p-6">
                        <h3 className="font-semibold text-base mb-4">Items in this order</h3>
                        <OrderItemsDetail orderId={currentOrder.id} />
                        
                        <div className="flex justify-between items-center mt-6 pt-4 border-t font-semibold">
                          <span>Total Amount</span>
                          <span className="text-lg text-primary">₹{currentOrder.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        )
      
      case "wishlist":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">My Wishlist</h2>
            <div className="rounded-xl border p-8 text-center">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Your wishlist is empty</p>
              <p className="text-muted-foreground mb-4">Save items you love to your wishlist</p>
              <Button onClick={() => router.push("/products")}>Explore Products</Button>
            </div>
          </div>
        )
      
      case "address":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Addresses</h2>
              <Button onClick={() => setShowAddressForm(!showAddressForm)}>
                <Plus className="h-4 w-4 mr-2" /> Add Address
              </Button>
            </div>
            
            {showAddressForm && (
              <div className="rounded-xl border p-6">
                <h3 className="font-medium mb-4">Add New Address</h3>
                <form onSubmit={addressForm.handleSubmit(handleAddAddress)} className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Label</label>
                    <Input {...addressForm.register("label")} placeholder="Home, Office, etc." />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Full Name *</label>
                    <Input {...addressForm.register("fullName")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone *</label>
                    <Input {...addressForm.register("phone")} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Address Line 1 *</label>
                    <Input {...addressForm.register("addressLine1")} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Address Line 2</label>
                    <Input {...addressForm.register("addressLine2")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">City *</label>
                    <Input {...addressForm.register("city")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">State *</label>
                    <Input {...addressForm.register("state")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Postal Code *</label>
                    <Input {...addressForm.register("postalCode")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Country *</label>
                    <Input {...addressForm.register("country")} />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input type="checkbox" {...addressForm.register("isDefault")} className="w-4 h-4" />
                    <label className="text-sm">Set as default address</label>
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <Button type="submit" disabled={addressLoading}>
                      {addressLoading ? "Saving..." : "Save Address"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {addresses.length === 0 && !showAddressForm && (
              <p className="text-center text-muted-foreground py-8">No addresses yet. Add one!</p>
            )}
            
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((addr: any) => (
                <div key={addr.id} className={`rounded-xl border p-4 ${addr.isDefault ? "border-primary bg-primary/5" : ""}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{addr.label || "Address"}</span>
                      {addr.isDefault && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Default</span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleSetDefault(addr.id)}>
                        Set
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAddress(addr.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm">{addr.fullName}</p>
                  <p className="text-sm text-muted-foreground">{addr.addressLine1}</p>
                  <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p className="text-sm text-muted-foreground">{addr.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )
      
      case "cart":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Shopping Cart ({cartCount} items)</h2>
              {cartItemsArray.length > 0 && (
                <Button variant="destructive" onClick={handleClearCart}>
                  <Trash2 className="h-4 w-4 mr-2" /> Clear Cart
                </Button>
              )}
            </div>
            
            {cartItemsArray.length === 0 ? (
              <div className="rounded-xl border p-8 text-center">
                <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Your cart is empty</p>
                <p className="text-muted-foreground mb-4">Add items to your cart to see them here</p>
                <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                  {cartItemsArray.map((item: any) => (
                    <div key={item.id} className="rounded-xl border p-4 flex gap-4">
                      <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center">
                        {item.product?.image ? (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.product?.name || "Product"}</p>
                        <p className="text-sm text-muted-foreground">₹{item.price}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveFromCart(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="rounded-xl border p-4 sticky top-4">
                    <h3 className="font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal ({cartCount} items)</span>
                        <span>₹{cartTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>₹{cartTotal}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4">
                      Proceed to Buy
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      
      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Account Settings</h2>
            
            <div className="rounded-xl border p-6">
              <h3 className="font-semibold mb-4">Profile Information</h3>
              <form onSubmit={userForm.handleSubmit(handleUpdateUser)} className="space-y-4 max-w-md">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input {...userForm.register("name")} defaultValue={user?.name} />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input value={user?.email} disabled className="bg-muted" />
                </div>
                <div>
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input {...userForm.register("mobile")} placeholder="Enter mobile number" />
                </div>
                <Button type="submit" disabled={userLoading}>
                  {userLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </div>
            
            <div className="rounded-xl border p-6">
              <h3 className="font-semibold mb-4 text-destructive">Danger Zone</h3>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-10rem)] bg-muted/30 py-8">
        <Section>
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-64 hidden md:block">
              <div className="rounded-xl border bg-background p-4 sticky top-4">
                <div className="flex items-center gap-3 pb-4 mb-4 border-b">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            
            {/* Mobile Menu */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50">
              <div className="flex overflow-x-auto py-2 px-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg min-w-fit ${
                      activeTab === item.id ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-20 md:pb-0">
              {renderContent()}
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <AccountContent />
    </Suspense>
  )
}