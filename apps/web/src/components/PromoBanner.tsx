import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"

export function PromoBanner() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-16 text-center sm:px-12 sm:py-20">
          <div className="relative z-10">
            <Tag className="mx-auto mb-4 h-8 w-8 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight text-background sm:text-3xl lg:text-4xl">
              Summer Sale — Up to 40% Off
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-background/70">
              Limited time offer on selected items. Use code{" "}
              <span className="rounded bg-primary/20 px-2 py-0.5 font-mono text-sm text-primary">
                SUMMER40
              </span>{" "}
              at checkout.
            </p>
            <Button asChild size="lg" className="mt-8 bg-background text-foreground hover:bg-background/90">
              <Link href="/products?sale=true">Shop the Sale</Link>
            </Button>
          </div>

          {/* Decorative dots */}
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
