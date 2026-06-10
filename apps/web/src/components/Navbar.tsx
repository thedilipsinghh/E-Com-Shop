"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { useSignoutMutation } from "@/redux/apis/auth.api"
import { useGetCartQuery } from "@/redux/apis/cart.api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, User, Menu, X, LogIn, LogOut } from "lucide-react"
import { fetchCart } from "@/redux/slices/cartSlice"
import { clearUser } from "@/redux/slices/authSlice"
import { useToast } from "@/components/Toast"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/products?category=all", label: "Categories" },
]

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const dispatch = useAppDispatch()
  const { showSuccess } = useToast()
  const { user } = useAppSelector((state: any) => state.auth || {})
  const { items, itemCount } = useAppSelector((state: any) => state.cart || {})
  const isAuthenticated = !!user
  const [signout] = useSignoutMutation()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: apiCartItems = [] } = useGetCartQuery(undefined, { skip: !isAuthenticated })
  const apiCartCount = Array.isArray(apiCartItems) ? apiCartItems.reduce((sum: number, item: any) => sum + item.quantity, 0) : 0
  
  const displayCartCount = isAuthenticated ? apiCartCount : (itemCount || 0)
  
  useEffect(() => {
    if (user) {
      dispatch(fetchCart(user.id.toString()))
    }
  }, [dispatch, user])

  const handleLogout = async () => {
    try {
      await signout().unwrap()
    } catch {}
    dispatch(clearUser())
    showSuccess("Logged out successfully")
    router.push("/")
  }

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              ECOM<span className="text-primary">.</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Search">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </Button>
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            ECOM<span className="text-primary">.</span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  pathname === link.href.split('?')[0] && "text-primary font-semibold"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden sm:inline-flex"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {displayCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    <span className="cart-item-count">{displayCartCount}</span>
                  </span>
                )}
              </Link>
            </Button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.role === "admin" && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin">Admin</Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/account">
                    <User className="mr-1 h-4 w-4" />
                    Account
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-1 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth">
                    <LogIn className="mr-1 h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link href="/auth">
                    <User className="mr-1 h-4 w-4" />
                    Register
                  </Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-border pb-4 pt-3 animate-in slide-in-from-top duration-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search products..." className="pl-10" autoFocus />
            </div>
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="border-t border-border md:hidden animate-in slide-in-from-top duration-200">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border pt-3 mt-3 flex gap-2">
              <Button variant="ghost" size="sm" asChild className="flex-1">
                <Link href="/cart" onClick={() => setMobileOpen(false)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />Cart
                </Link>
              </Button>
            </div>
            <div className="flex gap-2">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" size="sm" asChild className="flex-1">
                    <Link href="/account" onClick={() => setMobileOpen(false)}>
                      <User className="mr-2 h-4 w-4" />Account
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={async () => {
                    setMobileOpen(false)
                    try { await signout().unwrap() } catch {}
                    dispatch(clearUser())
                    showSuccess("Logged out successfully")
                    router.push("/")
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href="/auth" onClick={() => setMobileOpen(false)}>
                      <LogIn className="mr-2 h-4 w-4" />Login
                    </Link>
                  </Button>
                  <Button variant="default" size="sm" asChild className="flex-1">
                    <Link href="/auth" onClick={() => setMobileOpen(false)}>
                      <User className="mr-2 h-4 w-4" />Register
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}