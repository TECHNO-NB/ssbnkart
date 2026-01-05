// app/terms-of-use/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, FileText, Scroll, AlertCircle, Scale, Shield, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Navigation Items
const SECTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "privacy", label: "Privacy" },
  { id: "communications", label: "Electronic Communications" },
  { id: "copyright", label: "Copyright & Trademarks" },
  { id: "access", label: "Site Access" },
  { id: "account", label: "Your Account" },
  { id: "content", label: "Reviews & Content" },
  { id: "product", label: "Product & Pricing" },
  { id: "shipping", label: "Shipping & Delivery" },
  { id: "returns", label: "Returns & Refunds" },
  { id: "warranty", label: "Disclaimer of Warranties" },
  { id: "legal", label: "Applicable Law & Disputes" },
  { id: "contact", label: "Contact Information" },
  { id: "giftcards", label: "Gift Cards T&C" },
];

export default function TermsOfUsePage() {
  const [activeSection, setActiveSection] = useState("introduction");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- Breadcrumb --- */}
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Terms of Use</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 flex flex-col md:flex-row gap-12">
        
        {/* --- Sidebar Navigation --- */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-1">
            <h3 className="font-serif text-xl font-bold text-[#581c1c] mb-4 px-3">Table of Contents</h3>
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  activeSection === section.id
                    ? "bg-[#581c1c]/10 text-[#581c1c] font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </aside>

        {/* --- Main Content --- */}
        <div className="flex-1 space-y-12">
          
          <div className="border-b border-gray-200 pb-8">
            <h1 className="font-serif text-3xl font-bold text-[#581c1c] mb-4">Terms of Use</h1>
            <p className="text-gray-600">Last Updated: December 2024</p>
          </div>

          {/* Introduction */}
          <section id="introduction" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Welcome to SSBN.com</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Welcome to SSBN.com and its affiliates provide their services to you subject to the following conditions. If you visit or shop at SSBN.com, you accept these conditions. Please read them carefully. In addition, when you use any current or future SSBN.com service or visit or purchase from any business affiliated with SSBN.com, whether or not included in the SSBN.com Web site, you also will be subject to the guidelines and conditions applicable to such service or business.
            </p>
          </section>

          {/* Privacy */}
          <section id="privacy" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#581c1c]" />
              <h2 className="text-xl font-bold text-gray-900">Privacy</h2>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Please review our <Link href="/privacy-policy" className="text-[#581c1c] hover:underline">Privacy Policy</Link>, which also governs your visit to SSBN.com, to understand our practices.
            </p>
          </section>

          {/* Electronic Communications */}
          <section id="communications" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Electronic Communications</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              When you visit SSBN.com or send e-mails to us, you are communicating with us electronically. You consent to receive communications from us electronically. We will communicate with you by e-mail or by posting notices on this site. You agree that all agreements, notices, disclosures and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.
            </p>
          </section>

          {/* Copyright & Trademarks */}
          <section id="copyright" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2">
              <Scroll className="w-5 h-5 text-[#581c1c]" />
              <h2 className="text-xl font-bold text-gray-900">Copyright & Trademarks</h2>
            </div>
            <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
              <p>
                <strong>Copyright:</strong> All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of SSBN.com or its content suppliers. The compilation of all content on this site is the exclusive property of SSBN.com.
              </p>
              <p>
                <strong>Trademarks:</strong> SSBN has filed its application for registration under the Trade and Merchandise Act and Rules at Delhi under different classes and awaiting registration. Any violation of our trademarks will be liable for legal action.
              </p>
            </div>
          </section>

          {/* Site Access */}
          <section id="access" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Site Access</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              SSBN.com grants you a limited permission to access and make personal use of this site and not to download (other than page caching) or modify it, or any portion of it. This permission does not include any resale or commercial use of this site or its contents; any collection and use of any product listings, descriptions, or prices; any derivative use of this site or its contents; any downloading or copying of account information for the benefit of another merchant; or any use of data mining, robots, or similar data gathering and extraction tools.
            </p>
          </section>

          {/* Your Account */}
          <section id="account" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Your Account</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you use this site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password. SSBN.com reserves the right to refuse service, terminate accounts, remove or edit content, or cancel orders in their sole discretion.
            </p>
          </section>

          {/* Reviews & Content */}
          <section id="content" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Reviews, Comments, Communications, And Other Content</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Visitors may post reviews, comments, and other content; send e-Gift Certificates and other communications; and submit suggestions, ideas, comments, questions, or other information, so long as the content is not illegal, obscene, threatening, defamatory, invasive of privacy, infringing of intellectual property rights, or otherwise injurious to third parties.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you do post content or submit material, and unless we indicate otherwise, you grant SSBN.com a nonexclusive, royalty-free, perpetual, irrevocable, and fully sub licensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content throughout the world in any media.
            </p>
          </section>

          <Separator />

          {/* Product & Pricing */}
          <section id="product" className="scroll-mt-24 space-y-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#581c1c]" />
              <h2 className="text-xl font-bold text-gray-900">Product Descriptions & Pricing</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-50 border-none">
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-bold text-gray-800">Product Accuracy</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    SSBN.com attempts to be as accurate as possible. However, we do not warrant that product descriptions are accurate, complete, reliable, current, or error-free. If a product offered is not as described, your sole remedy is to return it in unused condition.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 border-none">
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-bold text-gray-800">Pricing Policy</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Despite our best efforts, a small number of items may be mispriced. If an item's correct price is lower than our stated price, we will charge the lower amount. If higher, we will contact you for instructions or cancel your order.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">Sizing & Product Properties</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>Handcrafted Nature:</strong> All SSBN products are handcrafted using natural fibres. Subtle variations in colour, texture, and finish are intrinsic to handmade products. An irregular weave or print is not a defect.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>Colors:</strong> We have done our best to display colours accurately. However, your monitor's display may vary. Reds and blues tend to run; always wash like colours together.
              </p>
            </div>
          </section>

          {/* Shipping */}
          <section id="shipping" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Shipping & Delivery</h2>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2 leading-relaxed">
              <li>All orders shipped from New Delhi, India via UPS.</li>
              <li>Processing takes 2 working days; shipping takes 4-6 working days.</li>
              <li>We do not ship backorders. Out of stock items will be refunded.</li>
              <li>We cannot ship to P.O. Box addresses.</li>
              <li>UPS will attempt delivery 3 times before returning the package.</li>
              <li><strong>Duties & Taxes:</strong> International customers may be subject to import duties/taxes, which are the responsibility of the customer.</li>
            </ul>
          </section>

          {/* Returns */}
          <section id="returns" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Exchanges, Returns And Refunds</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              SSBN will replace the product free of cost if you are not satisfied with your purchase. Exchanges or returns must be made within <strong>15 days</strong> of receiving your order. Shipping charges will not be refunded, and customers are required to pay for return shipping costs to the US return address.
            </p>
          </section>

          <Separator />

          {/* Warranty & Liability */}
          <section id="warranty" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Disclaimer Of Warranties And Limitation Of Liability</h2>
            </div>
            <div className="bg-red-50 p-6 rounded-lg text-sm text-gray-700 space-y-4 leading-relaxed border border-red-100">
              <p>
                This site is provided by SSBN.com on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied.
              </p>
              <p>
                To the full extent permissible by applicable law, SSBN.com disclaims all warranties, express or implied. We will not be liable for any damages of any kind arising from the use of this site.
              </p>
              <p>
                <strong>Indemnification:</strong> You agree to defend, indemnify and hold SSBN harmless from any claims arising from your use of the site.
              </p>
            </div>
          </section>

          {/* Legal */}
          <section id="legal" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#581c1c]" />
              <h2 className="text-xl font-bold text-gray-900">Applicable Law & Disputes</h2>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              By visiting SSBN.com, you agree that the laws of India, under the jurisdiction of the Delhi High Court, will govern these Conditions of Use. Any dispute shall be submitted to confidential arbitration in New Delhi, India.
            </p>
          </section>

          {/* Contact Info */}
          <section id="contact" className="scroll-mt-24 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-bold text-gray-800">Corporate Office</h3>
                <p className="text-sm text-gray-600">
                  L&T Business Park, Tower 2, 3rd Floor, Sector 27D,<br/>
                  Faridabad, Haryana-121003, India
                </p>
                <p className="text-sm text-gray-600">Tel: +91 011 40692000</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-gray-800">Grievances</h3>
                <p className="text-sm text-gray-600">
                  Officer: Ms. Ritu Rawat<br/>
                  Email: <a href="mailto:grievances@SSBN.net" className="text-[#581c1c] underline">grievances@SSBN.net</a><br/>
                  Call: 1800-100-1212 (9am - 6pm, Mon-Sat)
                </p>
              </div>
            </div>
          </section>

          {/* Gift Cards */}
          <section id="giftcards" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">FabGift Cards T&C</h2>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2 leading-relaxed">
              <li>Redeemable across all SSBN Stores within India and SSBN.com.</li>
              <li>Valid for 1 year from date of purchase.</li>
              <li>Cannot be exchanged for cash.</li>
              <li>Lost cards will not be replaced or refunded.</li>
              <li>Disputes subject to Delhi Jurisdiction.</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}