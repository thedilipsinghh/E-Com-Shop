import * as React from "react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  children: ReactNode
  className?: string
  as?: React.ElementType
}

export function Section({ children, className, as: Tag = "section" }: SectionProps) {
  const Component = Tag;
  return (
    <Component className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </Component>
  )
}
