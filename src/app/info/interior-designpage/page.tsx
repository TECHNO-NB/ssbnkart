// app/interior-design/page.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, 
  MessageSquare, 
  CalendarCheck, 
  Wallet, 
  ThumbsUp,
  MapPin,
  Store,
  Globe,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function InteriorDesignPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* --- Breadcrumb --- */}
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Interior Design Services</span>
        </nav>
      </div>

      {/* --- Hero Section --- */}
      <div className="relative w-full h-[400px] md:h-[600px]">
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000" 
          alt="Interior Design Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-serif font-medium mb-4 drop-shadow-md">
              Interior Design Services
            </h1>
            <p className="text-lg md:text-xl font-light max-w-2xl mx-auto drop-shadow-sm">
              We create spaces that are a unique reflection of you.
            </p>
            <Button 
                size="lg" 
                className="mt-8 bg-[#581c1c] hover:bg-[#4a1717] text-white rounded-full px-8 h-12 text-base"
                onClick={() => document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
                Book A Consultation
            </Button>
          </div>
        </div>
      </div>

      {/* --- Service Gallery & Why Us --- */}
      <div className="py-16 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {[
                    { src: "https://images.unsplash.com/photo-1616594039964-40891a909d99?auto=format&fit=crop&q=80&w=600", label: "Living Room" },
                    { src: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=600", label: "Bedroom" },
                    { src: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=600", label: "Dining" },
                    { src: "https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&q=80&w=600", label: "Fabrics" },
                ].map((item, idx) => (
                    <div key={idx} className="relative aspect-[3/4] group overflow-hidden rounded-lg cursor-pointer">
                        <Image src={item.src} alt={item.label} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                            <span className="text-white font-medium text-lg">{item.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Why Us Icons */}
            <div className="text-center mb-12">
                <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-8">WHY US</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full border-2 border-[#581c1c] flex items-center justify-center text-[#581c1c]">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <span className="text-sm font-medium text-[#581c1c] uppercase">Free Consultation</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full border-2 border-[#581c1c] flex items-center justify-center text-[#581c1c]">
                            <CalendarCheck className="w-8 h-8" />
                        </div>
                        <span className="text-sm font-medium text-[#581c1c] uppercase">45 Days Installation</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full border-2 border-[#581c1c] flex items-center justify-center text-[#581c1c]">
                            <Wallet className="w-8 h-8" />
                        </div>
                        <span className="text-sm font-medium text-[#581c1c] uppercase">No Hidden Charges</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full border-2 border-[#581c1c] flex items-center justify-center text-[#581c1c]">
                            <ThumbsUp className="w-8 h-8" />
                        </div>
                        <span className="text-sm font-medium text-[#581c1c] uppercase">One Stop Solution</span>
                    </div>
                </div>
                <p className="mt-8 text-xs text-gray-400 uppercase tracking-widest">HOW DOES IT WORK? IT'S SIMPLE</p>
            </div>
        </div>
      </div>

      {/* --- How It Works Process --- */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                
                {/* Step 1: Meet Designer */}
                <div className="space-y-8">
                    <h3 className="text-center text-lg font-bold tracking-widest text-gray-700 uppercase">MEET OUR DESIGNER</h3>
                    
                    {/* Stepper Graphic */}
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#8c2b2b] text-white flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-[#8c2b2b]/20">1</div>
                        <div className="h-[2px] flex-1 bg-gray-200 border-t border-dashed border-gray-400"></div>
                        <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">2</div>
                        <div className="h-[2px] flex-1 bg-gray-200 border-t border-dashed border-gray-400"></div>
                        <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">3</div>
                        <div className="h-[2px] flex-1 bg-gray-200 border-t border-dashed border-gray-400"></div>
                        <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">4</div>
                    </div>

                    <div className="relative aspect-video w-full">
                        <Image 
                            src="https://img.freepik.com/free-vector/interior-design-concept-illustration_114360-3974.jpg" 
                            alt="Meet Designer Illustration" 
                            fill 
                            className="object-contain" 
                        />
                    </div>
                    <div className="text-center max-w-sm mx-auto">
                        <h4 className="font-serif text-xl font-bold text-[#581c1c] mb-2">Detailed Consultation</h4>
                        <p className="text-gray-600 text-sm">Meet our expert designers to discuss your vision, preferences, and requirements in detail.</p>
                    </div>
                </div>

                {/* Step 2: Choose Portfolio */}
                <div className="space-y-8">
                    <h3 className="text-center text-lg font-bold tracking-widest text-gray-700 uppercase">CHOOSE FROM OUR PORTFOLIO</h3>
                    
                    {/* Stepper Graphic */}
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#8c2b2b] text-white flex items-center justify-center font-bold">1</div>
                        <div className="h-[2px] flex-1 bg-[#8c2b2b]"></div>
                        <div className="w-12 h-12 rounded-full bg-[#8c2b2b] text-white flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-[#8c2b2b]/20">2</div>
                        <div className="h-[2px] flex-1 bg-gray-200 border-t border-dashed border-gray-400"></div>
                        <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">3</div>
                        <div className="h-[2px] flex-1 bg-gray-200 border-t border-dashed border-gray-400"></div>
                        <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">4</div>
                    </div>

                    <div className="relative aspect-video w-full">
                        <Image 
                            src="https://img.freepik.com/free-vector/interior-design-concept_23-2148633390.jpg" 
                            alt="Choose Portfolio Illustration" 
                            fill 
                            className="object-contain" 
                        />
                    </div>
                    <div className="text-center max-w-sm mx-auto">
                        <h4 className="font-serif text-xl font-bold text-[#581c1c] mb-2">Select Your Style</h4>
                        <p className="text-gray-600 text-sm">Browse through our curated portfolio and select designs that resonate with your personal style.</p>
                    </div>
                </div>

            </div>
        </div>
      </div>

      {/* --- Stats & Testimonials --- */}
      <div className="py-20 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            
            <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-12">OUR REACH</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 border-b border-gray-200 pb-12">
                <div className="space-y-2">
                    <div className="text-4xl font-serif text-[#581c1c]">127</div>
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-bold">Cities</div>
                </div>
                <div className="space-y-2">
                    <div className="text-4xl font-serif text-[#581c1c]">357</div>
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-bold">Stores</div>
                </div>
                <div className="space-y-2">
                    <div className="text-4xl font-serif text-[#581c1c]">10</div>
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-bold">Countries</div>
                </div>
                <div className="space-y-2">
                    <div className="text-4xl font-serif text-[#581c1c]">55,000+</div>
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-bold">Artisans</div>
                </div>
            </div>

            <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-8">MEET OUR HAPPY CUSTOMERS</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { quote: "I'll be a customer for life! I loved everything they did for my space.", author: "DEEPAK MALIK", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400" },
                    { quote: "SSBN lives up to their name. The experience I got with them was fabulous.", author: "NEHA MOHAN", img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=400" },
                    { quote: "SSBN helped us in transforming our new flat into our new home.", author: "AKHIL JOLLY", img: "https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&q=80&w=400" },
                ].map((item, i) => (
                    <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
                        <div className="relative h-48 w-full">
                            <Image src={item.img} alt="Customer Home" fill className="object-cover" />
                        </div>
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="text-[#581c1c] text-2xl font-serif">“</div>
                            <p className="text-gray-600 text-sm italic min-h-[60px]">{item.quote}</p>
                            <div className="text-xs font-bold text-[#581c1c] uppercase tracking-wider border-t border-gray-100 pt-4 w-full">
                                {item.author}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
      </div>

      {/* --- Lead Form --- */}
      <div id="consultation-form" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
            <h2 className="text-3xl font-serif text-[#581c1c] text-center mb-2">Book Your Consultation</h2>
            <p className="text-center text-gray-500 mb-10">Fill in your details and our team will get back to you shortly.</p>
            
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Name*</Label>
                    <Input id="name" placeholder="Your Name" className="border-gray-300" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Mobile No.*</Label>
                    <Input id="phone" placeholder="Your Mobile Number" className="border-gray-300" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email ID*</Label>
                    <Input id="email" type="email" placeholder="Your Email" className="border-gray-300" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">City*</Label>
                    <Select>
                        <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="delhi">New Delhi</SelectItem>
                            <SelectItem value="mumbai">Mumbai</SelectItem>
                            <SelectItem value="bangalore">Bengaluru</SelectItem>
                            <SelectItem value="chennai">Chennai</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea id="message" placeholder="Tell us a bit about your requirement..." className="border-gray-300 min-h-[100px]" />
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <Button className="bg-[#581c1c] hover:bg-[#4a1717] text-white rounded-full px-12 h-12 text-base w-full md:w-auto">
                    Submit Request
                </Button>
            </div>
        </div>
      </div>

    </div>
  );
}