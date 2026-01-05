// app/about-school/page.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, GraduationCap, Users, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutSchoolPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- Breadcrumb --- */}
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">About SSBN School</span>
        </nav>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        
        {/* --- Hero Section --- */}
        <div className="relative mb-12 overflow-hidden rounded-xl bg-gray-900 text-white shadow-xl">
           <div className="absolute inset-0 opacity-40">
               {/* Placeholder for School Image */}
               <Image 
                 src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000" 
                 alt="SSBN School Campus"
                 fill
                 className="object-cover"
               />
           </div>
           <div className="relative z-10 flex flex-col items-center justify-center px-4 py-20 text-center md:py-32">
             <div className="mb-4 rounded-full bg-white/20 p-4 backdrop-blur-sm">
                <GraduationCap className="h-10 w-10 text-white" />
             </div>
             <h1 className="mb-4 font-serif text-4xl font-bold md:text-6xl">
               The SSBN School
             </h1>
             <p className="max-w-xl text-lg text-gray-200">
               Nurturing minds and building futures in Bali, Rajasthan since 1992.
             </p>
           </div>
        </div>

        {/* --- Main Content --- */}
        <div className="grid gap-12 md:grid-cols-2 items-center">
            
            {/* Left Column: Text Info */}
            <div className="space-y-6">
                <h2 className="font-serif text-3xl font-bold text-[#581c1c]">
                    A Holistic Approach to Education
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                    <p>
                        The SSBN School is a co-ed private school for pre-school through Class XII, located in the serene surroundings of Bali, Rajasthan.
                    </p>
                    <p>
                        What began as a humble initiative with just <strong className="text-[#581c1c]">11 students</strong> in 1992 has blossomed into a vibrant institution with nearly <strong className="text-[#581c1c]">1000 students</strong> today.
                    </p>
                    <p>
                        We emphasize a holistic approach to education, offering extensive extra-curricular programs alongside comprehensive academic courses to ensure well-rounded development for every child.
                    </p>
                </div>

                <div className="pt-4">
                    <Button className="bg-[#581c1c] hover:bg-[#4a1717] text-white gap-2" asChild>
                        <Link href="https://www.SSBNschools.org" target="_blank">
                           Visit Our Website <ExternalLink className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Right Column: Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
                <Card className="bg-[#fdf3f3] border-none">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                        <Users className="h-8 w-8 text-[#581c1c] mb-3" />
                        <h3 className="text-3xl font-bold text-[#581c1c]">1000+</h3>
                        <p className="text-sm text-gray-600 font-medium uppercase tracking-wider mt-1">Students</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#faf9f6] border-none">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                        <Globe className="h-8 w-8 text-gray-600 mb-3" />
                        <h3 className="text-3xl font-bold text-gray-800">1992</h3>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">Established</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-100 shadow-sm sm:col-span-2">
                     <CardContent className="p-6">
                        <h4 className="font-serif text-lg font-bold text-gray-800 mb-2">Location</h4>
                        <p className="text-gray-600">
                            Bali, Rajasthan, India
                        </p>
                     </CardContent>
                </Card>
            </div>

        </div>

      </div>
    </div>
  );
}