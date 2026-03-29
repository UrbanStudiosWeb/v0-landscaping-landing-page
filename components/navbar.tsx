"use client"

import { useState, useEffect } from "react"
import { Menu, X, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-card/95 backdrop-blur-sm shadow-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-none">
              <span className={`font-serif text-lg font-bold ${scrolled ? "text-foreground" : "text-white"}`}>
                GreenCraft
              </span>
              <span className={`text-[10px] tracking-widest uppercase ${scrolled ? "text-muted-foreground" : "text-white/70"}`}>
                Landscaping
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                  scrolled ? "text-foreground" : "text-white/90"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 text-sm font-medium"
            >
              <a href="#contact">Get Free Quote</a>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`md:hidden p-2 rounded-md ${scrolled ? "text-foreground" : "text-white"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border shadow-lg">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground text-sm font-medium py-2 border-b border-border last:border-0"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button asChild className="bg-primary text-primary-foreground rounded-full mt-2">
              <a href="#contact" onClick={() => setMobileOpen(false)}>
                Get Free Quote
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
