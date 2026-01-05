// app/store-locator/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Search,
  Globe,
  Store,
  Coffee,
  Scissors,
  Armchair,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// --- DATA ---
const POPULAR_CITIES = [
  "Bengaluru",
  "New Delhi",
  "Mumbai",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Gurugram",
  "Pune",
  "Ahmedabad",
  "Kochi",
  "Jaipur",
  "Lucknow",
  "Noida",
  "Chandigarh",
  "Patna",
];

const ALL_CITIES = {
  A: [
    "Agartala",
    "Agra",
    "Aizawl",
    "Ajmer",
    "Alappuzha",
    "Aligarh",
    "Alwar",
    "Amritsar",
    "Anand",
  ],
  B: [
    "Balasore",
    "Bareilly",
    "Bathinda",
    "Begusarai",
    "Belagavi",
    "Bhopal",
    "Bhubaneswar",
    "Bhuj",
    "Bilaspur",
  ],
  C: ["Coimbatore", "Cuttack"],
  D: ["Dehradun", "Dhanbad", "Dharamshala", "Dimapur", "Durgapur"],
  E: ["Ernakulam"],
  F: ["Faridabad"],
  G: ["Gangtok", "Ghaziabad", "Greater Noida", "Guntur", "Guwahati", "Gwalior"],
  H: ["Hanamkonda", "Haridwar", "Howrah", "Hubballi"],
  I: ["Idukki", "Imphal", "Indore", "Itanagar"],
  J: [
    "Jabalpur",
    "Jalandhar",
    "Jammu",
    "Jamnagar",
    "Jamshedpur",
    "Jhansi",
    "Jodhpur",
    "Jorhat",
  ],
  K: [
    "Kannur",
    "Kanpur",
    "Karnal",
    "Kolhapur",
    "Kollam",
    "Kota",
    "Kottayam",
    "Kozhikode",
  ],
  L: ["Ludhiana"],
  M: [
    "Madurai",
    "Malda",
    "Mandi",
    "Mangaluru",
    "Manipal",
    "Mapusa",
    "Margao",
    "Meerut",
    "Mohali",
    "Moradabad",
    "Mysore",
    "Mysuru",
  ],
  N: [
    "Nagpur",
    "Nainital",
    "Nashik",
    "Navi Mumbai",
    "Nilgiris",
    "North Goa",
    "North West Delhi",
  ],
  P: [
    "Palakkad",
    "Panaji",
    "Panchkula",
    "Pathankot",
    "Patiala",
    "Pimpri-Chinchwad",
    "Prayagraj",
    "Puducherry",
    "Purulia",
  ],
  R: [
    "Raipur",
    "Rajkot",
    "Ranchi",
    "Rangareddy",
    "Rishikesh",
    "Rohtak",
    "Roorkee",
    "Rourkela",
  ],
  S: [
    "Salem",
    "Sangli",
    "Saroornagar",
    "Secunderabad",
    "Siliguri",
    "Solan",
    "Sri Sathya Sai",
    "Srinagar",
    "Surat",
  ],
  T: [
    "Tehri Garhwal",
    "Tezpur",
    "Thane",
    "Thiruvalla",
    "Thiruvananthapuram",
    "Thrissur",
    "Tiruvannamalai",
  ],
  U: ["Udaipur", "Ujjain"],
  V: ["Vadodara", "Vapi", "Varanasi", "Vellore", "Vijayawada", "Visakhapatnam"],
  Y: ["Yamuna Nagar"],
  Z: ["Zirakpur"],
};

