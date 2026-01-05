// app/faqs/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  Gift,
  ShoppingBag
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- FAQ DATA ---
const FAQ_DATA = {
  about: {
    title: "About SSBN",
    questions: [
      { q: "Is SSBN an Indian company?", a: "Yes, SSBN is an Indian company established in 1960." },
      { q: "Where is SSBN's corporate office located?", a: "Our corporate office is located in New Delhi, India." },
      { q: "Where can I buy SSBN products in India?", a: "You can buy our products at any of our 300+ stores across India or online at SSBN.com." },
      { q: "Are SSBN products available internationally?", a: "Yes, we ship to over 100 countries worldwide. We also have stores in select international locations." },
      { q: "Are gift vouchers available at the stores?", a: "Yes, physical gift vouchers are available for purchase at our retail stores." }
    ]
  },
  products: {
    title: "About Our Products",
    questions: [
      { q: "Where are your manufacturing facilities located?", a: "We work with artisans and craftspeople across rural India rather than centralized factories." },
      { q: "Are all SSBN products handmade?", a: "The majority of our products are handcrafted by traditional artisans, making each piece unique." },
      { q: "Do SSBN sizes conform to international norms?", a: "Our sizes are designed for comfort. Please refer to our Size Guide on product pages for specific measurements." },
      { q: "What are the advantages of handloom fabrics?", a: "Handloom fabrics are breathable, eco-friendly, and support traditional artisan livelihoods." }
    ]
  },
  shopping: {
    title: "Shopping",
    questions: [
      { q: "How do I shop online?", a: "Simply browse categories, select your items, add them to the cart, and proceed to checkout." },
      { q: "How will I know if you have received my order?", a: "You will receive a confirmation email and SMS immediately after placing your order." },
      { q: "How do I check my order status?", a: "You can track your order in the 'My Orders' section of your account or use the 'Track Order' link." },
      { q: "Is it safe to use my credit card online at SSBN.com?", a: "Yes, we use 128-bit SSL encryption and secure payment gateways (CCAvenue/PayU) to ensure your data is safe." },
      { q: "What if an item is out of stock?", a: "If an item is out of stock, you can choose to be notified via email when it becomes available again." },
      { q: "Do I have to sign up for a SSBN account to buy something?", a: "No, you can check out as a guest, but creating an account offers benefits like order tracking and faster checkout." }
    ]
  },
  shipping: {
    title: "Shipping",
    questions: [
      { q: "Will I be charged for octroi or entry taxes in case of domestic shipping?", a: "No, domestic shipping charges include all applicable taxes." },
      { q: "How long will it take to receive my order?", a: "Domestic orders typically arrive in 3-7 business days. International orders take 7-14 business days." },
      { q: "Which countries do you ship to?", a: "We ship to over 100 countries including USA, UK, Canada, Australia, and UAE." },
      { q: "Do you offer expedited shipping?", a: "Currently, we offer standard shipping which is optimized for speed and safety." },
      { q: "How is my order shipped?", a: "We use reputed courier partners like BlueDart, Delhivery, DHL, and FedEx." },
      { q: "Do you ship backorders?", a: "Yes, if part of your order is available, we may ship it first and send the remaining items later." },
      { q: "Will everything ship together?", a: "We try to ship everything together, but items sourced from different warehouses may arrive in separate packages." },
      { q: "Can I ship different items in my order to different shipping addresses?", a: "No, you must place separate orders for different shipping addresses." },
      { q: "Can my order ship to a post office box?", a: "No, we require a physical address with a valid phone number for delivery." },
      { q: "What are the shipping costs?", a: "Shipping is free for orders above a certain value. For smaller orders, a flat fee applies." },
      { q: "Will I be charged for customs charges in case of international shipping?", a: "Yes, international customers are responsible for customs duties levied by their country." },
      { q: "How do I track my order?", a: "Use the tracking link sent to your email or visit the 'Track Order' page." },
      { q: "Can I change my shipping address after placing my order?", a: "You can only change the address if the order has not yet been shipped. Contact customer care immediately." },
      { q: "Why was my package undeliverable?", a: "This happens due to incorrect address, failed delivery attempts, or refusal to accept the package." },
      { q: "I have received a partial item/partial order or a tampered package. What should I do?", a: "Please do not accept tampered packages. Contact customer support within 48 hours." }
    ]
  },
  billing: {
    title: "Billing & Payments",
    questions: [
      { q: "In case the delivery destination is outside India will I be charged sales tax?", a: "You will not be charged Indian sales tax, but your country may levy import taxes." },
      { q: "What payment methods do you accept?", a: "We accept Credit/Debit cards, Net Banking, UPI, Wallets, and PayPal (International)." },
      { q: "When will my credit card be charged?", a: "Your card is charged immediately upon order confirmation." },
      { q: "What currency will my order be billed in?", a: "Orders are billed in INR (Indian Rupees). International customers will see the equivalent in their currency on their statement." },
      { q: "Can I change my billing address?", a: "Billing address cannot be changed after the order is placed for security reasons." },
      { q: "How does the COD (Cash on Delivery) payment option work?", a: "You pay cash to the courier upon delivery. COD is available only for select pin codes in India." }
    ]
  },
  service: {
    title: "Customer Service",
    questions: [
      { q: "How do I contact customer service?", a: "Email us at support@SSBN.net or call 1800-100-1212." },
      { q: "How do I remove my name from your email list?", a: "Click the 'Unsubscribe' link at the bottom of any promotional email." },
      { q: "Will you share my information with others?", a: "No, we respect your privacy and do not sell your data to third parties." },
      { q: "Can I email my order?", a: "For security reasons, we do not accept orders via email. Please order through the website." },
      { q: "Can I call in my order?", a: "We do not accept orders over the phone to protect your payment information." },
      { q: "If I have problems with my order, whom should I contact?", a: "Contact our Customer Care team immediately via email or phone." },
      { q: "How can I modify my order?", a: "Orders cannot be modified once placed. You may cancel (if not shipped) and place a new one." },
      { q: "How can I cancel my order?", a: "You can cancel via the 'My Orders' section before the item is shipped." }
    ]
  },
  returns: {
    title: "Returns & Exchanges",
    questions: [
      { q: "What is your return policy?", a: "You can return eligible items within 15 days of delivery. Custom items and personal care products are non-returnable." },
      { q: "When will I receive a refund for my returned products?", a: "Refunds are processed within 7-10 days after we receive the return shipment." },
      { q: "How do I exchange an item?", a: "Initiate an exchange request from 'My Orders' for size/color issues." }
    ]
  },
  gift: {
    title: "Gift Services",
    questions: [
      { q: "Can I have the product gift wrapped?", a: "Yes, gift wrapping is available for a nominal fee at checkout." },
      { q: "Can I include a gift message with the package?", a: "Yes, you can add a personalized message during checkout." },
      { q: "Do you have a gift registry?", a: "Currently, we do not support a gift registry feature." }
    ]
  },
  organic: {
    title: "Organic Food",
    questions: [
      { q: "Where can I buy SSBN organic food?", a: "Available at our stores and on our website under the 'Organic Food' section." },
      { q: "How does SSBN classify its different food products?", a: "We classify them as Certified Organic or Natural based on their certification status." },
      { q: "What is the thought behind SSBN organics?", a: "To provide healthy, chemical-free food while supporting sustainable farming practices." },
      { q: "How does organic certification work in India?", a: "Certification is granted by accredited bodies under NPOP (National Programme for Organic Production)." }
    ]
  },
  rbi: {
    title: "RBI Guidelines",
    questions: [
      { q: "What are the new RBI guidelines?", a: "RBI guidelines mandate that merchants cannot store customer card details to enhance security." },
      { q: "What does this mean to me as a SSBN customer?", a: "You will need to enter your card details for every transaction unless you 'Tokenize' your card." },
      { q: "Does this mean I have to enter my card details everytime I transact?", a: "Yes, unless you opt to save your card as a 'Token'." },
      { q: "What is tokenization?", a: "Tokenization replaces your actual card details with a unique code (Token) for secure transactions." },
      { q: "What is the benefit of tokenization?", a: "It enhances security by ensuring your actual card details are not exposed or stored by merchants." },
      { q: "What happens if I don't tokenize my card?", a: "You can still transact, but you must enter your full card details every time." },
      { q: "Do I need to tokenize every card I have separately?", a: "Yes, each card must be tokenized individually." },
      { q: "I have already tokenized my card on another website. Do I still need to tokenize on SSBN?", a: "Yes, tokens are specific to each merchant." },
      { q: "What is de-tokenization?", a: "It is the process of converting the token back to card details by the bank for payment processing." }
    ]
  }
};

