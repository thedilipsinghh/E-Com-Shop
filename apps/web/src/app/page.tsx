import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { CategoryCarousel } from "@/components/CategoryCarousel"
import { FeaturedProducts } from "@/components/FeaturedProducts"
import { PromoBanner } from "@/components/PromoBanner"
import { Testimonials } from "@/components/Testimonials"
import { Newsletter } from "@/components/Newsletter"
import { Footer } from "@/components/Footer"
import { Section } from "@/components/Section"
import { NewArrivals } from "@/components/NewArrivals"
import { BestSellers } from "@/components/BestSellers"

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        {/* Categories */}
        <Section>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Shop by Category
            </h2>
            <p className="mt-2 text-muted-foreground">
              Explore our curated collections
            </p>
          </div>
          <CategoryCarousel />
        </Section>

        <FeaturedProducts />

        <NewArrivals />

        <PromoBanner />

        <BestSellers />

        {/* Why Choose Us */}
        <Section className="bg-muted/30">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Why choose us
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Premium Quality",
                desc: "Every product is carefully sourced and quality-checked before it reaches you.",
              },
              {
                title: "Fast & Free Shipping",
                desc: "Free standard shipping on all orders over $50. Express options available.",
              },
              {
                title: "30-Day Returns",
                desc: "Not satisfied? Return within 30 days for a full refund, no questions asked.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-background p-6 text-center transition-shadow hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {item.title[0]}
                </div>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Testimonials />

        <Newsletter />
      </main>

      <Footer />
    </>
  )
}
