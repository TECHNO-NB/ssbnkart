// app/contact-us/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Upload, Phone, Mail, MapPin, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactUsPage() {
  // Simple state to handle form reset visuals
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    subject: "",
    description: "",
  });

  const handleReset = () => {
    setFormData({ email: "", name: "", subject: "", description: "" });
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        
        {/* --- Breadcrumb --- */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center space-x-2 text-sm text-gray-500"
        >
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Contact Us</span>
        </nav>

        {/* --- Intro Section --- */}
        <div className="space-y-6 mb-12">
          <h1 className="text-3xl font-serif font-bold text-[#581c1c] md:text-4xl">
            Contact Us
          </h1>
          
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              If you have a question or a comment, please call us on{" "}
              <strong className="text-gray-900">1800-100-1212</strong> (9.00am to 6.00pm. Monday to Saturday.) or email us at{" "}
              <a href="mailto:support@SSBN.net" className="text-[#581c1c] hover:underline font-medium">
                support@SSBN.net
              </a>{" "}
              or use the form below to contact us.
            </p>
            <p>
              For any concerns regarding fabcoins, please call us at{" "}
              <strong className="text-gray-900">1800-100-1212</strong> (10.00am to 7.00pm. Monday to Saturday.) or email us at{" "}
              <a href="mailto:fabfamily@SSBN.net" className="text-[#581c1c] hover:underline font-medium">
                fabfamily@SSBN.net
              </a>
            </p>
          </div>
        </div>

        {/* --- Contact Form --- */}
        <div className="max-w-2xl mb-16">
          <form className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-600 font-normal">Email*</Label>
              <Input 
                id="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="border-gray-300 focus-visible:ring-[#581c1c]" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-600 font-normal">Name*</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="border-gray-300 focus-visible:ring-[#581c1c]" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-gray-600 font-normal">Subject</Label>
              <Input 
                id="subject" 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="border-gray-300 focus-visible:ring-[#581c1c]" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-600 font-normal">Description*</Label>
              <Textarea 
                id="description" 
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="border-gray-300 focus-visible:ring-[#581c1c] resize-y" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachment" className="text-gray-600 font-normal">Attachment</Label>
              <div className="flex items-center gap-3">
                <Input id="attachment" type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#581c1c]/10 file:text-[#581c1c] hover:file:bg-[#581c1c]/20" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Each of your file(s) can be up to 20MB in size.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" className="w-32 bg-[#d4d4d4] hover:bg-[#581c1c] text-white transition-colors">
                Submit
              </Button>
              <Button 
                type="button" 
                onClick={handleReset}
                variant="outline" 
                className="w-32 border-[#581c1c] text-[#581c1c] hover:bg-[#581c1c] hover:text-white transition-colors"
              >
                Reset
              </Button>
            </div>
          </form>
        </div>

        {/* --- Quick Links Text --- */}
        <div className="space-y-3 mb-16 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              If you are looking for a SSBN store near you, please use our <Link href="/stores" className="text-[#581c1c] hover:underline">Stores page</Link>.
            </p>
            <p className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              If you or your company is interested in entering into a business relationship with us, please visit our <Link href="/business-enquiry" className="text-[#581c1c] hover:underline">Business Enquiries page</Link>.
            </p>
            <p className="italic text-gray-500 pt-2">
              We look forward to being of service.
            </p>
            <p className="italic text-gray-500">
              We endeavour to answer all questions within 48 hours.
            </p>
        </div>

        {/* --- Grievances Section --- */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <h2 className="text-xl font-serif font-bold text-[#581c1c] mb-6">
            Grievances (For online purchase only)
          </h2>
          
          <div className="space-y-6 text-sm text-gray-700">
            <p className="font-medium">
              Important : <span className="font-bold">Grievance cell</span> must be approached post contacting the 'Customer Support' of SSBN where desired resolution were not served.
            </p>
            
            <p>
              Any direct communication to Grievance cell will be redirected to 'Customer support' for further assistance
            </p>
            
            <div className="bg-white p-6 rounded border border-gray-100 shadow-sm">
              <p className="mb-4">
                All Grievances related to the purchase or services shall be addressed to the Grievance officer– <strong className="text-gray-900">Ms. Ritu Rawat</strong>
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#581c1c]" />
                  <span>Write us to <a href="mailto:grievances@SSBN.net" className="text-[#581c1c] hover:underline">grievances@SSBN.net</a></span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#581c1c]" />
                  <span>Call <strong className="text-gray-900">1800-100-1212</strong> (timings 9am to 6pm Monday to Saturday)</span>
                </li>
              </ul>
            </div>

            <ul className="list-disc pl-5 space-y-2 text-gray-600 text-xs">
              <li>*The officer will get back to the customer within 3 business days of reporting an issue</li>
              <li>*Every grievance will be provided with a complaint/ticket no. which can used to track the status of the grievance</li>
              <li>*Redress or closure to a grievance might take around one month from the date of receipt of complaint</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}