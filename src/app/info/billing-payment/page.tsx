// app/billing-payment/page.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  CreditCard,
  Smartphone,
  Globe,
  Wallet,
  Landmark,
  Lock,
  Gift,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function BillingPaymentPage() {
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
          <span className="font-medium text-gray-900">Billing & Payment</span>
        </nav>

        {/* Header Section */}
        <div className="mb-10 border-b border-gray-100 pb-8">
          <h1 className="text-3xl font-serif font-bold text-[#581c1c] md:text-4xl mb-4">
            Billing & Payment
          </h1>
          
          <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-900 leading-relaxed">
            <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>
              SSBN enables online verification and authorisation of payments
              through three payment services: the CCAvenue payment gateway, PayU
              payment gateway, and through PayPal. SSBN.com is a Verisign
              secured site with 128 bit SSL encryption.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          
          {/* Section A: CCAvenue / PayU */}
          <section>
            <h2 className="text-xl font-serif font-semibold text-gray-900 mb-6 flex items-center gap-2">
              A. Accepted Payment Methods (CCAvenue / PayU)
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              
              <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fdf3f3] flex items-center justify-center text-[#581c1c]">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="font-medium text-gray-900">Credit & Debit Cards</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Domestic and International Visa, MasterCard, American Express credit cards. Debit cards issued by most major banks.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fdf3f3] flex items-center justify-center text-[#581c1c]">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <h3 className="font-medium text-gray-900">Net Banking</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We allow net banking transactions from nearly 50 major Indian banks.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fdf3f3] flex items-center justify-center text-[#581c1c]">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="font-medium text-gray-900">UPI & GPay</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Seamless payments via Unified Payments Interface (UPI) and Google Pay.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fdf3f3] flex items-center justify-center text-[#581c1c]">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <h3 className="font-medium text-gray-900">Wallets</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Freecharge, Airtel Money, Amazon Pay, PhonePe, Amex ezeClick, Oxygen, Olamoney, Jio Money, HDFC PayZapp, etc.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fdf3f3] flex items-center justify-center text-[#581c1c]">
                    <Gift className="w-5 h-5" />
                  </div>
                  <h3 className="font-medium text-gray-900">Loyalty Points</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Redeem your SSBN loyalty points during checkout.
                  </p>
                </CardContent>
              </Card>

            </div>

            <p className="mt-4 text-xs text-gray-500 italic">
              <strong>Note:</strong> Your billing amount will be shown in Indian Rupees on the payment gateway. This is equivalent to your order value.
            </p>
          </section>

          <Separator />

          {/* Section B: PayPal */}
          <section>
            <h2 className="text-xl font-serif font-semibold text-gray-900 mb-6 flex items-center gap-2">
              B. PayPal Payments
            </h2>
            
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-[#003087] font-bold text-lg mb-2">
                    <Globe className="w-6 h-6" /> International Orders
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    SSBN also accepts payments made via PayPal. International customers can pay from their PayPal account if they have one.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    They can also choose to use their credit card to pay if they do not have a PayPal account.
                  </p>
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded inline-block font-medium">
                    This option is not available to Indian residents as per RBI regulations.
                  </p>
                </div>

                {/* Logos Visual Representation */}
                <div className="flex-1 w-full max-w-sm bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-6">
                  {/* PayPal Logo Text Placeholder */}
                  <span className="text-4xl font-bold italic text-[#003087]">PayPal</span>
                  
                  {/* Card Logos Row */}
                  <div className="flex items-center justify-center gap-4 opacity-80">
                     <div className="h-8 w-12 bg-orange-500 rounded flex items-center justify-center text-[10px] text-white font-bold">MC</div>
                     <div className="h-8 w-12 bg-blue-700 rounded flex items-center justify-center text-[10px] text-white font-bold">VISA</div>
                     <div className="h-8 w-12 bg-orange-400 rounded flex items-center justify-center text-[10px] text-white font-bold">DISC</div>
                     <div className="h-8 w-12 bg-blue-500 rounded flex items-center justify-center text-[10px] text-white font-bold">AMEX</div>
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