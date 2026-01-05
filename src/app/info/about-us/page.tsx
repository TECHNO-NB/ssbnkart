// app/about-us/page.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Target,
  HeartHandshake,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- Breadcrumb --- */}
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">About Us</span>
        </nav>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 space-y-16">
        
        {/* --- Header Section --- */}
        <section className="text-center space-y-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#581c1c]">
            About SSBN Shopping Cart
          </h1>
          <p className="text-lg text-gray-600 font-serif italic">
            Quality Fabrics, Trusted Since 2000.
          </p>
          <div className="max-w-3xl mx-auto space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Founded in the year <span className="font-bold text-[#581c1c]">2000</span>, 
              SSBN Shopping Cart has grown from a small retail venture into a trusted name 
              in the world of fashion and quality fabrics.
            </p>
          </div>
        </section>

        {/* --- Hero Image --- */}
        <section>
          <div className="relative h-[300px] w-full overflow-hidden rounded-xl bg-gray-100 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=2000" 
              alt="SSBN Fabrics"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h2 className="text-white text-3xl md:text-4xl font-serif font-bold text-center px-4">
                Two Decades of Excellence
              </h2>
            </div>
          </div>
        </section>

        {/* --- Our Story & Philosophy --- */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <h3 className="font-serif text-2xl font-bold text-gray-900 flex items-center gap-2">
              <HeartHandshake className="w-6 h-6 text-[#581c1c]" /> 
              Our Journey
            </h3>
            <p>
              With over two decades of experience, we have proudly served millions of satisfied customers, 
              building strong relationships based on trust, consistency, and excellence.
            </p>
            <p>
              Our success is driven by a deep understanding of customer preferences, a commitment to innovation, 
              and a passion for delivering value. Over the years, we have continuously expanded our collection, 
              embraced new trends, and improved our shopping experience—both online and offline.
            </p>
          </div>
          
          <Card className="bg-[#faf9f6] border-[#eaddcf] shadow-md h-full">
            <CardContent className="p-8 flex flex-col justify-center h-full space-y-4">
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#581c1c]/10 rounded-full">
                    <Target className="w-6 h-6 text-[#581c1c]" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#581c1c]">Our Promise</h3>
               </div>
               <p className="text-gray-700 leading-relaxed">
                 At SSBN Shopping Cart, we believe that <span className="font-semibold">quality is never a compromise</span>. 
                 Every fabric we offer is carefully sourced and quality-checked to ensure superior comfort, 
                 durability, and style.
               </p>
               <Separator className="bg-[#eaddcf]" />
               <p className="text-gray-600 italic text-sm">
                 "From everyday wear to premium selections, our products are designed to meet the evolving 
                 needs of modern customers while maintaining timeless standards."
               </p>
            </CardContent>
          </Card>
        </section>

        {/* --- Values Grid --- */}
        <section className="bg-[#581c1c] text-white rounded-xl p-8 md:p-12 shadow-xl">
          <div className="text-center mb-10">
             <h2 className="font-serif text-3xl font-bold mb-4">Why Choose SSBN?</h2>
             <p className="text-white/80 max-w-2xl mx-auto">
               As we move forward, we remain dedicated to providing exceptional products and service, 
               just as we have since the beginning.
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {/* Value 1 */}
            <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-white text-[#581c1c] rounded-full">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg font-serif">Uncompromised Quality</h3>
              <p className="text-sm text-white/80">
                Carefully sourced and checked fabrics ensuring superior comfort and durability.
              </p>
            </div>

            {/* Value 2 */}
            <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-white text-[#581c1c] rounded-full">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg font-serif">Trusted Relationships</h3>
              <p className="text-sm text-white/80">
                Building bonds based on trust and consistency with millions of customers.
              </p>
            </div>

            {/* Value 3 */}
            <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-white text-[#581c1c] rounded-full">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg font-serif">Modern Innovation</h3>
              <p className="text-sm text-white/80">
                Meeting evolving needs while maintaining timeless standards, online and offline.
              </p>
            </div>
          </div>
        </section>

        {/* --- Footer Note --- */}
        <div className="text-center pt-8 border-t border-gray-100">
           <h4 className="font-serif text-2xl font-bold text-gray-800">
             SSBN Shopping Cart
           </h4>
           <p className="text-gray-500 mt-2">
             Symbol of reliability, quality fabrics, and customer satisfaction.
           </p>
        </div>

      </div>
    </div>
  );
}