import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-landscape.jpg"
          alt="Beautifully manicured lawn and garden"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/55" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-8">
            <Star className="w-3 h-3 fill-accent text-accent" />
            <span>Trusted by 500+ homeowners</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight text-balance mb-6">
            Your Lawn, <br />
            <span className="text-accent">Perfectly</span> Crafted.
          </h1>

          <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-xl mb-10">
            GreenCraft Landscaping transforms ordinary outdoor spaces into stunning, sustainable
            landscapes — backed by 15 years of expertise and a passion for the craft.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 text-base font-semibold group"
            >
              <a href="#contact">
                Get Your Free Quote
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/40 text-white bg-white/10 hover:bg-white/20 rounded-full px-8 text-base font-semibold"
            >
              <a href="#services">Explore Services</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap gap-10">
            {[
              { value: "15+", label: "Years Experience" },
              { value: "500+", label: "Happy Clients" },
              { value: "98%", label: "Satisfaction Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-white">
                <p className="font-serif text-4xl font-bold">{stat.value}</p>
                <p className="text-white/60 text-sm mt-1 tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  )
}
