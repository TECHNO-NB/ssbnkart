// app/customer-service/page.tsx

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Mail,
  ShoppingCart,
  CreditCard,
  Truck,
  FileText,
  RefreshCw,
  HelpCircle,
  Scissors,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SERVICE_LINKS = [
  {
    title: "CONTACT US",
    desc: "Got a question or a comment? Write to us.",
    icon: Mail,
    href: "/contact-us",
  },
  {
    title: "HOW TO ORDER",
    desc: "Ordering from www.SSBN.com, a step-by-step guide",
    icon: ShoppingCart,
    href: "/how-to-order",
  },
  {
    title: "BILLINGS & PAYMENTS",
    desc: "Got a question or a comment? Write to us.",
    icon: CreditCard,
    href: "/billing-payments",
  },
  {
    title: "SHIPPING & DELIVERY",
    desc: "Domestic & International shipping. Delivery methods, times and costs.",
    icon: Truck,
    href: "/shipping-delivery",
  },
  {
    title: "TRACK YOUR ORDER",
    desc: "Your order status with us and tracking your shipment.",
    icon: FileText,
    href: "/order-tracking",
  },
  {
    title: "RETURNS & EXCHANGES",
    desc: "Returning goods, exchanging them, or claiming a refund.",
    icon: RefreshCw,
    href: "/returns-exchanges",
  },
  {
    title: "FAQ'S",
    desc: "Questions frequently asked by our customers.",
    icon: HelpCircle,
    href: "/faqs",
  },
  {
    title: "FABRIC CARE",
    desc: "Caring for your handmade SSBN product.",
    icon: Scissors,
    href: "/fabric-care",
  },
];

export default function CustomerServicePage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center space-x-2 text-sm text-gray-500"
        >
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Customer Service</span>
        </nav>

        {/* Header */}
        <h1 className="mb-10 border-b border-gray-200 pb-4 text-2xl font-medium text-gray-800">
          Customer Service
        </h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {SERVICE_LINKS.map((item, idx) => (
            <Link key={idx} href={item.href} className="group h-full">
              <Card className="h-full border border-gray-200 shadow-none transition-all duration-300 hover:shadow-lg hover:border-gray-300">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                  
                  {/* Icon */}
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-700 transition-colors group-hover:bg-[#fdf3f3] group-hover:text-[#581c1c]">
                    <item.icon className="h-8 w-8" strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-lg font-bold uppercase tracking-wide text-[#581c1c] transition-colors group-hover:text-[#8c2b2b]">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[250px]">
                    {item.desc}
                  </p>

                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}