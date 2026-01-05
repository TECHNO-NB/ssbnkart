// app/investor-relations/in-the-news/page.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// --- Sidebar Data ---
const SIDEBAR_LINKS = [
  { label: "Board of Directors", href: "/investor-relations", active: false },
  { label: "Committees of the Board", href: "#", active: false },
  { label: "Corporate Governance", href: "#", active: false },
  { label: "Dividend", href: "#", active: false },
  { label: "Financial Information", href: "#", active: false },
  { label: "Policies", href: "#", active: false },
  { label: "Shareholders' Communication", href: "#", active: false },
  { label: "Statutory Newspaper Notices and Advertisements", href: "#", active: false },
  { label: "Contact Us", href: "#", active: false },
  { label: "In The News", href: "/investor-relations/in-the-news", active: true },
];

// --- News Data ---
const NEWS_ITEMS = [
  {
    id: 1,
    title: "Press Release - Organic India on January 12, 2024",
    link: "#", // Placeholder for actual PDF/Page link
  },
  // Add more news items here as needed
];

export default function InTheNewsPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* --- Hero Section --- */}
      <div className="relative h-[250px] w-full md:h-[350px]">
        {/* Background Image with Grayscale Filter */}
        <Image
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
          alt="Investor Relations Hero"
          fill
          className="object-cover grayscale"
          priority
        />
        
        {/* Overlay Text */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h1 className="text-center text-4xl uppercase tracking-[0.2em] text-white md:text-6xl font-light">
            Investor <span className="font-bold">Relations</span>
          </h1>
        </div>
      </div>

      {/* --- Main Content Layout --- */}
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-12 md:flex-row md:px-8">
        
        {/* --- Sidebar --- */}
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <nav className="flex flex-col">
            {SIDEBAR_LINKS.map((link, index) => (
              <div key={index} className="group">
                <Link
                  href={link.href}
                  className={cn(
                    "block py-3 text-sm transition-colors hover:text-black",
                    link.active
                      ? "font-semibold text-[#8c2b2b]" // Active color (Reddish Brown)
                      : "text-gray-600"
                  )}
                >
                  {link.label}
                </Link>
                {/* Separator Line */}
                <Separator className="bg-gray-200" />
              </div>
            ))}
          </nav>
        </aside>

        {/* --- Main Content Area --- */}
        <main className="flex-1">
          {/* Section Header */}
          <div className="mb-6 border-l-4 border-[#8c2b2b] pl-4">
             <h2 className="font-serif text-2xl font-normal text-gray-800 md:text-3xl">
              In The News
            </h2>
          </div>

          {/* News List */}
          <div className="space-y-4">
            {NEWS_ITEMS.map((item) => (
              <div key={item.id} className="group">
                <Link 
                  href={item.link} 
                  className="text-sm font-medium text-[#8c2b2b] hover:underline"
                >
                  {item.title}
                </Link>
              </div>
            ))}
            
            {/* Fallback if list is empty */}
            {NEWS_ITEMS.length === 0 && (
                <p className="text-gray-500 text-sm">No recent news updates.</p>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}