"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Check } from "lucide-react"
import { useToast } from "@/components/Toast"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const { showSuccess } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail("")
      showSuccess("Successfully subscribed to newsletter!")
    }
  }

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Stay in the loop
          </h2>
          <p className="mt-3 text-muted-foreground">
            Get early access to new drops, exclusive offers, and curated picks.
          </p>

          {submitted ? (
            <div className="mt-8 flex items-center justify-center gap-2 text-primary">
              <Check className="h-5 w-5" />
              <span className="text-sm font-medium">You&apos;re subscribed!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 flex-1 rounded-full"
              />
              <Button type="submit" size="lg" className="rounded-full px-6">
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
