// app/franchise-enquiry/page.tsx

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

export default function FranchiseEnquiryPage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center space-x-2 text-sm text-gray-500"
        >
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Franchise Enquiry</span>
        </nav>

        {/* Banner Image */}
        <div className="relative mb-12 h-64 w-full overflow-hidden rounded-lg md:h-80">
          <Image
            src="https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=1200" // Placeholder for store interior
            alt="SSBN Store Interior"
            fill
            className="object-cover"
          />
        </div>

        {/* Form Container */}
        <form className="space-y-12">
          
          {/* --- Section 1: Personal Profile --- */}
          <section className="space-y-6">
            <h2 className="text-lg font-serif font-bold text-gray-800">Personal Profile</h2>
            
            <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name*</Label>
                <Input id="fullName" placeholder="" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth*</Label>
                <div className="relative">
                  <Input id="dob" placeholder="mm/dd/yyyy" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
                  <Calendar className="absolute right-0 top-2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email id*</Label>
                <Input id="email" type="email" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address*</Label>
                <Input id="address" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile No.*</Label>
                <Input id="mobile" type="tel" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>
              
              {/* Empty placeholder for grid alignment if needed, or spans */}
              <div className="hidden md:block"></div>

              <div className="space-y-2">
                <Label htmlFor="education">Educational Qualifications *</Label>
                <Input id="education" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profession (Service/ Self Employed)*</Label>
                <Input id="profession" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>
            </div>
          </section>

          <Separator className="bg-gray-200 h-2" />

          {/* --- Section 2: Business / Service Profile --- */}
          <section className="space-y-6">
            <h2 className="text-lg font-serif font-bold text-gray-800">Business / Service Profile</h2>
            
            <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firmName">Firm/ Employer Name*</Label>
                <Input id="firmName" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessNature">Nature of Business of Firm/ Employer*</Label>
                <Input id="businessNature" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience (Service/ Business)*</Label>
                <Input id="experience" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="turnover">Current annual Turnover (Rs Lacs/ annum)*</Label>
                <Input id="turnover" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>
            </div>
          </section>

          <Separator className="bg-gray-200 h-2" />

          {/* --- Section 3: Proposal Details --- */}
          <section className="space-y-6">
            <h2 className="text-lg font-serif font-bold text-gray-800">Proposal Details</h2>
            
            <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City for SSBN Franchise</Label>
                <Input id="city" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Proposed Location/ Market*</Label>
                <Input id="location" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Your investment budget (Rs Lacs) *</Label>
                <Input id="budget" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="otherBrands">Other major Brands Present in the vicinity*</Label>
                <Input id="otherBrands" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>
            </div>
          </section>

          <Separator className="bg-gray-200 h-2" />

          {/* --- Section 4: Property Details --- */}
          <section className="space-y-6">
            <h2 className="text-lg font-serif font-bold text-gray-800">Property Details</h2>
            
            <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label>Property</Label>
                <RadioGroup defaultValue="owned" className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="owned" id="owned" className="text-[#581c1c]" />
                    <Label htmlFor="owned">Owned</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rented" id="rented" className="text-[#581c1c]" />
                    <Label htmlFor="rented">Rented</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area in Sq ft (Carpet)*</Label>
                <Input id="area" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="floors">No. of floors*</Label>
                <Input id="floors" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frontage">Frontage (in feet)*</Label>
                <Input id="frontage" className="border-t-0 border-x-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0" />
              </div>
            </div>
          </section>

          {/* Buttons */}
          <div className="flex items-center justify-start gap-4 pt-4">
            <Button variant="outline" className="w-32 border-[#581c1c] text-[#581c1c] hover:bg-[#581c1c] hover:text-white transition-colors">
              Cancel
            </Button>
            <Button className="w-32 bg-[#d1d1d1] text-white hover:bg-[#581c1c] transition-colors">
              Submit
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}