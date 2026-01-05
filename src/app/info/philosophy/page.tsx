// app/philosophy/page.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, HeartHandshake, Leaf, Hammer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PhilosophyPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- Breadcrumb --- */}
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Philosophy</span>
        </nav>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        
        {/* --- Hero Section --- */}
        <div className="relative h-[300px] w-full overflow-hidden rounded-lg md:h-[400px] mb-12">
           {/* Placeholder image for craftsmanship/artisan work */}
           <Image 
             src="https://images.unsplash.com/photo-1590736969955-71a69dd0ae4e?auto=format&fit=crop&q=80&w=2000" 
             alt="Indian Craftsmanship"
             fill
             className="object-cover"
           />
           <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
             <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-wide">
               Our Philosophy
             </h1>
           </div>
        </div>

        {/* --- Main Content --- */}
        <div className="grid gap-12 md:grid-cols-12">
          
          {/* Text Column */}
          <div className="md:col-span-8 space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#581c1c] mb-6">
                Crafting a Sustainable Future
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed font-light">
                SSBN was founded with the strong belief that there was a need for a vehicle for marketing the vast and diverse craft traditions of India and thereby help fulfil the need to provide and sustain employment.
              </p>
            </div>

            <div className="bg-[#faf9f6] p-8 border-l-4 border-[#581c1c] rounded-r-lg">
              <p className="text-xl font-serif italic text-gray-800 leading-relaxed">
                "We blend traditional craft techniques with contemporary designs to bring aesthetic and affordable products to today's consumers."
              </p>
            </div>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Our endeavour is to provide customers with crafted products which help support and encourage good craftsmanship.
              </p>
              <p>
                Our products are sourced from all over India. SSBN works closely with artisans by providing various inputs including design, quality control, access to raw materials and production coordination.
              </p>
              <p>
                The vision continues to be to <strong className="text-[#581c1c]">maximize the handmade element</strong> in our products, whether it is handwoven textiles, hand block printing, hand embroidery or handcrafting home products.
              </p>
            </div>
          </div>

          {/* Sidebar / Visuals */}
          <div className="md:col-span-4 space-y-6">
            <Card className="border-none shadow-md bg-[#581c1c] text-white">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-white/10 rounded-full">
                  <HeartHandshake className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-serif text-xl font-medium">Empowerment</h3>
                <p className="text-sm text-white/80">
                  Supporting artisans by providing sustainable employment opportunities across rural India.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-[#eaddcf]">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-white/40 rounded-full">
                  <Hammer className="w-8 h-8 text-[#581c1c]" />
                </div>
                <h3 className="font-serif text-xl font-medium text-[#581c1c]">Tradition</h3>
                <p className="text-sm text-[#581c1c]/80">
                  Preserving diverse craft traditions through contemporary design interventions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-stone-100">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <Leaf className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-serif text-xl font-medium text-gray-800">Sustainability</h3>
                <p className="text-sm text-gray-600">
                  Creating aesthetic products that are affordable and environmentally conscious.
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}