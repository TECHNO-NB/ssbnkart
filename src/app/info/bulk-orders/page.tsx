// app/bulk-orders/page.tsx

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Mail,
  Globe,
  DollarSign,
  PackageX,
  CreditCard,
  Truck,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BulkOrdersPage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center space-x-2 text-sm text-gray-500"
        >
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Special / Bulk Orders</span>
        </nav>

        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-serif font-bold text-[#581c1c] md:text-4xl mb-4">
            Special & Bulk Orders
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Save money when you buy in bulk! We offer exclusive discounts on bulk
            orders depending on the product and total invoice amount.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          
          {/* Left Column: Information (Span 2) */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Value Props */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="border-none shadow-sm bg-stone-50">
                <CardHeader>
                  <DollarSign className="h-8 w-8 text-[#581c1c] mb-2" />
                  <CardTitle className="text-lg">Volume Discounts</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 text-sm leading-relaxed">
                  Discounts are available on total invoice value (excluding shipping).
                  Minimum value to be eligible is approximately <strong>USD $1,500</strong>.
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-stone-50">
                <CardHeader>
                  <Globe className="h-8 w-8 text-[#581c1c] mb-2" />
                  <CardTitle className="text-lg">Global Reach</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 text-sm leading-relaxed">
                  A bulk order can be placed by anyone from anywhere in the world
                  and will be delivered anywhere in the world.
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-stone-50">
                <CardHeader>
                  <PackageX className="h-8 w-8 text-[#581c1c] mb-2" />
                  <CardTitle className="text-lg">Custom Requests</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 text-sm leading-relaxed">
                  Request products not featured on the webstore. We can arrange to
                  send you images and possibly samples upon request.
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-stone-50">
                <CardHeader>
                  <Truck className="h-8 w-8 text-[#581c1c] mb-2" />
                  <CardTitle className="text-lg">Reliable Delivery</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 text-sm leading-relaxed">
                  Our team works hard to ensure your order arrives when and where you
                  need it, so you never miss important deadlines.
                </CardContent>
              </Card>
            </div>

            {/* Important Notice Alert */}
            <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-900">
              <Info className="h-4 w-4 text-red-900" />
              <AlertTitle>Important Return Policy</AlertTitle>
              <AlertDescription>
                Please note: Since we offer volume discounts, we <strong>cannot accept returns</strong> on bulk orders.
              </AlertDescription>
            </Alert>

            {/* Terms and Conditions Section */}
            <div className="pt-8">
              <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-6">
                Terms And Conditions
              </h2>
              <ul className="space-y-4 text-gray-600 text-sm list-disc pl-5 marker:text-[#581c1c]">
                <li>
                  <span className="font-medium text-gray-900">Pricing:</span> Prices quoted are FOB New Delhi, India. This means the price does not include shipping, customs duties, or additional taxes assessed at delivery.
                </li>
                <li>
                  <span className="font-medium text-gray-900">Shipping & Customs:</span> All shipments are sent via UPS/Blue Dart and cleared through customs/octroi by them. The customer is responsible for any additional customs duties or taxes.
                </li>
                <li>
                  <span className="font-medium text-gray-900">Payment:</span> All orders must be paid by credit card and pre-paid in full at the time of placing the order.
                </li>
                <li>
                  <span className="font-medium text-gray-900">Shipping Charges:</span> Once goods are ready to ship, the customer’s credit card will be billed for UPS/Blue Dart shipping charges prior to dispatch.
                </li>
                <li>
                  <span className="font-medium text-gray-900">Returns:</span> SSBN does not accept any returns for special orders.
                </li>
                <li>
                  <span className="font-medium text-gray-900">Samples & Swatches:</span> Costs for fabric swatches or product samples will be negotiated at the time of the transaction. Please inquire for details.
                </li>
                <li>
                  <span className="font-medium text-gray-900">Delivery Updates:</span> SSBN will ship as per the estimated date. If unforeseen delays occur, we will update you with a new expected delivery date immediately.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Contact CTA (Span 1) */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <Card className="border-[#581c1c]/10 shadow-lg overflow-hidden">
                <div className="h-2 bg-[#581c1c] w-full" />
                <CardHeader>
                  <CardTitle className="text-xl">Get Started</CardTitle>
                  <CardDescription>
                    Ready to place a bulk order? Reach out to us directly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Please email us with the following details:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Name & Company Name</li>
                      <li>Email & Phone Number</li>
                      <li>Shipping Address</li>
                      <li>Products of Interest</li>
                    </ul>
                  </div>

                  <Button className="w-full bg-[#581c1c] hover:bg-[#4a1717] text-white gap-2" asChild>
                    <a href="mailto:support@SSBN.net">
                      <Mail className="h-4 w-4" /> Email Support
                    </a>
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Once received, we will contact you with pricing and estimated shipping times.
                  </p>
                </CardContent>
              </Card>

              {/* Notification Box */}
              <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="text-blue-900 font-medium text-sm mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" /> Stay Updated
                </h4>
                <p className="text-blue-800 text-xs leading-relaxed">
                  Once registered as a bulk buyer, we can send you exclusive product promotion notifications if you prefer.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}