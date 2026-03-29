import { CheckCircle2 } from "lucide-react"

const values = [
  "Locally owned and family operated since 2009",
  "Licensed, insured, and fully certified crew members",
  "Eco-conscious practices and organic treatment options",
  "Transparent pricing with no hidden fees",
  "100% satisfaction guarantee on all services",
  "Flexible scheduling including weekends",
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 rounded-2xl overflow-hidden h-64">
                <img
                  src="/images/hero-landscape.jpg"
                  alt="Professional landscaping result"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-44">
                <img
                  src="/images/garden-design.jpg"
                  alt="Garden design work"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-44">
                <img
                  src="/images/lawn-mowing.jpg"
                  alt="Lawn mowing service"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Experience badge */}
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl">
              <p className="font-serif text-4xl font-bold">15+</p>
              <p className="text-primary-foreground/80 text-sm mt-1">Years of Excellence</p>
            </div>
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
              About GreenCraft
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance leading-tight mb-6">
              Passion for Perfectly Kept Outdoor Spaces
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-4">
              Founded in 2009, GreenCraft Landscaping was built on a simple belief: every home
              deserves a beautiful outdoor space. What started as a two-person operation has grown
              into a trusted team of 20+ dedicated landscape professionals.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed mb-8">
              We combine time-tested techniques with modern tools and sustainable practices to
              deliver results that stand the test of time — and the seasons.
            </p>

            {/* Values list */}
            <ul className="space-y-3">
              {values.map((value) => (
                <li key={value} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm leading-relaxed">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
