"use client"

import { useRef } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { categories } from "@/lib/data"

export function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const allCategories = [...categories, ...categories, ...categories]

  return (
    <div className="group relative w-full overflow-hidden">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden pb-4 scrollbar-hide"
        style={{
          scrollBehavior: "smooth",
        }}
      >
        {allCategories.map((category, index) => (
          <Link
            key={`${category.id}-${index}`}
            href={`/products?category=${encodeURIComponent(category.name)}`}
            className="group/card relative shrink-0 w-[180px] sm:w-[220px] lg:w-[260px] overflow-hidden rounded-2xl"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                loading={index < 3 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                  <p className="mt-1 text-xs text-white/70">Shop now</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-all duration-300 group-hover/card:bg-white group-hover/card:text-black">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
          </Link>
        ))}
      </div>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden group-hover:block">
        <button
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
            }
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl ring-1 ring-black/5 hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="h-6 w-6 rotate-180" />
        </button>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden group-hover:block">
        <button
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
            }
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl ring-1 ring-black/5 hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}