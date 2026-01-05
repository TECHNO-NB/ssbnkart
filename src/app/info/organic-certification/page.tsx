// app/organic-certification/page.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Leaf, Sprout, Sun, Award, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function OrganicCertificationPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- Breadcrumb --- */}
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Organic Certification</span>
        </nav>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        
        {/* --- Hero Section --- */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-serif text-3xl font-bold text-[#581c1c] md:text-4xl">
            SSBN's Food Products
          </h1>
          <p className="mx-auto max-w-2xl text-gray-600 text-lg">
            Our food products have been certified as organic. Here is a guide to help you understand what our symbols mean.
          </p>
        </div>

        {/* --- The Three Categories (Color Coded) --- */}
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          
          {/* GREEN: Fully Certified */}
          <Card className="border-t-4 border-t-green-600 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                <Award className="h-8 w-8" />
              </div>
              <CardTitle className="font-serif text-xl font-bold text-green-700">
                Green Logo
              </CardTitle>
              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 uppercase tracking-wide">
                Fully Certified
              </span>
            </CardHeader>
            <CardContent className="text-center text-sm text-gray-600 leading-relaxed">
              <p>
                All processes, from growing to preparing to packing, have been done according to National and International standards and verified by accredited agencies.
              </p>
            </CardContent>
          </Card>

          {/* BLUE: In Conversion */}
          <Card className="border-t-4 border-t-blue-600 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Sprout className="h-8 w-8" />
              </div>
              <CardTitle className="font-serif text-xl font-bold text-blue-700">
                Blue Logo
              </CardTitle>
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 uppercase tracking-wide">
                In Conversion
              </span>
            </CardHeader>
            <CardContent className="text-center text-sm text-gray-600 leading-relaxed">
              <p>
                The farmer is using purely organic techniques, registered and complying with set standards. Farmland is currently in the mandatory 3-year management period before full certification.
              </p>
            </CardContent>
          </Card>

          {/* YELLOW: Natural */}
          <Card className="border-t-4 border-t-yellow-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50 text-yellow-600">
                <Sun className="h-8 w-8" />
              </div>
              <CardTitle className="font-serif text-xl font-bold text-yellow-700">
                Yellow Logo
              </CardTitle>
              <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 uppercase tracking-wide">
                Natural
              </span>
            </CardHeader>
            <CardContent className="text-center text-sm text-gray-600 leading-relaxed">
              <p>
                Products by small farmers using organic techniques who have not yet registered. Includes processed foods free from synthetic preservatives, colors, flavors, or additives.
              </p>
            </CardContent>
          </Card>

        </div>

        {/* --- Standards & Accreditation Section --- */}
        <div className="bg-[#faf9f6] rounded-xl overflow-hidden border border-[#eaddcf]">
          <div className="grid md:grid-cols-2">
            
            {/* Image Side */}
            <div className="relative h-64 md:h-auto">
               <Image 
                 src="https://images.unsplash.com/photo-1625246333195-f8196ae0a486?auto=format&fit=crop&q=80&w=1000" 
                 alt="Organic Farming"
                 fill
                 className="object-cover"
               />
               <div className="absolute inset-0 bg-[#581c1c]/10 mix-blend-multiply" />
            </div>

            {/* Content Side */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-green-600" />
                <h2 className="text-2xl font-serif font-bold text-[#581c1c]">
                  National & International Standards
                </h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  India's organic certification standards are set by the <strong>National Programme for Organic Production (NPOP)</strong>, which are based on standards set by the International Federation of Organic Agriculture (IFOAM).
                </p>
                <p>
                  In India, there are a handful of certifying agencies accredited by NPOP. Farmers and producers must register with one of these agencies, who will in turn verify whether NPOP standards have been met.
                </p>
                
                <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold text-gray-900 mb-1">What to look for?</p>
                    <p className="text-gray-600">
                      For certified Organic products, look for a certified agency's logo (e.g., SGS) and NPOP's <strong>India Organic</strong> logo on the packaging.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}