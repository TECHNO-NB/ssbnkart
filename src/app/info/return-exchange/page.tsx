// app/returns-exchanges/page.tsx

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  RefreshCcw,
  AlertCircle,
  Truck,
  CreditCard,
  Ban,
  Scissors,
  Globe,
  Phone,
  Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ReturnsExchangesPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- Breadcrumb --- */}
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Returns & Exchanges</span>
        </nav>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        
        {/* --- Header & Handcrafted Philosophy --- */}
        <div className="mb-10 text-center">
          <h1 className="mb-6 font-serif text-3xl font-bold text-[#581c1c] md:text-4xl">
            Returns & Exchanges
          </h1>
          
          <div className="bg-[#faf9f6] p-8 rounded-lg border border-[#eaddcf] relative overflow-hidden">
            {/* Decorative Icon Background */}
            <Scissors className="absolute -right-6 -bottom-6 w-32 h-32 text-[#581c1c]/5" />
            
            <h3 className="text-lg font-serif font-semibold text-[#581c1c] mb-3">
              The Beauty of Handcrafted
            </h3>
            <p className="text-gray-700 italic leading-relaxed">
              "All our products are handcrafted by traditional craft persons in rural India, resulting in each product being unique. An irregular weave, print, or stitch should not be taken as a defect. Handloom, by definition, means a glorious uncertainty when it comes to uniformity."
            </p>
          </div>
        </div>

        {/* --- General Policy --- */}
        <section className="mb-12 space-y-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 bg-[#fdf3f3] p-2 rounded-full text-[#581c1c]">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">
                General Policy
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Despite variables in handcrafted goods, we stand behind our quality. We allow exchange/return/refund (for eligible categories) if you are not satisfied.
              </p>
              
              <Alert className="bg-blue-50 border-blue-100 mb-4">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 font-medium">Policy Scope</AlertTitle>
                <AlertDescription className="text-blue-700 text-xs mt-1">
                  Applicable only on Domestic Orders placed via www.SSBN.com. Not applicable for offline stores or third-party platforms.
                </AlertDescription>
              </Alert>

              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <span className="font-bold text-2xl text-[#581c1c]">15</span>
                    <span className="text-sm text-gray-600">Days to return/exchange from delivery date.</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <span className="font-bold text-2xl text-[#581c1c]">48</span>
                    <span className="text-sm text-gray-600">Hours to report damaged/missing items.</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* --- Non-Returnable Items --- */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Ban className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-serif font-bold text-gray-900">
              Non-Returnable / Non-Exchangeable
            </h2>
          </div>
          
          <div className="bg-red-50 border border-red-100 rounded-lg p-6">
            <p className="text-sm text-red-800 mb-4 font-medium">
              Returns are <span className="underline">Not Eligible</span> if the SSBN Tag loop seal is broken or tampered. The following categories are excluded:
            </p>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-sm text-gray-700 list-disc pl-4">
              <li>Saris</li>
              <li>Shawls, Mufflers, Stoles</li>
              <li>Dupattas</li>
              <li>Bags, Belts & Wallets</li>
              <li>Furniture</li>
              <li>Organic Food</li>
              <li>Personal Care / Beauty</li>
              <li>Lighting & Decor</li>
              <li>Tableware & Kitchen</li>
              <li>Stationery & Gift Boxes</li>
              <li>Prepacked Gifts</li>
              <li>Customized Products</li>
              <li>Custom Kurtas</li>
              <li>Jewelry</li>
              <li>Innerwear</li>
              <li>Upholstery Fabrics</li>
            </ul>
            <p className="text-xs text-gray-500 mt-4 italic">
              * Exchange for these items is considered only in case of verified manufacturing defects.
            </p>
          </div>
        </section>

        {/* --- Reverse Pick Up --- */}
        <section className="mb-12">
           <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#581c1c]" /> Reverse Pick Up Policy
          </h2>

          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>
              We offer a hassle-free, free-of-cost Reverse Pick-up policy. Please mention your <strong>Order Number</strong> in the subject line of your request.
            </p>
            
            <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
              <h4 className="font-semibold text-gray-900 mb-2">The Process:</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Pack items securely to prevent damage.</li>
                <li>Pickup will occur within <strong>5 business days</strong> of request.</li>
                <li>If there is a discrepancy with the pickup, inform Customer Support within 24-48 hours.</li>
                <li>Refunds/Exchanges processed after receipt of items.</li>
                <li>For exchanges, new order dispatched within 3-5 business days of receipt.</li>
              </ol>
            </div>

            <p className="text-xs text-gray-500">
              * If your pin code is not feasible for reverse pick up, you must self-ship the item. We are not liable if self-shipped packages are lost in transit.
            </p>
          </div>
        </section>

        {/* --- International Returns --- */}
        <section className="mb-12">
          <Card className="border-[#581c1c]/20 shadow-sm">
            <CardHeader className="bg-[#fdf3f3] border-b border-[#581c1c]/10">
              <CardTitle className="text-lg font-serif text-[#581c1c] flex items-center gap-2">
                <Globe className="w-5 h-5" /> International Returns
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-sm text-gray-700 space-y-4">
              <p>
                <strong>We do not offer reverse pick facility outside India.</strong> In case of wrong product or defects, the customer must self-ship the product to SSBN.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-white p-4 border rounded-md">
                  <h5 className="font-bold text-gray-900 mb-2">US & Canada Return Address:</h5>
                  <p className="text-gray-600">
                    SSBN LIMITED<br />
                    75 Torrington Ave<br />
                    Canton, CT06019<br />
                    USA
                  </p>
                </div>
                <div className="bg-white p-4 border rounded-md">
                  <h5 className="font-bold text-gray-900 mb-2">Other Countries:</h5>
                  <p className="text-gray-600">
                    Please return to the address mentioned on your <strong>original invoice</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-red-50 p-3 rounded text-red-800 text-xs">
                <strong>No Refunds for International Shipments if:</strong> Incorrect address provided, 3 failed delivery attempts, or package refused by recipient.
              </div>
            </CardContent>
          </Card>
        </section>

        {/* --- Refunds --- */}
        <section className="mb-12">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#581c1c]" /> Claiming Refunds
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">Prepaid Orders</h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                <li>Refunds credited back to original mode of payment (Credit Card/Net Banking/PayPal).</li>
                <li>Banks typically take <strong>4-5 business days</strong> to process refunds once initiated.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">COD Orders</h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                <li>Refunds via <strong>E-Gift Card</strong> or <strong>NEFT</strong> to bank account.</li>
                <li><strong>No Cash Refunds allowed.</strong></li>
                <li>NEFT transfers take 7-8 business days (subject to QC clearance).</li>
                <li>Bank account name must match the customer name.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- Contact Bar --- */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-gray-900">Need help with a return?</h4>
            <p className="text-sm text-gray-500">Contact us within 15 days of delivery.</p>
          </div>
          <div className="flex gap-4">
             <a href="tel:18001001212" className="flex items-center gap-2 text-[#581c1c] font-medium hover:underline">
               <Phone className="w-4 h-4" /> 1800-100-1212
             </a>
             <span className="text-gray-300">|</span>
             <a href="mailto:support@SSBN.net" className="flex items-center gap-2 text-[#581c1c] font-medium hover:underline">
               <Mail className="w-4 h-4" /> support@SSBN.net
             </a>
          </div>
        </div>

      </div>
    </div>
  );
}