const INTERNATIONAL_LOCATIONS = [
  { city: "Dubai", country: "UAE" },
  { city: "Singapore", country: "Singapore" },
  { city: "Kuala Lumpur", country: "Malaysia" },
  { city: "Kathmandu", country: "Nepal" },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function StoreLocatorPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const scrollToSection = (letter: string) => {
    const element = document.getElementById(`city-section-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* --- Header Section --- */}
      <div className="bg-[#581c1c] text-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <nav className="mb-6 flex items-center space-x-2 text-xs md:text-sm text-white/60">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-white">Store Locator</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <h1 className="text-3xl md:text-5xl font-serif font-medium tracking-tight">
                Find a Store Near You
              </h1>
              <p className="text-white/80 text-lg leading-relaxed font-light">
                SSBN has a wide network of 340+ stores in 125+ cities across India
                and abroad. Experience our full product assortment, touch and feel
                the fabrics, and enjoy a premium shopping experience.
              </p>
              
              {/* Store Features Badges */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0 gap-1.5 px-3 py-1.5 font-normal">
                  <Store className="w-3.5 h-3.5" /> Experience Centres
                </Badge>
                <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0 gap-1.5 px-3 py-1.5 font-normal">
                  <Armchair className="w-3.5 h-3.5" /> Interior Design Studio
                </Badge>
                <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0 gap-1.5 px-3 py-1.5 font-normal">
                  <Scissors className="w-3.5 h-3.5" /> Alteration Studio
                </Badge>
                <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0 gap-1.5 px-3 py-1.5 font-normal">
                  <Coffee className="w-3.5 h-3.5" /> FabCafé
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8 -mt-8">
        <Tabs defaultValue="india" className="w-full">
          
          {/* --- Tab Navigation --- */}
          <Card className="border-none shadow-xl mb-12">
            <CardContent className="p-2">
              <TabsList className="grid w-full grid-cols-2 h-14 bg-gray-100/50 p-1">
                <TabsTrigger
                  value="india"
                  className="h-full text-base font-medium data-[state=active]:bg-white data-[state=active]:text-[#581c1c] data-[state=active]:shadow-sm rounded-md transition-all"
                >
                  India (348 Stores)
                </TabsTrigger>
                <TabsTrigger
                  value="international"
                  className="h-full text-base font-medium data-[state=active]:bg-white data-[state=active]:text-[#581c1c] data-[state=active]:shadow-sm rounded-md transition-all"
                >
                  International
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          {/* --- INDIA TAB CONTENT --- */}
          <TabsContent value="india" className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search for your city..." 
                className="pl-12 h-14 text-lg border-gray-200 shadow-sm rounded-full focus-visible:ring-[#581c1c]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Popular Cities */}
            {!searchQuery && (
              <section>
                <h2 className="text-xl font-serif text-[#581c1c] font-bold mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Popular Cities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {POPULAR_CITIES.map((city) => (
                    <Button
                      key={city}
                      variant="outline"
                      className="h-auto py-3 justify-start text-gray-600 hover:text-[#581c1c] hover:border-[#581c1c]/30 hover:bg-[#581c1c]/5"
                    >
                      {city}
                    </Button>
                  ))}
                </div>
              </section>
            )}

            {/* Alphabetical Directory */}
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-xl font-serif text-[#581c1c] font-bold">All Cities</h2>
                {/* Alphabet Sticky Bar */}
                <div className="hidden md:flex gap-1 flex-wrap justify-end">
                  {ALPHABET.map((letter) => {
                    // Check if this letter has cities
                    const hasCities = ALL_CITIES[letter as keyof typeof ALL_CITIES];
                    return (
                      <button
                        key={letter}
                        onClick={() => scrollToSection(letter)}
                        disabled={!hasCities}
                        className={`w-7 h-7 text-xs font-medium rounded-full transition-colors ${
                          hasCities
                            ? "hover:bg-[#581c1c] hover:text-white text-gray-600 cursor-pointer"
                            : "text-gray-300 cursor-default"
                        }`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* City Lists Grouped by Letter */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                {Object.entries(ALL_CITIES)
                  .filter(([_, cities]) => 
                    // Simple search filtering logic
                    !searchQuery || cities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map(([letter, cities]) => {
                    const filteredCities = searchQuery 
                      ? cities.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
                      : cities;

                    if (filteredCities.length === 0) return null;

                    return (
                      <div key={letter} id={`city-section-${letter}`} className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f4f1ea] text-[#581c1c] font-bold font-serif">
                            {letter}
                          </span>
                          <div className="h-px bg-gray-100 flex-1" />
                        </div>
                        <ul className="space-y-2">
                          {filteredCities.map((city) => (
                            <li key={city}>
                              <Link 
                                href={`/stores/${city.toLowerCase().replace(/ /g, '-')}`}
                                className="text-gray-600 hover:text-[#581c1c] hover:translate-x-1 transition-all inline-block text-sm py-1"
                              >
                                {city}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
              </div>
            </section>
          </TabsContent>

          {/* --- INTERNATIONAL TAB CONTENT --- */}
          <TabsContent value="international" className="pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-4xl mx-auto text-center space-y-12 pt-8">
              <div>
                <h2 className="text-3xl font-serif text-[#581c1c] mb-4">Global Presence</h2>
                <p className="text-gray-600 max-w-xl mx-auto">
                  Bringing the essence of India to the world. Visit our international outlets to experience handcrafted luxury.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {INTERNATIONAL_LOCATIONS.map((loc) => (
                  <Card key={loc.city} className="group hover:shadow-lg transition-all cursor-pointer border-[#581c1c]/10">
                    <CardContent className="p-6 flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-[#f4f1ea] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Globe className="w-8 h-8 text-[#581c1c]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-medium text-gray-900">{loc.city}</h3>
                        <p className="text-sm text-gray-500 mt-1">{loc.country}</p>
                      </div>
                      <Button variant="link" className="text-[#581c1c] p-0 h-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 inline-block">
                <p className="text-blue-900 text-sm font-medium">
                  More international locations are in the pipeline. Stay tuned!
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}