// app/shipping-delivery/page.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Truck,
  Globe,
  Clock,
  AlertCircle,
  Plane,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ShippingDeliveryPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- Breadcrumb --- */}
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Shipping & Delivery</span>
        </nav>
      </div>

      {/* --- Hero Image Section --- */}
      <div className="relative mx-auto mt-6 h-[300px] w-full max-w-6xl overflow-hidden md:h-[400px]">
        {/* Placeholder image resembling the artisan/craft context */}
        <Image
          src="https://images.unsplash.com/photo-1629079447846-57474c37956d?auto=format&fit=crop&q=80&w=2000"
          alt="Artisan weaving"
          fill
          className="object-cover"
        />
        
        {/* Quote Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 p-4">
          <div className="relative max-w-2xl bg-white/90 p-8 text-center shadow-lg backdrop-blur-sm">
            {/* Yellow Accent Line */}
            <div className="absolute left-1/2 top-0 h-1 w-16 -translate-x-1/2 bg-yellow-400"></div>
            
            <p className="font-serif text-lg italic text-gray-800 md:text-xl">
              "Our community means a whole lot to us... We are grateful for your
              support and so happy that you continue to be a part of our Fab
              community."
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        
        {/* --- Intro Section --- */}
        <div className="mb-10 border-b border-gray-200 pb-8">
          <h1 className="mb-4 font-serif text-3xl font-bold text-[#581c1c]">
            Shipping & Delivery
          </h1>
          <p className="text-gray-700 leading-relaxed">
            At SSBN, our aim is to ship our products in a quick, safe and
            inexpensive manner. We deliver to <strong>130 countries worldwide</strong>,
            and to <strong>511 destinations within India</strong>.
          </p>
        </div>

        {/* --- Processing Section --- */}
        <section className="mb-12 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#581c1c]" />
            <h2 className="text-xl font-semibold text-gray-900">
              Processing your order
            </h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            We try our best to ship goods to you as soon as possible. On average,
            it takes us about <strong>2 business days</strong> to ship goods out of our warehouses
            across India. However, if the quantities ordered are more than 5
            pieces per product per style, or if the item ordered is under
            production, it may take longer to process your order. Should this
            happen, we will keep you informed by email.
          </p>
        </section>

        {/* --- Delivery Methods Table --- */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5 text-[#581c1c]" />
            <h2 className="text-xl font-semibold text-gray-900">
              Delivery methods, Times & Cost
            </h2>
          </div>
          
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[150px] font-bold text-gray-900">Shipping Destination</TableHead>
                  <TableHead className="font-bold text-gray-900">Shipping Service</TableHead>
                  <TableHead className="w-[120px] font-bold text-gray-900">Dispatch Times</TableHead>
                  <TableHead className="font-bold text-gray-900">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Within India</TableCell>
                  <TableCell>Domestic shipping companies</TableCell>
                  <TableCell>2 business days</TableCell>
                  <TableCell className="text-gray-600">
                    A single flat rate of INR 99 for orders below INR 1000. All
                    orders above INR 1000 qualify for free shipping.
                  </TableCell>
                </TableRow>
                <TableRow className="bg-gray-50/50">
                  <TableCell className="font-medium">International</TableCell>
                  <TableCell>DHL / FEDEX</TableCell>
                  <TableCell>10 business days</TableCell>
                  <TableCell className="text-gray-600">
                    A single flat rate of USD 20 for orders below USD 100. All
                    orders above USD 100 qualify for free shipping.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            * To calculate total time, please add the shipping times given above to the 2 business day order processing period.
          </p>
        </section>

        {/* --- Customs & International Section --- */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#581c1c]" />
            <h2 className="text-xl font-semibold text-gray-900">
              Customs & International Orders
            </h2>
          </div>
          
          <Card className="border-none bg-slate-50">
            <CardContent className="p-6 text-sm text-gray-700 space-y-4 text-justify leading-relaxed">
              <p>
                All of SSBN orders are shipped internationally from our
                warehouses across India to your provided shipping address via
                DHL/FEDEX. Due to the nature of international shipping,
                occasionally a customer may have to pay additional import duties
                and taxes which are levied once a shipment reaches your country.
              </p>
              <p>
                The large majority of orders will not have to pay any additional
                fees. However, we are unable to calculate when and how much these
                infrequent customs duty charges will be levied. In the case where
                additional customs charges are assessed, you will be responsible
                for paying these additional fees.
              </p>
              
              <Alert className="bg-white border-orange-200">
                <Plane className="h-4 w-4 text-orange-600" />
                <AlertTitle className="text-orange-800">Seamless Experience</AlertTitle>
                <AlertDescription className="text-gray-600">
                  To make your shopping experience as seamless as possible, we have
                  arranged with DHL/FEDEX to customs clear your goods for you and
                  deliver them to your doorstep. If you are presented with an
                  invoice from DHL/FEDEX for import duties and taxes, you will
                  have to pay DHL/FEDEX directly at the time of delivery.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="mt-8 flex items-center justify-center">
            <Link 
              href="/faqs" 
              className="group flex items-center gap-2 text-sm font-medium text-[#581c1c] hover:underline"
            >
              For more information, please see our Shipping FAQs
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}