// app/furniture-warranty/page.tsx

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  AlertTriangle,
  Hammer,
  Clock,
  Info,
  Droplets,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function FurnitureWarrantyPage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center space-x-2 text-sm text-gray-500"
        >
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Furniture Warranty</span>
        </nav>

        {/* Header */}
        <div className="mb-10 border-b border-gray-100 pb-8">
          <h1 className="text-3xl font-serif font-bold text-[#581c1c] md:text-4xl mb-4">
            Furniture Warranty Policy
          </h1>
          <p className="text-gray-600">
            At SSBN, we pride ourselves on the quality of our craftsmanship.
            Please read our warranty terms and product care instructions below.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-10">
          
          {/* Section A: Warranty Policy */}
          <section className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#581c1c]" /> A. Warranty Coverage
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* 1. Quality & Borer Warranty */}
              <Card className="border-none shadow-sm bg-stone-50 h-full">
                <CardHeader>
                  <CardTitle className="text-lg text-[#581c1c]">1. Wood Quality & Borer Warranty</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-3 leading-relaxed">
                  <p>
                    <strong>24 Months Warranty:</strong> Our wooden furniture is treated and covered by a 24-month warranty against borer infestation from the date of purchase.
                  </p>
                  <p>
                    <strong>Natural Characteristics:</strong> Our furniture is mostly made of solid wood, marble, or stone. These natural materials have distinct inherent characteristics like grain differences and minor blemishes.
                  </p>
                  <p>
                    <strong>Seasoning:</strong> Wood is seasoned with optimum moisture content to reduce (but not completely eliminate) seasonal expansion and contraction. Superficial hairline cracks may occur due to climate changes.
                  </p>
                  <p>
                    <strong>Exchange Policy:</strong> During the warranty period, we exchange the product free of cost if a request is raised with the original invoice. Exchange is subject to verification by our Quality Control team.
                  </p>
                </CardContent>
              </Card>

              {/* 2. Manufacturing Defects */}
              <Card className="border-none shadow-sm bg-stone-50 h-full">
                <CardHeader>
                  <CardTitle className="text-lg text-[#581c1c]">2. Manufacturing Defects (Non-Upholstered)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-3 leading-relaxed">
                  <p>
                    <strong>1 Year Warranty:</strong> We offer a 1-year warranty against manufacturing defects (poor workmanship).
                  </p>
                  <p>
                    <strong>Resolution:</strong> We undertake to exchange, repair, or refund via gift vouchers, subject to verification. The response time for addressing complaints is a maximum of 7 working days.
                  </p>
                  <p>
                    <strong>Sale Items:</strong> Products bought from exhibition sales or at {">"}50% discount are sold on a "bought as seen" basis. They carry a limited 6-month warranty for manufacturing defects and 1-year for borer infestation.
                  </p>
                  <p>
                    <strong>Hardware:</strong> Warranty on hardware (bolts, hinges, etc.) is 6 months.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Upholstery & Custom Items */}
            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="p-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" /> Upholstered Products
                  </h3>
                  <p className="text-sm text-gray-600">
                    Requests against stains or damage to fabric upholstery must be informed <strong>immediately upon delivery</strong> (within 24 hours) and endorsed by the delivery team on the feedback form or via email to <a href="mailto:mailus@SSBN.net" className="text-blue-600 underline">mailus@SSBN.net</a>.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Hammer className="w-4 h-4 text-gray-600" /> Customized Furniture
                  </h3>
                  <p className="text-sm text-gray-600">
                    Customized products can only be exchanged, replaced, or refunded in case of a verified manufacturing defect or borer infestation. Standard return policies for preference do not apply.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Section B: Exclusions */}
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold text-gray-900">B. What is NOT Covered?</h2>
            <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-sm text-gray-700 space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>Fabrics and leathers (unless explicitly mentioned).</li>
                <li>Normal wear and tear, aging, or damage due to intended use.</li>
                <li>Damage from improper installation by a third party, improper storage, or misuse.</li>
                <li>Water damage, discoloration due to sunlight exposure.</li>
                <li>Breakages to glass, mirrors, or stone tops <strong>after</strong> delivery confirmation.</li>
              </ul>
            </div>
          </section>

          {/* Section C & D: Delivery & Misc */}
          <section className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-semibold text-gray-900 flex items-center gap-2">
                <Truck className="w-5 h-5" /> Delivery & Transit Damage
              </h2>
              <div className="text-sm text-gray-600 space-y-3">
                <p>
                  We test our packaging to ensure safety. However, if a product is damaged during transportation, we will replace it within <strong>48 hours</strong> of receiving notification and confirmation from our representative (subject to availability).
                </p>
                <p>
                  <strong>Note:</strong> We deliver furniture only up to one flight of stairs in the absence of a service elevator. Manual movement beyond this is at the customer's sole risk.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-serif font-semibold text-gray-900 flex items-center gap-2">
                <Info className="w-5 h-5" /> Miscellaneous
              </h2>
              <div className="text-sm text-gray-600 space-y-3">
                <p>
                  SSBN’s liability is limited to the purchase price of the defective product. We are not liable for indirect damages or financial losses.
                </p>
                <p>
                  For warranty claims or feedback, please write to <a href="mailto:mailus@SSBN.net" className="text-blue-600 underline">mailus@SSBN.net</a>.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Product Care Section */}
          <section className="bg-slate-50 p-8 rounded-xl border border-slate-100">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Droplets className="w-6 h-6 text-blue-500" /> Product Care Guide
            </h2>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Wood, Stone, Metal & Leather</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                  <li>Dust regularly with a soft duster.</li>
                  <li>Clean with a slightly damp, non-abrasive sponge if necessary (test on a hidden area first). Wipe dry immediately.</li>
                  <li><strong>Avoid</strong> wax-based products.</li>
                  <li>Avoid direct exposure to heat, AC vents, sunlight, or rain.</li>
                  <li>Do not place hot/cold drinks directly on wooden surfaces.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Soft Furnishings</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium text-gray-800">Non-removable:</span>
                    <p>In case of spillage, contact a professional cleaner immediately to avoid damaging the fabric.</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Removable Covers:</span>
                    <p>We recommend dry cleaning to maintain quality. Some products may be machine washed at 30°C if specified on the label.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}