export default function FAQsPage() {
  const [activeTab, setActiveTab] = useState("about");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQs based on search
  const filteredData = Object.entries(FAQ_DATA).reduce((acc, [key, section]) => {
    const filteredQuestions = section.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredQuestions.length > 0) {
      acc[key] = { ...section, questions: filteredQuestions };
    }
    return acc;
  }, {} as any);

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- Breadcrumb --- */}
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">FAQs</span>
        </nav>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        
        {/* --- Header --- */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif font-bold text-[#581c1c] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 mb-8">
            Find answers to common questions about our products, shipping, and more.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search for a question..." 
              className="pl-12 h-12 rounded-full border-gray-300 focus-visible:ring-[#581c1c]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* --- Tabs & Accordion Layout --- */}
        {searchQuery ? (
          // Search Results View
          <div className="space-y-8">
            {Object.keys(filteredData).length > 0 ? (
              Object.entries(filteredData).map(([key, section]: any) => (
                <div key={key} className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-[#581c1c] mb-4">{section.title}</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {section.questions.map((item: any, idx: number) => (
                      <AccordionItem key={idx} value={`${key}-${idx}`} className="border-b-gray-200">
                        <AccordionTrigger className="text-left text-gray-900 hover:text-[#581c1c]">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        ) : (
          // Tabbed View
          <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
              <TabsList className="h-auto bg-transparent p-0 gap-2 flex-wrap justify-center">
                {Object.keys(FAQ_DATA).map((key) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="data-[state=active]:bg-[#581c1c] data-[state=active]:text-white border border-gray-200 rounded-full px-6 py-2.5 text-sm font-medium transition-all"
                  >
                    {FAQ_DATA[key as keyof typeof FAQ_DATA].title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {Object.entries(FAQ_DATA).map(([key, section]) => (
              <TabsContent key={key} value={key} className="animate-in fade-in-50 duration-300">
                <Card className="border-none shadow-sm bg-white">
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif text-gray-900">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {section.questions.map((item, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`} className="border-b-gray-100">
                          <AccordionTrigger className="text-left font-medium text-gray-800 data-[state=open]:text-[#581c1c] py-4">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* --- Terms & Conditions Section --- */}
        <div className="mt-20 space-y-12">
          
          <h2 className="text-center font-serif text-2xl font-bold text-gray-900">
            Terms & Conditions
          </h2>

          {/* E-Gift Cards T&C */}
          <Card className="border-l-4 border-l-yellow-500 shadow-sm">
            <CardHeader className="bg-yellow-50/50 pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-yellow-800">
                <Gift className="w-5 h-5" /> Redeeming E-Gift Cards
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="grid md:grid-cols-2 gap-x-8 gap-y-2 list-disc pl-5 text-xs text-gray-600 leading-normal">
                <li>Denominated in Indian Rupees (INR).</li>
                <li>Valid for one year from the date of issue.</li>
                <li>Redeemable at participating stores and SSBN Website/App.</li>
                <li>Cannot be cancelled, refunded, or exchanged for cash.</li>
                <li>Must be redeemed in full; partial redemption not allowed.</li>
                <li>Activated immediately at the time of purchase.</li>
                <li>Not replaceable if lost or stolen.</li>
                <li>No returns allowed on products purchased using E-Gift Cards.</li>
                <li>Cannot combine with other discounts.</li>
                <li>Subject to jurisdiction of courts at Delhi.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Potli Offer T&C */}
          <Card className="border-l-4 border-l-[#581c1c] shadow-sm">
            <CardHeader className="bg-[#581c1c]/5 pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-[#581c1c]">
                <ShoppingBag className="w-5 h-5" /> Potli Offer T&Cs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="grid md:grid-cols-2 gap-x-8 gap-y-2 list-disc pl-5 text-xs text-gray-600 leading-normal">
                <li>Valid from 5th December onwards, till stocks last.</li>
                <li>Applicable on invoice value of ₹5000 and above (Domestic Stores only).</li>
                <li>Non-negotiable, non-returnable, and non-assignable.</li>
                <li>Free products are not eligible for reward points.</li>
                <li>One offer per fresh order; not valid for exchanges.</li>
                <li>Cannot be clubbed with other offers.</li>
                <li>No warranty on freebies in this offer.</li>
                <li>SSBN reserves the right to withdraw/cancel the offer anytime.</li>
                <li>Images are for representational purposes only.</li>
                <li>Subject to jurisdiction of courts of Delhi.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="bg-slate-100 p-6 rounded-lg text-xs text-gray-500 flex gap-4 items-start">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-slate-400" />
            <div className="space-y-2">
              <p className="font-bold text-gray-700">Disclaimer</p>
              <p>
                SSBN Limited does not send any direct email for collaboration/paid partnership to any person, nor call/message to ask for bank details, OTP, or any personal sensitive information. SSBN shall not be responsible for any loss or liability resulting from the actions of third parties.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}