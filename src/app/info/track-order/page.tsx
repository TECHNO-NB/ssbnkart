// app/order-tracking/page.tsx

import { ChevronRight, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function OrderTrackingPage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center space-x-2 text-sm text-gray-500"
        >
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Order Tracking</span>
        </nav>

        {/* Main Content */}
        <div className="bg-[#fafaf9] p-6 md:p-10">
          <h1 className="mb-4 text-2xl font-semibold text-gray-900 md:text-3xl">
            Track Your Order
          </h1>
          <p className="mb-6 text-base text-gray-700">
            Thank you for shopping online with SSBN!
          </p>
          <p className="mb-6 text-base text-gray-700">
            From confirmation of your order by SSBN to receipt of the package
            at your doorstep, you can track the status of your order - online. When
            you place your order on SSBN.com, you will receive an order
            confirmation email with a link to our website. Bookmark this link, for
            it contains information about the status of your order, and is
            constantly updated.
          </p>

          <h2 className="mb-4 text-xl font-semibold text-gray-900 md:text-2xl">
            Track Your Shipment
          </h2>
          <p className="mb-6 text-base text-gray-700">
            When your order is shipped from our warehouse, you will receive a
            Shipment email informing you about the items that were shipped, the
            Courier used to ship these items, the Courier's website address, and a
            tracking number. Please visit the courier company's website, and use
            the tracking number to know the status of your shipment.
          </p>

          <div className="flex flex-col space-y-4 text-base text-gray-700 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-red-600" />
              <span>
                If you have not received a shipment email with these details, please
                email us at{" "}
                <a
                  href="mailto:support@SSBN.net"
                  className="font-medium text-red-600 hover:underline"
                >
                  support@SSBN.net
                </a>
              </span>
            </div>
            <div className="hidden h-5 w-px bg-gray-300 md:block"></div>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-red-600" />
              <span>
                or call us at{" "}
                <a
                  href="tel:18001001212"
                  className="font-medium text-red-600 hover:underline"
                >
                  1800-100-1212
                </a>{" "}
                (9.00 am to 6.00 pm. Monday to Saturday) and let us know.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}