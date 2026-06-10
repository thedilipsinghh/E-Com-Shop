"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { categories } from "@/lib/data"
import { cn } from "@/lib/utils"

export function CategoryGrid() {
  return (
    <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:gap-6" style={{ minWidth: "max-content" }}>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group relative overflow-hidden rounded-2xl block"
          >
            <div className="aspect-[4/5] w-[160px] sm:w-full overflow-hidden bg-muted">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
              <span className="text-sm font-semibold text-background">{category.name}</span>
              <ChevronRight className="h-4 w-4 text-background opacity-0 transition-all duration-300 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
