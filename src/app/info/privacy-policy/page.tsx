// app/privacy-policy/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Lock, Eye, Mail, FileText, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Navigation Items
const SECTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "collection", label: "Data Collection" },
  { id: "usage", label: "How Info Is Used" },
  { id: "sharing", label: "Information Sharing" },
  { id: "retention", label: "Data Retention" },
  { id: "protection", label: "Security & Protection" },
  { id: "california", label: "California Consumers" },
  { id: "rights", label: "Your Rights" },
  { id: "incentives", label: "Financial Incentives" },
  { id: "contact", label: "Contact Us" },
];

export default function PrivacyPolicyPage() {
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
          <span className="font-medium text-gray-900">Privacy Policy</span>
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
            <h1 className="font-serif text-3xl font-bold text-[#581c1c] mb-4">Privacy Policy</h1>
            <p className="text-gray-600">
              At SSBN, we value your concerns about online privacy & security while browsing and shopping at our website.
            </p>
          </div>

          {/* Introduction */}
          <section id="introduction" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Introduction</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              We make every effort to guarantee that the information you provide will not be misused. This Privacy Policy describes how SSBN manage personal information and respect your privacy. This policy may be amended from time to time.
            </p>
          </section>

          {/* Collection */}
          <section id="collection" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#581c1c]" />
              <h2 className="text-xl font-bold text-gray-900">Collection Of Personal Information</h2>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              As a visitor, you can engage in many activities without providing Personal Information. However, when you register or order products, we may collect contact info (name, phone, email, address) and profile info. By sharing your information, you agree to allow us and our partners to contact you via SMS, email, etc.
            </p>
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-sm text-blue-800">
              <strong>Cookies:</strong> We use our own and third-party cookies to improve our store and personalize content. Your use of the website indicates consent.
            </div>
          </section>

          {/* Usage */}
          <section id="usage" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">How Your Personal Information Is Used</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              SSBN collects information to provide services, comply with legal obligations, and improve offerings. We do not sell/rent your info except as disclosed.
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Process transactions and service orders.</li>
              <li>Respond to customer service requests.</li>
              <li>Administer accounts and promotions.</li>
              <li>Send product/service updates and special offers.</li>
              <li>Customize your experience and target offerings.</li>
              <li>Prevent illegal activities/violations of Terms.</li>
            </ul>
          </section>

          {/* Sharing */}
          <section id="sharing" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Information Sharing</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Service Providers:</strong> We use outside payment processors and other companies to perform services (billing, shipping). They only receive necessary data and must protect it consistent with this policy.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Legal Requirements:</strong> We may disclose data in response to lawful requests by public authorities, warrants, court orders, or for national security/law enforcement reasons.
            </p>
          </section>

          {/* Retention */}
          <section id="retention" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Data Retention & Updates</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-50 border-none">
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-bold text-gray-800">Retention</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    We retain info as long as your account is active or needed for services/legal obligations. To delete your account, contact <a href="mailto:support@SSBN.net" className="underline">support@SSBN.net</a>.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-slate-50 border-none">
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-bold text-gray-800">Updating Info</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Update info via "My Profile" or "My Account". We do not store credit card info in your profile. You may opt-out of promotional emails anytime.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Protection */}
          <section id="protection" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#581c1c]" />
              <h2 className="text-xl font-bold text-gray-900">Protection Of Your Personal Information</h2>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Your info resides on secure servers accessible only to selected personnel. Sensitive data (credit cards) is encrypted using transport layer security. While we strive for security, no Internet transmission is 100% secure.
            </p>
          </section>

          <Separator />

          {/* California Consumers */}
          <section id="california" className="scroll-mt-24 space-y-6">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">California Consumers (CCPA/CPRA)</h2>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4 text-sm text-gray-700">
              <p>
                If you reside in California, this section supplements our Privacy Policy. We disclose categories of info collected in the last 12 months (Identifiers, Commercial Info, Online Activity, etc.).
              </p>
              
              <h4 className="font-bold text-gray-900">Your Rights:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Right to Know:</strong> Request details on categories/specific pieces of data collected.</li>
                <li><strong>Right to Delete:</strong> Request deletion of your data (subject to exceptions).</li>
                <li><strong>Right to Correct:</strong> Request correction of inaccurate data.</li>
                <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising rights.</li>
                <li><strong>Right to Opt-Out:</strong> Opt-out of sharing info for behavioral targeted ads via Global Privacy Control signals.</li>
              </ul>

              <p className="text-xs italic text-gray-500">
                To submit a request, email <a href="mailto:support@SSBN.net" className="underline">support@SSBN.net</a> or call 1800-100-1212. We verify identity before processing.
              </p>
            </div>
          </section>

          {/* Financial Incentives */}
          <section id="incentives" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Notice of Financial Incentive</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              We provide discounts/coupons for members of our Rewards Program and mailing lists. Participation requires providing personal info. You may opt-in/out at any time. The value of customer data is related to the costs of our programs and marketing efforts.
            </p>
          </section>

          {/* Contact & Updates */}
          <section id="contact" className="scroll-mt-24 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Contact & Updates</h2>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Contact Us
                </h3>
                <p className="text-sm text-gray-600">
                  Email: <a href="mailto:support@SSBN.net" className="text-[#581c1c] underline">support@SSBN.net</a><br/>
                  (Subject: "PRIVACY POLICY")
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Head Office:</strong><br/>
                  C-40, 2nd Floor, Okhla Industrial Area, Phase -2<br/>
                  New Delhi- 110020, India.
                </p>
              </div>
              
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Policy Updates
                </h3>
                <p className="text-sm text-gray-600">
                  This policy may be updated periodically without prior notice. Significant changes will be notified on our website/apps with the update date.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}