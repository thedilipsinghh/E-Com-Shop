import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f5f1ea] text-zinc-900">

      {/* background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-white opacity-70 blur-3xl" />
        <div className="absolute right-0 top-20 h-[400px] w-[400px] rounded-full bg-[#e7dfd4] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-white/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* LEFT CONTENT */}
          <div>
            <span className="mb-6 inline-flex items-center rounded-full border border-zinc-300 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-600 backdrop-blur">
              Modern Collection 2026
            </span>

            <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Wear what
              <br />
              feels
              <span className="relative ml-3 inline-block italic text-[#8f6d52]">
                effortless

                <svg
                  className="absolute -bottom-3 left-0 w-full"
                  viewBox="0 0 200 20"
                  fill="none"
                >
                  <path
                    d="M3 15C40 3 90 3 197 12"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-relaxed text-zinc-600">
              Elevated essentials designed with minimal aesthetics,
              premium comfort, and timeless silhouettes that never
              chase trends.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                className="h-14 rounded-full bg-zinc-900 px-8 text-sm font-medium text-white hover:bg-zinc-800"
              >
                <Link href="/products">
                  Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-14 rounded-full border-zinc-300 bg-white/70 px-8 text-sm font-medium text-zinc-900 backdrop-blur hover:bg-white"
              >
                <Link href="/products">
                  View Catalog
                </Link>
              </Button>
            </div>

            {/* metrics */}
            <div className="mt-14 flex flex-wrap gap-10">
              <div>
                <h3 className="text-3xl font-semibold">50K+</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Trusted Customers
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-semibold">4.9★</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Average Reviews
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-semibold">Free</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Global Shipping
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative flex items-center justify-center lg:justify-end">

            {/* decorative background */}
            <div className="absolute h-[360px] w-[360px] rounded-full bg-[#e7ddd1] blur-3xl opacity-70" />

            {/* main showcase */}
            <div className="relative w-[320px]">

              {/* top floating tag */}
              <div className="absolute -left-8 top-10 z-30 rounded-full border border-black/5 bg-white/80 px-4 py-2 backdrop-blur-xl shadow-lg">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
                  Premium Quality
                </p>
              </div>

              {/* image frame */}
              <div className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white/50 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl">

                {/* glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/[0.03]" />

                {/* image */}
                <div className="relative overflow-hidden rounded-[2rem]">
                  <img
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop"
                    alt="fashion"
                    className="h-[460px] w-full object-cover transition duration-700 hover:scale-[1.03]"
                  />

                  {/* shadow fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                {/* bottom content */}
                <div className="absolute bottom-6 left-6 right-6 z-20 rounded-2xl border border-white/40 bg-white/75 p-4 backdrop-blur-xl shadow-lg">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                        Signature Edition
                      </p>

                      <h4 className="mt-1 text-lg font-semibold text-zinc-900">
                        Modern Minimal Wear
                      </h4>

                      <p className="mt-1 text-sm text-zinc-500">
                        Timeless comfort & clean silhouettes
                      </p>
                    </div>

                    <div className="rounded-full bg-zinc-900 px-3 py-2 text-xs font-medium text-white shadow">
                      New
                    </div>
                  </div>
                </div>
              </div>

              {/* floating mini card */}
              <div className="absolute -bottom-5 -right-6 rounded-2xl border border-white/50 bg-white/80 px-5 py-4 shadow-2xl backdrop-blur-xl">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Customer Rating
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-semibold text-zinc-900">
                    4.9★
                  </span>

                  <span className="text-sm text-zinc-500">
                    12k Reviews
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}