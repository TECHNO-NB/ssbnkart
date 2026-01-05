"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "+91",
    phoneNumber: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: ""
  });

  // Derived State for Validation
  const passwordsMatch = formData.password.length > 0 && formData.password === formData.confirmPassword;
  const passwordError = formData.confirmPassword.length > 0 && !passwordsMatch;

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle Select Changes (Gender, Phone Code)
  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    
    // Basic Validation
    if (passwordError) {
      toast.error("Passwords do not match");
      return;
    }
    if (!formData.gender) {
      toast.error("Please select a gender");
      return;
    }

    setIsLoading(true);

    try {
      // API Call
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`, {
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: `${formData.phoneCode} ${formData.phoneNumber}`,
        dob: formData.dob,
        gender: formData.gender,
        password: formData.password
      });

      if (response.data.success) {
        toast.success("Account created successfully!");
        router.push("/auth/login"); 
      }
    } catch (error: any) {
      // Handle Error
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full h-screen grid lg:grid-cols-2 overflow-hidden">
      
      {/* --- LEFT SIDE: Form (Scrollable) --- */}
      <div className="flex flex-col justify-center items-center p-6 md:p-10 bg-[#faf9f6] relative overflow-y-auto h-full">
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6 my-auto"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-serif text-[#581c1c]">Join the SSBNFamily</h1>
            <p className="text-muted-foreground">Create an account to unlock exclusive benefits.</p>
          </div>

          <div className="flex items-center gap-4 w-full">
             <Separator className="flex-1" />
             <span className="text-xs text-muted-foreground uppercase">Register with email</span>
             <Separator className="flex-1" />
          </div>

          {/* Registration Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            
            {/* ROW 1: Names */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                   <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                   <Input 
                     id="firstName" 
                     placeholder="Ananya" 
                     className="pl-9 bg-white" 
                     required 
                     value={formData.firstName}
                     onChange={handleChange}
                   />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Sharma" 
                  className="bg-white" 
                  required 
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ROW 2: Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="ananya@example.com" 
                  className="pl-9 bg-white" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ROW 3: Phone (Country Code + Number) */}
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="flex gap-2">
                <div className="w-[110px] flex-shrink-0">
                  <Select 
                    defaultValue="+91" 
                    onValueChange={(val) => handleSelectChange("phoneCode", val)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">IN +91</SelectItem>
                      <SelectItem value="+1">US +1</SelectItem>
                      <SelectItem value="+44">UK +44</SelectItem>
                      <SelectItem value="+971">UAE +971</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="phoneNumber"
                    type="tel" 
                    placeholder="98765 43210" 
                    className="pl-9 bg-white" 
                    required 
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* ROW 4: Gender & DOB */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select onValueChange={(val) => handleSelectChange("gender", val)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <div className="relative">
                   <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                   <Input 
                      id="dob" 
                      type="date" 
                      className="bg-white block w-full text-gray-900" 
                      required 
                      value={formData.dob}
                      onChange={handleChange}
                   />
                </div>
              </div>
            </div>

            {/* ROW 5: Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-9 bg-white" 
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    className={`pl-9 bg-white ${passwordError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {passwordsMatch && (
                     <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-600" />
                  )}
                  {passwordError && (
                     <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>
            
            {passwordError && <p className="text-xs text-red-500">Passwords do not match</p>}

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox id="terms" required className="mt-1 data-[state=checked]:bg-[#581c1c] data-[state=checked]:border-[#581c1c]" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none text-gray-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the <Link href="#" className="underline hover:text-[#581c1c]">Terms of Service</Link> and <Link href="#" className="underline hover:text-[#581c1c]">Privacy Policy</Link>.
                </label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#581c1c] hover:bg-[#4a1717] h-12 text-base mt-2" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-500">Already a member? </span>
            <Link href="/auth/login" className="font-medium text-[#581c1c] hover:underline">
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: Image (Desktop Only) --- */}
      <div className="hidden lg:block relative h-screen bg-[#581c1c]">
        <img 
          src="https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=1200&auto=format&fit=crop" 
          alt="Traditional Art" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        
        <div className="absolute top-1/2 left-12 right-12 -translate-y-1/2 text-white">
          <div className="border-l-4 border-[#d4c5b5] pl-6">
            <h2 className="text-5xl font-serif mb-6 leading-tight">Heritage <br/>Reimagined.</h2>
            <p className="text-xl text-white/90 font-light leading-relaxed max-w-lg">
              "Fabindia connects you to the roots of Indian craftsmanship. Every purchase supports a sustainable livelihood for rural artisans."
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}