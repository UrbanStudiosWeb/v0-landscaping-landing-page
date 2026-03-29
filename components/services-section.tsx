import { Scissors, Flower2, Droplets, Snowflake, TreePine, Shovel } from "lucide-react"

const services = [
  {
    icon: Scissors,
    title: "Lawn Mowing & Edging",
    description:
      "Precise, consistent cuts that keep your lawn looking pristine all season long. We offer weekly, bi-weekly, or custom schedules.",
    image: "/images/lawn-mowing.jpg",
  },
  {
    icon: Flower2,
    title: "Landscape Design",
    description:
      "Custom garden and landscape designs that complement your home's architecture and reflect your personal style.",
    image: "/images/garden-design.jpg",
  },
  {
    icon: Droplets,
    title: "Irrigation Systems",
    description:
      "Smart, water-efficient irrigation installation and maintenance to keep your landscape lush while saving on water bills.",
    image: "/images/irrigation.jpg",
  },
  {
    icon: TreePine,
    title: "Tree & Shrub Care",
    description:
      "Professional pruning, shaping, and health treatments to ensure your trees and shrubs thrive for years to come.",
  },
  {
    icon: Shovel,
    title: "Mulching & Bed Care",
    description:
      "Fresh mulch installation and flower bed maintenance to suppress weeds, retain moisture, and beautify your property.",
  },
  {
    icon: Snowflake,
    title: "Seasonal Cleanups",
    description:
      "Spring and fall cleanup services including leaf removal, aeration, overseeding, and winterization prep.",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
            What We Offer
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance leading-tight mb-4">
            Comprehensive Lawn & Landscape Services
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            From routine lawn maintenance to complete landscape transformations, we handle every detail
            with care and professionalism.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                {/* Card image (first 3 only) */}
                {service.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Card without image — icon variant */}
                {!service.image && (
                  <div className="h-48 bg-muted flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-foreground">{service.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
