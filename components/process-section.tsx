const steps = [
  {
    number: "01",
    title: "Free Consultation",
    description:
      "We start with a no-obligation on-site visit to assess your property, listen to your goals, and understand your vision.",
  },
  {
    number: "02",
    title: "Custom Proposal",
    description:
      "Within 48 hours, you receive a detailed, transparent quote outlining services, timeline, and pricing — no surprises.",
  },
  {
    number: "03",
    title: "Expert Execution",
    description:
      "Our trained crew gets to work with professional-grade equipment, treating your property with the utmost care.",
  },
  {
    number: "04",
    title: "Final Walkthrough",
    description:
      "We complete every job with a thorough review, ensuring you are 100% satisfied before we consider the work done.",
  },
]

export function ProcessSection() {
  return (
    <section id="work" className="py-24 bg-primary text-primary-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-primary-foreground/60 text-sm font-semibold tracking-widest uppercase mb-3">
            How It Works
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground text-balance leading-tight">
            A Simple Process, Exceptional Results
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-primary-foreground/20 z-0" />
              )}
              <div className="relative z-10">
                <div className="text-5xl font-serif font-bold text-primary-foreground/20 mb-4 leading-none">
                  {step.number}
                </div>
                <h3 className="font-serif text-xl font-bold text-primary-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
