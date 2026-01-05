"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  ChevronDown, 
  MessageCircle 
} from "lucide-react";

// --- Data Configuration (Matches your Image) ---
const FOOTER_LINKS = [
  {
    title: "Let Us Help You",
    links: [
      { label: "Order Tracking", href: "/info/track-order" },
      { label: "Bulk Orders", href: "/info/bulk-orders" },
      // { label: "Store Locator", href: "/info/store-locator" },
      { label: "Furniture Warranty Policy", href: "/info/furniture-warranty" },
      { label: "Gift Card", href: "/info/giftcard" },
      { label: "Franchise Enquiry Form", href: "/info/franchise" },
      { label: "Interior Design Studio", href: "/info/interior-designpage" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Customer Service", href: "/info/customer-service" },
      { label: "How To Order", href: "/info/how-to-order" },
      { label: "Billing & Payments", href: "/info/billing-payment" },
      { label: "Shipping & Delivery", href: "/info/shipping-delivery" },
      { label: "Return & Exchanges", href: "/info/return-exchange" },
      { label: "FAQs", href: "/info/faqs" },
    ],
  },
  {
    title: "Company",
    links: [
      // { label: "Investor Relations", href: "/info/board-of-directors" },
      { label: "Contact Us", href: "/info/contact-us" },
      // { label: "In The News", href: "/info/inthenews" },
      { label: "Careers", href: "/info/careers" },
      { label: "Terms Of Use", href: "/info/term-of-use" },
      { label: "Privacy Policy", href: "/info/privacy-policy" },
    ],
  },
  {
    title: "About SSBN",
    links: [
      { label: "Philosophy", href: "/info/philosophy" },
      // { label: "Organic Certification", href: "/info/organic-certification" },
      // { label: "The Fabindia School", href: "/info/fabindia-schools" },
      { label: "About Us", href: "/info/about-us" },
      // { label: "Fabfamily", href: "#" },
      // { label: "Blog", href: "#" },
    ],
  },
];

const SOCIALS = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  // State for mobile accordion logic
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  return (
    <footer className="bg-[#581c1c] text-[#eceae5] pt-16 pb-8 relative overflow-hidden">
      {/* Decorative Texture/Gradient (Optional subtle overlay) */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#d4c5b5] via-[#a68a64] to-[#d4c5b5] opacity-30" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Loop through footer columns */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title} className="border-b lg:border-none border-[#eceae5]/20 lg:pb-0">
              
              {/* Desktop Header (Static) / Mobile Header (Clickable) */}
              <button
                onClick={() => window.innerWidth < 1024 && toggleSection(section.title)}
                className="w-full flex items-center justify-between py-4 lg:py-0 lg:mb-6 group"
              >
                <h3 className="font-serif text-lg tracking-wide text-[#d4c5b5] uppercase lg:normal-case lg:text-white lg:font-semibold">
                  {section.title}
                </h3>
                {/* Mobile Chevron */}
                <ChevronDown 
                  className={`w-5 h-5 lg:hidden transition-transform duration-300 ${
                    openSection === section.title ? "rotate-180" : ""
                  }`} 
                />
              </button>

              {/* Desktop List (Always Visible) */}
              <ul className="hidden lg:block space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Mobile List (Accordion Animation) */}
              <AnimatePresence>
                {openSection === section.title && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:hidden overflow-hidden pb-4 space-y-3"
                  >
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link 
                          href={link.href} 
                          className="text-sm text-white/70 block py-1"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* --- Socials & Branding --- */}
        <div className="border-t border-[#eceae5]/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Social Icons */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="text-sm uppercase tracking-widest text-[#d4c5b5] font-medium">Follow Us</span>
            <div className="flex gap-4">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors text-white group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right text-xs text-white/40 font-light">
            <p className="mb-2 text-xl font-serif tracking-widest text-[#d4c5b5] opacity-50">SSBN</p>
            <p>&copy; SSBN Shopping Cart - Quality Fabrics, Trusted Since 2000.</p>
          </div>
        </div>
      </div>

      {/* --- Floating Action Button (WhatsApp) --- */}
      <motion.a
        href="#"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:shadow-[0_0_20px_rgba(37,211,102,0.5)]"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </motion.a>
    </footer>
  );
}