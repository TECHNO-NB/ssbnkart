// app/gift-card/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Mock Data for Designs
const CARD_DESIGNS = [
  {
    id: "birthday",
    src: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400",
    label: "Birthday Wish",
  },
  {
    id: "festive",
    src: "https://images.unsplash.com/photo-1607344645830-6e841634534b?auto=format&fit=crop&q=80&w=400",
    label: "Festive Vibes",
  },
  {
    id: "love",
    src: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400",
    label: "Sending Love",
  },
  {
    id: "congrats",
    src: "https://images.unsplash.com/photo-1554252155-2d79074d08b3?auto=format&fit=crop&q=80&w=400",
    label: "Congratulations",
  },
];

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

export default function GiftCardPage() {
  const [selectedDesign, setSelectedDesign] = useState(CARD_DESIGNS[0].id);
  const [amount, setAmount] = useState<string>("500");
  const [customAmount, setCustomAmount] = useState("");

  const handleAmountClick = (val: number) => {
    setAmount(val.toString());
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setAmount(e.target.value);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- Breadcrumb --- */}
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Gift Card</span>
        </nav>
      </div>

      {/* --- Hero Banner --- */}
      <div className="relative mt-6 h-64 md:h-80 w-full overflow-hidden bg-[#1a4a5a]">
        <div className="absolute inset-0 opacity-40">
           {/* Abstract Pattern Background */}
           <Image 
             src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1500"
             alt="Gift Background"
             fill
             className="object-cover"
           />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-5xl italic text-white md:text-7xl drop-shadow-md">
            Gift Card
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12">
        
        {/* --- Step 1: Pick a Design --- */}
        <section className="mb-16 text-center">
          <h2 className="mb-8 font-serif text-2xl italic text-gray-800">
            1. Pick a Design
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CARD_DESIGNS.map((design) => (
              <div
                key={design.id}
                onClick={() => setSelectedDesign(design.id)}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
                  selectedDesign === design.id
                    ? "border-[#581c1c] shadow-lg ring-2 ring-[#581c1c] ring-offset-2"
                    : "border-transparent hover:opacity-90"
                )}
              >
                <div className="aspect-[3/2] w-full relative bg-gray-100">
                  <Image
                    src={design.src}
                    alt={design.label}
                    fill
                    className="object-cover"
                  />
                  {selectedDesign === design.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="rounded-full bg-[#581c1c] p-1 text-white">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 py-2 text-xs font-medium text-gray-700">
                  {design.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Step 2: Choose Value --- */}
        <section className="mb-16 text-center">
          <h2 className="mb-8 font-serif text-2xl italic text-gray-800">
            2. Choose Value
          </h2>
          <div className="flex flex-col items-center gap-6">
            {/* Presets */}
            <div className="flex flex-wrap justify-center gap-3">
              {PRESET_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAmountClick(val)}
                  className={cn(
                    "rounded-full border px-6 py-2 text-sm font-medium transition-colors",
                    amount === val.toString()
                      ? "bg-[#581c1c] text-white border-[#581c1c]"
                      : "border-gray-300 text-gray-700 hover:border-[#581c1c] hover:text-[#581c1c]"
                  )}
                >
                  ₹{val}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="relative w-full max-w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <Input
                type="number"
                placeholder="Other Amount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="pl-8 text-center"
              />
            </div>
            <p className="text-xs text-gray-400">Min ₹500 - Max ₹50,000</p>
          </div>
        </section>

        {/* --- Step 3: Fill in Details --- */}
        <section className="text-center">
          <h2 className="mb-8 font-serif text-2xl italic text-gray-800">
            3. Fill in the Details
          </h2>
          
          <div className="mx-auto max-w-lg space-y-6 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="recipientName" className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Recipient's Name <span className="text-red-500">*</span>
              </Label>
              <Input id="recipientName" className="border-gray-300 bg-gray-50/50" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="recipientEmail" className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Recipient's Email <span className="text-red-500">*</span>
              </Label>
              <Input id="recipientEmail" type="email" className="border-gray-300 bg-gray-50/50" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmEmail" className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Confirm Recipient's Email <span className="text-red-500">*</span>
              </Label>
              <Input id="confirmEmail" type="email" className="border-gray-300 bg-gray-50/50" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="senderName" className="text-xs font-bold uppercase tracking-wide text-gray-500">
                From (Your Name) <span className="text-red-500">*</span>
              </Label>
              <Input id="senderName" className="border-gray-300 bg-gray-50/50" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Add a Personal Message
              </Label>
              <Textarea 
                id="message" 
                className="min-h-[100px] border-gray-300 bg-gray-50/50 resize-none" 
                maxLength={200}
              />
              <p className="text-right text-[10px] text-gray-400">Character Limit: 200</p>
            </div>

            <div className="pt-6">
              <p className="text-center text-xs text-gray-500 mb-4">
                By continuing, I agree to the <a href="#" className="underline hover:text-[#581c1c]">Terms and Conditions</a>.
              </p>
              <Button 
                size="lg" 
                className="w-full bg-[#581c1c] hover:bg-[#4a1717] text-white font-medium tracking-wide"
              >
                PROCEED TO BUY
              </Button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}