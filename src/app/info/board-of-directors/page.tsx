// app/investor-relations/page.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// --- Mock Data extracted from image ---
const SIDEBAR_LINKS = [
  { label: "Board of Directors", href: "/investor-relations/board", active: true },
  { label: "Committees of the Board", href: "#", active: false },
  { label: "Corporate Governance", href: "#", active: false },
  { label: "Dividend", href: "#", active: false },
  { label: "Financial Results", href: "#", active: false },
  { label: "Policies", href: "#", active: false },
  { label: "Shareholder Communication", href: "#", active: false },
  { label: "Statutory Newspaper Notices and Advertisements", href: "#", active: false },
  { label: "Contact Us", href: "#", active: false },
  { label: "In The News", href: "#", active: false },
];

const EXECUTIVE_DIRECTORS = [
  { name: "Mr. William Nanda Bissell", role: "Managing Director" },
  { name: "Mr. Mahesh Kumar Chauhan", role: "Executive Vice Chairman and Director" },
];

const INDEPENDENT_DIRECTORS = [
  { name: "Ms. Pooja Jhaveri", role: "Independent Director" },
  { name: "Mr. William Liam Grover", role: "Non-Executive Director" },
  { name: "Ms. Amita Rashid", role: "Independent Director" },
  { name: "Mr. Richard Prem Colman", role: "Non-Executive Director" },
  { name: "Mr. Saurabh Niranjan Lamba", role: "Independent Director" },
  { name: "Ms. Monaz Lovern Biscuitwala", role: "Non-Executive Director" },
  { name: "Mr. Vipin Maneklal", role: "Non-Executive Director" },
  { name: "Mr. Akhil Khama", role: "Non-Executive Director" },
  { name: "Ms. Azmeen Chawla", role: "Independent Non-Exec Director" },
];

export default function InvestorRelationsPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* --- Hero Section --- */}
      <div className="relative h-[300px] w-full md:h-[400px]">
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
          <h2 className="mb-8 font-serif text-2xl font-normal text-gray-800 md:text-3xl">
            Board of Directors
          </h2>

          <div className="grid gap-12 md:grid-cols-2">
            
            {/* Column 1: Executive Directors */}
            <div>
              <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900">
                Executive Directors
              </h3>
              <div className="space-y-6">
                {EXECUTIVE_DIRECTORS.map((director, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="font-semibold text-[#2b6ca3]">
                      {director.name}
                    </p>
                    <p className="text-xs italic text-gray-500">
                      {director.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Independent / Non-Executive Directors */}
            <div>
              <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900">
                Non-Executive / Independent Directors
              </h3>
              <div className="space-y-6">
                {INDEPENDENT_DIRECTORS.map((director, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="font-semibold text-[#2b6ca3]">
                      {director.name}
                    </p>
                    <p className="text-xs italic text-gray-500">
                      {director.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}