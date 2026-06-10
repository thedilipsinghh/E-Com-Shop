"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Section } from "@/components/Section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppSelector } from "@/redux/hooks"
import { useSignoutMutation } from "@/redux/apis/auth.api"
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from "@/redux/apis/product.api"
import { useGetOrdersQuery, useUpdateOrderStatusMutation, useUpdatePaymentStatusMutation, useGetOrderItemsQuery } from "@/redux/apis/order.api"
import { useToast } from "@/components/Toast"
import { Plus, Trash2, Edit, Package, ShoppingCart, Users, LogOut, BarChart, Loader2 } from "lucide-react"

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

function AdminOrdersTab() {
  const { data: orders = [], isLoading, refetch } = useGetOrdersQuery()
  const [updateStatus] = useUpdateOrderStatusMutation()
  const [updatePayment] = useUpdatePaymentStatusMutation()
  const { showSuccess, showError } = useToast()

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap()
      showSuccess(`Order status updated to ${newStatus}`)
    } catch (err: any) {
      showError(err.data?.message || "Failed to update status")
    }
  }

  const handlePaymentChange = async (id: number, newPaymentStatus: string) => {
    try {
      await updatePayment({ id, paymentStatus: newPaymentStatus }).unwrap()
      showSuccess(`Payment status updated to ${newPaymentStatus}`)
    } catch (err: any) {
      showError(err.data?.message || "Failed to update payment status")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Orders Management</h2>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Refresh</Button>
      </div>

      <div className="rounded-xl border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium">User ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Payment Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Order Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-semibold">#{order.id}</td>
                  <td className="px-4 py-3 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-xs">User #{order.userId}</td>
                  <td className="px-4 py-3 font-medium">₹{order.totalAmount}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => handlePaymentChange(order.id, e.target.value)}
                      className="text-xs border rounded p-1 bg-background font-medium focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="text-xs border rounded p-1 bg-background font-medium focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipping">Shipping</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedOrderId(selectedOrderId === order.id ? null : order.id)}
                    >
                      {selectedOrderId === order.id ? "Hide Items" : "Show Items"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrderId !== null && (
        <div className="rounded-xl border bg-background p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-semibold">Items in Order #{selectedOrderId}</h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedOrderId(null)}>Close</Button>
          </div>
          {(() => {
            const orderObj = orders.find((o: any) => o.id === selectedOrderId)
            return (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 text-xs bg-muted/30 p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-muted-foreground">Shipping Address</p>
                    <p className="mt-1 font-medium">{orderObj?.shippingAddress}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Billing Address</p>
                    <p className="mt-1 font-medium">{orderObj?.billingAddress}</p>
                    <p className="mt-2"><span className="font-medium text-muted-foreground">Payment Method:</span> {orderObj?.paymentMethod}</p>
                  </div>
                </div>
                <OrderItemsDetail orderId={selectedOrderId} />
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

const productSchema = z.object({
  name: z.string().min(2, "Name required"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Price required"),
  originalPrice: z.coerce.number().optional(),
  category: z.string().min(1, "Category required"),
  imageUrl: z.string().optional(),
  stockQuantity: z.coerce.number().min(0, "Stock required"),
})

interface ProductForm {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl?: string;
  stockQuantity: number;
}

const menuItems = [
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "customers", label: "Customers", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart },
]

export default function AdminPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const { user } = useAppSelector((state: any) => state.auth || {})
  
  const [signout] = useSignoutMutation()
  const [createProduct, { isLoading: createLoading }] = useCreateProductMutation()
  const [updateProduct, { isLoading: updateLoading }] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()
  
  const { data: products = [], refetch } = useGetProductsQuery()
  
  const [activeTab, setActiveTab] = useState("products")
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  
  const productForm = useForm<ProductForm>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      category: "",
      imageUrl: "",
      stockQuantity: 0,
    },
  })

  if (!user || user.role !== "admin") {
    return (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-10rem)]">
          <Section>
            <div className="mx-auto max-w-md py-16 text-center">
              <h2 className="text-xl font-semibold mb-4">Admin Access Only</h2>
              <p className="text-muted-foreground mb-6">You need admin access to view this page</p>
              <Button onClick={() => router.push("/")}>Go Home</Button>
            </div>
          </Section>
        </main>
        <Footer />
      </>
    )
  }

  const handleSubmit = async (data: ProductForm) => {
    try {
      const productData = {
        name: data.name,
        description: data.description || null,
        price: data.price,
        originalPrice: data.originalPrice || null,
        category: data.category,
        imageUrl: data.imageUrl || null,
        stockQuantity: data.stockQuantity,
      }
      
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, ...productData }).unwrap()
        showSuccess("Product updated!")
      } else {
        await createProduct(productData).unwrap()
        showSuccess("Product created!")
      }
      
      setShowProductForm(false)
      setEditingProduct(null)
      productForm.reset()
      refetch()
    } catch (error: any) {
      console.error("Product error:", error)
      showError(error.data?.message || "Operation failed")
    }
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    productForm.reset({
      name: product.name,
      description: product.description || "",
      price: Number(product.price) || 0,
      originalPrice: Number(product.originalPrice) || undefined,
      category: product.category,
      imageUrl: product.imageUrl || "",
      stockQuantity: product.stockQuantity || 0,
    })
    setShowProductForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return
    try {
      await deleteProduct(id).unwrap()
      showSuccess("Product deleted!")
      refetch()
    } catch (error: any) {
      showError(error.data?.message || "Delete failed")
    }
  }

  const handleLogout = async () => {
    try { await signout().unwrap() } catch {}
    router.push("/")
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
                  <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground font-bold">
                    A
                  </div>
                  <div>
                    <p className="font-medium">Admin</p>
                    <p className="text-xs text-muted-foreground">Dashboard</p>
                  </div>
                </div>
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
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
                <div className="border-t mt-4 pt-4">
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              {activeTab === "products" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Manage Products</h2>
                    <Button onClick={() => { setShowProductForm(!showProductForm); setEditingProduct(null); productForm.reset() }}>
                      <Plus className="h-4 w-4 mr-2" /> Add Product
                    </Button>
                  </div>
                  
                  {showProductForm && (
                    <div className="rounded-xl border bg-background p-6">
                      <h3 className="font-semibold mb-4">
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </h3>
                      <form onSubmit={productForm.handleSubmit(handleSubmit)} className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="text-sm font-medium">Product Name</label>
                          <Input {...productForm.register("name")} />
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium">Description</label>
                          <textarea 
                            {...productForm.register("description")} 
                            className="w-full p-2 border rounded-lg"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Price (₹)</label>
                          <Input type="number" {...productForm.register("price")} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Original Price (₹)</label>
                          <Input type="number" {...productForm.register("originalPrice")} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Category</label>
                          <Input {...productForm.register("category")} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Stock Quantity</label>
                          <Input type="number" {...productForm.register("stockQuantity")} />
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium">Image URL</label>
                          <Input {...productForm.register("imageUrl")} placeholder="https://..." />
                        </div>
                        <div className="col-span-2 flex gap-2">
                          <Button type="submit" disabled={createLoading || updateLoading}>
                            {createLoading || updateLoading ? "Saving..." : "Save Product"}
                          </Button>
                          <Button type="button" variant="outline" onClick={() => { setShowProductForm(false); setEditingProduct(null) }}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  <div className="rounded-xl border bg-background overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Stock</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {products.map((product: any) => (
                          <tr key={product.id} className="hover:bg-muted/50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded bg-muted overflow-hidden">
                                  {product.imageUrl && (
                                    <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                                  )}
                                </div>
                                <span className="font-medium">{product.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">{product.category}</td>
                            <td className="px-4 py-3 text-sm">₹{product.price}</td>
                            <td className="px-4 py-3 text-sm">{product.stockQuantity}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex gap-2 justify-end">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {activeTab === "orders" && (
                <AdminOrdersTab />
              )}
              
              {activeTab === "customers" && (
                <div className="rounded-xl border bg-background p-8 text-center">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Customers</h3>
                  <p className="text-muted-foreground">Coming soon</p>
                </div>
              )}
              
              {activeTab === "analytics" && (
                <div className="rounded-xl border bg-background p-8 text-center">
                  <BarChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analytics</h3>
                  <p className="text-muted-foreground">Coming soon</p>
                </div>
              )}
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}