import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Margaret T.",
    location: "Westfield, NJ",
    rating: 5,
    text: "GreenCraft completely transformed our backyard. The team was professional, punctual, and the results exceeded every expectation. Our neighbors constantly ask who did our landscaping!",
    initial: "M",
  },
  {
    name: "Robert & Dana K.",
    location: "Summit, NJ",
    rating: 5,
    text: "We've been using GreenCraft for weekly lawn care for 3 years. Consistent, reliable, and the lawn has never looked better. Worth every penny — they treat your property like their own.",
    initial: "R",
  },
  {
    name: "Linda P.",
    location: "Chatham, NJ",
    rating: 5,
    text: "The irrigation system they installed has saved us so much water and effort. Their crew was knowledgeable and respectful of our property. I can't recommend them highly enough.",
    initial: "L",
  },
  {
    name: "James H.",
    location: "Madison, NJ",
    rating: 5,
    text: "Hired GreenCraft for a complete landscape redesign. From the initial consultation to the final walkthrough, the experience was seamless and the outcome is stunning.",
    initial: "J",
  },
  {
    name: "Carla M.",
    location: "Morris Plains, NJ",
    rating: 5,
    text: "Seasonal cleanups are always done with care and attention to detail. The team remembers our preferences year after year. Truly a first-class service.",
    initial: "C",
  },
  {
    name: "Steven O.",
    location: "Florham Park, NJ",
    rating: 5,
    text: "Pricing is fair and completely transparent. No surprises, ever. The quality of their work speaks for itself — my lawn has been the best on the block since day one.",
    initial: "S",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
            Client Stories
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance leading-tight mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Don&apos;t just take our word for it — here&apos;s what homeowners across the region
            have to say about GreenCraft.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col hover:shadow-md hover:border-primary/20 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote icon */}
              <Quote className="w-8 h-8 text-primary/20 mb-3" />

              <p className="text-foreground text-sm leading-relaxed flex-1 mb-6">{t.text}</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                  {t.initial}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
