import { Leaf, Facebook, Instagram, Twitter } from "lucide-react"

const footerLinks = {
  Services: [
    "Lawn Mowing & Edging",
    "Landscape Design",
    "Irrigation Systems",
    "Tree & Shrub Care",
    "Mulching & Bed Care",
    "Seasonal Cleanups",
  ],
  Company: ["About Us", "Our Team", "Careers", "Blog", "Contact"],
  Support: ["Free Quote", "FAQ", "Service Areas", "Privacy Policy", "Terms of Service"],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-lg font-bold text-primary-foreground">
                  GreenCraft
                </span>
                <span className="text-[10px] tracking-widest uppercase text-primary-foreground/50">
                  Landscaping
                </span>
              </div>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-6 max-w-xs">
              Transforming outdoor spaces into beautiful, sustainable landscapes across Northern and
              Central New Jersey since 2009.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social media link"
                  className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="w-4 h-4 text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-primary-foreground text-sm tracking-wide uppercase mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-primary-foreground/60 text-sm hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/40 text-xs">
            &copy; {new Date().getFullYear()} GreenCraft Landscaping. All rights reserved.
          </p>
          <p className="text-primary-foreground/40 text-xs">
            Licensed &amp; Insured · NJ Contractor #13VH00000000
          </p>
        </div>
      </div>
    </footer>
  )
}
