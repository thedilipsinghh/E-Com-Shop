"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/Toast"

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/products" },
    { label: "New Arrivals", href: "/products?sort=new" },
    { label: "Best Sellers", href: "/products?sort=bestseller" },
    { label: "On Sale", href: "/products?sale=true" },
    { label: "Gift Cards", href: "#" },
  ],
  Support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faqs" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Size Guide", href: "/size-guide" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "/blog" },
    { label: "Sustainability", href: "/sustainability" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Refund Policy", href: "/refund" },
  ],
}

export function Footer() {
  const { showInfo } = useToast()

  const handleSocialClick = (social: string) => {
    showInfo(`${social} page coming soon!`)
  }

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              ECOM<span className="text-primary">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Premium essentials for everyday living. Thoughtfully designed,
              sustainably made, delivered with care.
            </p>
            <div className="mt-6 flex gap-3">
              {["Twitter", "Instagram", "Facebook"].map((social) => (
                <Button 
                  key={social} 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 rounded-full"
                  onClick={() => handleSocialClick(social)}
                  aria-label={social}
                >
                  <span className="text-xs font-medium">{social[0]}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold">{title}</h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href === "#" ? (
                      <button
                        onClick={() => showInfo(`${link.label} page coming soon!`)}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ECOM. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Secure payments</span>
            <div className="flex gap-2">
              {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((method) => (
                <span key={method} className="rounded border border-border px-2 py-1 text-[10px] font-medium text-muted-foreground">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
