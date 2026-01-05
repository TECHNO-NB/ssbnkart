// app/careers/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Briefcase,
  Clock,
  Users,
  Search,
  Mail,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// --- Job Data ---
const JOBS = [
  {
    title: "Category Planner",
    dept: "Apparel",
    location: "Head Office (Faridabad)",
    vacancy: 1,
    exp: "4-5 Years",
    skills: [
      "Knowledge of Markets & Geographies",
      "Commercial Accumen",
      "Category Planning skills",
      "Inventory Management skills",
      "Handle Retail Operations",
      "Proficient in MS Office & SAP",
    ],
  },
  {
    title: "Customer Relationship Associate/Executive",
    dept: "Markets",
    location: "Chandigarh, Chennai, Indore, Morjim, Mumbai, Panjim, Patna, Pune",
    vacancy: 23,
    exp: "Freshers/ 1-3 Years",
    skills: [
      "Strong communicator with excellent selling ability",
      "Positive attitude, quick learning mindset",
      "Good product knowledge",
      "Collaborative team approach",
      "Active listening and problem solving attitude",
    ],
  },
  {
    title: "Fixed Asset Management",
    dept: "Finance",
    location: "Head Office (Faridabad)",
    vacancy: 1,
    exp: "4-5 Years",
    skills: [
      "Experience in Fixed assets accounting",
      "Proficiency in ERP/SAP",
      "Strong knowledge of accounting principles and depreciation methods",
    ],
  },
  {
    title: "Manager - SAP Retail MM",
    dept: "IT",
    location: "Head Office (Faridabad)",
    vacancy: 1,
    exp: "6-8 Years",
    skills: [
      "Proficient in core SAP MM Configuration & Enhancement",
      "IS Retail Specific Knowledge (Merchandise Mgmt)",
      "Procurement & Inventory Management processes",
      "Expertise in Pricing & Condition Technique",
      "System Integration & Testing",
    ],
  },
  {
    title: "Product Merchandiser",
    dept: "Apparel",
    location: "Head Office (Faridabad)",
    vacancy: 1,
    exp: "4-5 Years",
    skills: [
      "Specific product knowledge related to Mens categories",
      "Data mining and analysis (High Volume)",
      "Retail functions & KPIs (Sales, Product/Category Mgmt)",
      "Experience in multi-category retail / F&B preferred",
      "Advanced Excel & PowerPoint skills",
    ],
  },
  {
    title: "QC Executive",
    dept: "Markets",
    location: "Faridabad, Indore",
    vacancy: 2,
    exp: "5-8 Years",
    skills: [
      "Product Knowledge of Apparels",
      "Quality control aspects and parameters for apparel",
      "Experience of retail business or large export house preferred",
    ],
  },
  {
    title: "Section Incharge/Senior Section Incharge",
    dept: "Markets",
    location: "Ahmedabad, Chennai, Morjim, Panjim, Bengaluru",
    vacancy: 5,
    exp: "6-8 Years",
    skills: [
      "Capable of managing all aspects of store operations",
      "Able to manage stock levels and inventory procedures",
      "Successfully drive and achieve sales targets",
      "Team Management",
    ],
  },
  {
    title: "Store Incharge/Store Manager",
    dept: "Markets",
    location: "Bengaluru, Raipur",
    vacancy: 2,
    exp: "6-8 Years",
    skills: [
      "Drive Business Growth",
      "Managing retail operations",
      "Ability to sell products and services",
      "Effective team Management skills",
    ],
  },
  {
    title: "Studio Sales Incharge",
    dept: "Markets",
    location: "Bengaluru, Dehradun, Guwahati, Kochi, Kolkata, Mumbai, Panchkula, Pune",
    vacancy: 9,
    exp: "3-4 Years",
    skills: [
      "Expertise in furniture sales",
      "Proven lead Generation Capabilities",
      "Strong business development acumen",
      "Knowledge of interior design concepts",
    ],
  },
  {
    title: "Manager - 3P",
    dept: "Ecommerce",
    location: "Head Office (Faridabad)",
    vacancy: 1,
    exp: "5-8 Years",
    skills: [
      "Strategic planning and Market place expansion",
      "Partnership development and management",
      "Brand Engagement and Positioning on Marketplace platforms",
    ],
  },
  {
    title: "Influencer Marketing",
    dept: "Ecommerce",
    location: "Head Office (Faridabad)",
    vacancy: 1,
    exp: "5-7 Years",
    skills: [
      "Boosting brand engagement through visuals and UGC",
      "Plan and execute YouTube tutorials and lookbooks",
      "Creating short-form, trend-driven video content",
      "Interactive content creation (Polls, Q&As)",
    ],
  },
  {
    title: "Graphic Designer - (UI/UX) Motion Graphics",
    dept: "Ecommerce",
    location: "Head Office (Faridabad)",
    vacancy: 1,
    exp: "5-7 Years",
    skills: [
      "Visual Design & Concept Development",
      "Web & App Design (Photoshop)",
      "Marketing Collateral Creation",
      "End-to-End Design Execution",
    ],
  },
  {
    title: "Creative & Product Shoot Lead",
    dept: "Ecommerce",
    location: "Head Office (Faridabad)",
    vacancy: 1,
    exp: "5-7 Years",
    skills: [
      "Directing styling, model selection, visual mood",
      "Adobe Creative Suite & advanced image-editing",
      "Art direction for creative catalogue shoots",
      "Shoot budgets & production coordination",
    ],
  },
  {
    title: "Senior Executive – Social Media",
    dept: "Brand & Marketing",
    location: "Head Office (Faridabad)",
    vacancy: 1,
    exp: "2-4 Years",
    skills: [
      "Social Media Content Planning & Execution",
      "Content Scheduling & Timely Rollouts",
      "Campaign Performance Tracking & KPI Analysis",
      "Engagement Management",
    ],
  },
  {
    title: "Partnership Lead",
    dept: "Customer Experience",
    location: "Head Office (Faridabad)",
    vacancy: 1,
    exp: "3-5 Years",
    skills: [
      "Rewards Partner Management",
      "Loyalty Program Strategy (Fabfamily & Fabcoin)",
      "Campaign Collateral Creation",
      "Data-Driven Program Optimization",
    ],
  },
  {
    title: "Senior Graphic Designer",
    dept: "Brand & Marketing",
    location: "Head Office",
    vacancy: 1,
    exp: "2-4 Years",
    skills: [
      "Strong HTML skillsets and digital marketing",
      "Knack in creative & innovative design",
      "Pro in Visual Ideation",
      "Corel Draw",
    ],
  },
];

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  // Get unique departments
  const departments = ["All", ...Array.from(new Set(JOBS.map((j) => j.dept)))];

  // Filter Jobs
  const filteredJobs = JOBS.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = selectedDept === "All" || job.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- Breadcrumb --- */}
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Careers</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        
        {/* --- Header --- */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold text-[#581c1c]">
            Careers at SSBN
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            SSBN offers careers for fresh graduates, as well as individuals with work experience. Join us in celebrating craft and community.
          </p>
        </div>

        {/* --- Filters --- */}
        <div className="mb-10 flex flex-col items-center gap-6 rounded-xl bg-gray-50 p-6 md:flex-row md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search by role or skill..." 
              className="pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedDept === dept
                    ? "bg-[#581c1c] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-200"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* --- Job Grid --- */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job, idx) => (
            <Card key={idx} className="group border-gray-200 transition-all hover:border-[#581c1c] hover:shadow-md flex flex-col">
              <CardHeader className="bg-gray-50/50 pb-4">
                <div className="mb-2 flex items-start justify-between">
                  <Badge variant="outline" className="bg-white text-[#581c1c] border-[#581c1c]/20">
                    {job.dept}
                  </Badge>
                  {job.vacancy > 1 && (
                     <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {job.vacancy} Openings
                     </span>
                  )}
                </div>
                <CardTitle className="font-serif text-xl text-gray-900 group-hover:text-[#581c1c]">
                  {job.title}
                </CardTitle>
                <CardDescription className="flex flex-col gap-1.5 pt-2">
                  <span className="flex items-center gap-2 text-xs">
                    <MapPin className="h-3.5 w-3.5" /> {job.location}
                  </span>
                  <span className="flex items-center gap-2 text-xs">
                    <Clock className="h-3.5 w-3.5" /> {job.exp} Experience
                  </span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6 flex-1 flex flex-col">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Key Skills
                </h4>
                <ul className="mb-6 space-y-2 text-sm text-gray-600 flex-1">
                  {job.skills.slice(0, 4).map((skill, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#581c1c]" />
                      <span className="leading-tight">{skill}</span>
                    </li>
                  ))}
                  {job.skills.length > 4 && (
                    <li className="text-xs text-gray-400 italic pl-5">
                      + {job.skills.length - 4} more skills
                    </li>
                  )}
                </ul>

                <Button className="w-full bg-[#581c1c] hover:bg-[#4a1717]" asChild>
                    <a href={`mailto:careers@SSBN.net?subject=Application for ${job.title}`}>
                       Apply Now
                    </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* --- Application Footer --- */}
        <div className="mt-16 rounded-xl bg-[#581c1c] p-8 text-center text-white md:p-12">
          <Mail className="mx-auto mb-4 h-12 w-12 opacity-80" />
          <h2 className="mb-4 text-2xl font-bold">Don't see a suitable role?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-white/90">
            If your qualifications meet our requirements, we will get back to you. Else, we maintain a database of applications, and will contact you when a vacancy arises.
          </p>
          <Button variant="secondary" size="lg" className="font-semibold" asChild>
            <a href="mailto:careers@SSBN.net">
              Send Resume to careers@SSBN.net
            </a>
          </Button>
        </div>

        {/* --- Disclaimer --- */}
        <div className="mt-12 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 flex-shrink-0 text-yellow-600" />
            <div className="space-y-2">
              <h3 className="font-bold text-yellow-800">Recruitment Fraud Warning</h3>
              <p className="text-sm text-yellow-900/80 leading-relaxed">
                SSBN Limited ("SSBN") <strong>does not charge any fee</strong> at any stage of its recruitment or internship process. Please do not ever share your personal details/bank account details/or pay any commission or fees to any person/firm/company claiming to be a representative of SSBN and inform SSBN immediately. If anyone is trying to influence you to believe otherwise, please disregard and reach out to us directly.
              </p>
              <p className="text-sm text-yellow-900/80">
                SSBN shall not be responsible for any such promise/proposal/commitment by any such third party.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}