// app/how-to-order/page.tsx

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Compass,
  UserPlus,
  ShoppingBag,
  Edit3,
  CreditCard,
  CheckCircle,
  Mail,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HowToOrderPage() {
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
          <span className="font-medium text-gray-900">How To Order</span>
        </nav>

        {/* Header Section */}
        <div className="mb-12 border-b border-gray-100 pb-8 text-center md:text-left">
          <h1 className="text-3xl font-serif font-bold text-[#581c1c] md:text-4xl mb-4">
            How To Order
          </h1>
          <p className="text-gray-600 max-w-3xl leading-relaxed">
            We have taken every step to ensure that your shopping experience at
            SSBN.com is as convenient and as intuitive as possible. If you
            have any comments or feedback, we greatly appreciate hearing from you.
          </p>
          <div className="mt-4 flex items-center justify-center md:justify-start gap-2 text-[#581c1c] font-medium">
            <Mail className="h-4 w-4" />
            <a href="mailto:support@SSBN.net" className="hover:underline">
              support@SSBN.net
            </a>
          </div>
        </div>

        {/* Steps Container */}
        <div className="space-y-12 relative">
          {/* Vertical Line for Timeline Effect (Hidden on mobile) */}
          <div className="hidden md:block absolute left-[27px] top-4 bottom-4 w-[2px] bg-gray-100 -z-10" />

          {/* Step 1: Browsing */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-[#fdf3f3] border-4 border-white shadow-sm z-10">
              <Compass className="w-6 h-6 text-[#581c1c]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-serif font-semibold text-gray-900 mb-3">
                1. Browsing The Online Store
              </h2>
              <Card className="border-gray-100 shadow-sm">
                <CardContent className="p-6 text-sm text-gray-600 space-y-3 leading-relaxed">
                  <p>
                    Your main guide is the <strong>main navigation menu</strong>{" "}
                    (Men, Women, Home, etc). Click on a category title to reach its
                    landing page, then select sub-categories to view products.
                  </p>
                  <p>
                    You can also hover over the menu to use the dropdowns directly.
                    Products can be sorted by price, popularity, discount, and
                    newness. Click an item to view details, swatches, and close-up
                    images.
                  </p>
                  <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <strong>Tip:</strong> Use the breadcrumb trail at the top of
                    product pages to easily navigate back to previous categories.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Step 2: Account */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-[#fdf3f3] border-4 border-white shadow-sm z-10">
              <UserPlus className="w-6 h-6 text-[#581c1c]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-serif font-semibold text-gray-900 mb-3">
                2. Setting Up An Account
              </h2>
              <Card className="border-gray-100 shadow-sm">
                <CardContent className="p-6 text-sm text-gray-600 space-y-3 leading-relaxed">
                  <p>
                    You <strong>do not</strong> need an account to shop, but creating
                    one allows you to enjoy value-added features.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>To set up an account, go to 'My Account'.</li>
                    <li>
                      You can shop as a <strong>Guest Shopper</strong> and sign up
                      during checkout if you wish.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Step 3: Adding to Cart */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-[#fdf3f3] border-4 border-white shadow-sm z-10">
              <ShoppingBag className="w-6 h-6 text-[#581c1c]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-serif font-semibold text-gray-900 mb-3">
                3. Adding Items To Cart
              </h2>
              <Card className="border-gray-100 shadow-sm">
                <CardContent className="p-6 text-sm text-gray-600 space-y-3 leading-relaxed">
                  <p>
                    Select your <strong>Color</strong>, <strong>Size</strong>, and{" "}
                    <strong>Quantity</strong>, then click <em>"Add to Cart"</em>.
                  </p>
                  <p>
                    A confirmation box will appear. You can continue shopping or
                    proceed to checkout at any time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Step 4: Reviewing Cart */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-[#fdf3f3] border-4 border-white shadow-sm z-10">
              <Edit3 className="w-6 h-6 text-[#581c1c]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-serif font-semibold text-gray-900 mb-3">
                4. Review & Modify
              </h2>
              <Card className="border-gray-100 shadow-sm">
                <CardContent className="p-6 text-sm text-gray-600 space-y-3 leading-relaxed">
                  <p>
                    You can review your cart at any time. Click the cross icon to
                    delete items, or use the <strong>+ / -</strong> buttons to
                    change quantities. Your order value recalculates automatically.
                  </p>
                  <p>
                    Click <strong>"Proceed to Pay"</strong> when you are ready.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Step 5: Checkout */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-[#fdf3f3] border-4 border-white shadow-sm z-10">
              <CreditCard className="w-6 h-6 text-[#581c1c]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-serif font-semibold text-gray-900 mb-3">
                5. Checkout & Payment
              </h2>
              <Card className="border-gray-100 shadow-sm">
                <CardContent className="p-6 text-sm text-gray-600 space-y-3 leading-relaxed">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Login/Guest:</strong> Login if registered to
                      auto-fill addresses, or manually enter details as a guest.
                    </li>
                    <li>
                      <strong>Address:</strong> Please note we{" "}
                      <span className="text-red-600 font-medium">
                        cannot ship to a Post Office Box
                      </span>.
                    </li>
                    <li>
                      <strong>Payment:</strong> Redirect to secure gateways
                      (CCAvenue/PayU for domestic, PayPal for international).
                      Enter card/bank details and submit.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Step 6: Success */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-green-50 border-4 border-white shadow-sm z-10">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-serif font-semibold text-gray-900 mb-3">
                6. Order Confirmation
              </h2>
              <div className="bg-green-50 p-6 rounded-lg border border-green-100 text-sm text-gray-700 leading-relaxed">
                <p className="mb-2">
                  <strong>Congratulations!</strong> Your payment is processed in
                  real-time. You will receive:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>An immediate confirmation email.</li>
                  <li>SMS and Email notifications at different shipping stages.</li>
                  <li>
                    A tracking number and courier link once the order is shipped.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}