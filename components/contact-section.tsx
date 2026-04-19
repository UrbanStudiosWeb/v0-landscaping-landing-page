"use client"

import { useState } from "react"
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "(908) 555-0192",
    href: "tel:+19085550192",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@greencraftlawn.com",
    href: "mailto:hello@greencraftlawn.com",
  },
  {
    icon: MapPin,
    label: "Service Area",
    value: "Northern & Central New Jersey",
    href: "#",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon–Sat: 7am – 6pm",
    href: "#",
  },
]

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      })
      setSubmitted(true)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left — Info */}
          <div>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
              Get In Touch
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance leading-tight mb-6">
              Ready for a Lawn You&apos;ll Love?
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-10">
              Fill out the form and one of our lawn care specialists will reach out within one
              business day to schedule your free consultation.
            </p>

            {/* Contact Info */}
            <div className="space-y-5">
              {contactInfo.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground tracking-wide uppercase mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-foreground font-medium text-sm">{item.value}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-card border border-border rounded-2xl p-8">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Message Received!
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  Thank you for reaching out. A GreenCraft specialist will contact you within one
                  business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} name="contact" data-netlify="true" className="space-y-5">
                <input type="hidden" name="form-name" value="contact" />
                <div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
                    Request a Free Quote
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    No obligation. No pressure. Just great lawn care.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                      First Name
                    </label>
                    <Input name="firstName" placeholder="John" required className="bg-background border-border" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                      Last Name
                    </label>
                    <Input name="lastName" placeholder="Smith" required className="bg-background border-border" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                    Email Address
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="(908) 555-0000"
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                    Service Needed
                  </label>
                  <select
                    name="service"
                    className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Select a service...</option>
                    <option>Lawn Mowing & Edging</option>
                    <option>Landscape Design</option>
                    <option>Irrigation System</option>
                    <option>Tree & Shrub Care</option>
                    <option>Seasonal Cleanup</option>
                    <option>Other / Multiple Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                    Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Tell us about your property or any specific requests..."
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-11 font-semibold"
                >
                  {submitting ? "Sending..." : "Send My Request"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
