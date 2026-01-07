"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

import { motion } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Loader2, 
  Mail, 
  Lock 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import imgFile  from "@/../public/LoginPageImage.jpeg"
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
//   const dispatch = useDispatch();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      // 1. API Call
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        toast.success("Welcome back!");

        if(response.data.data.role==="ADMIN"){
          router.push("/admin")
        }
    
        router.push("/");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      const errorMessage = error.response?.data?.message || "Invalid email or password.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  
  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      
      {/* --- LEFT SIDE: Visual Storytelling (Desktop Only) --- */}
      <div className="hidden lg:block relative h-full bg-stone-900">
        
        <Image 
          src={imgFile} 
          fill
          priority
          alt="Artisan Weaving" 
          className="w-full h-full object-cover object-center opacity-100"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
        
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-4xl font-serif mb-4">Crafted for the Modern Soul.</h2>
          <p className="text-lg text-white/80 font-light leading-relaxed max-w-md">
            Join our community to access exclusive collections, track your artisanal finds, and celebrate the legacy of Indian craftsmanship.
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: Login Form --- */}
      <div className="flex flex-col justify-center items-center p-8 bg-[#faf9f6] relative">
        
        {/* Back to Home Link */}
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-gray-500 hover:text-[#581c1c] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif text-[#581c1c]">Welcome Back</h1>
            <p className="text-muted-foreground">Please enter your details to sign in.</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="email" 
                  placeholder="name@example.com" 
                  type="email" 
                  autoCapitalize="none" 
                  autoComplete="email" 
                  autoCorrect="off" 
                  className="pl-10 bg-white"
                  required 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-medium text-[#581c1c] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  className="pl-10 pr-10 bg-white"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="data-[state=checked]:bg-[#581c1c] data-[state=checked]:border-[#581c1c]" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
              >
                Remember me for 30 days
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#581c1c] hover:bg-[#4a1717] h-11 text-base" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="flex items-center gap-4 w-full">
             <Separator className="flex-1" />
             <span className="text-xs text-muted-foreground uppercase">Or</span>
             <Separator className="flex-1" />
          </div>

          
          <div className="text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <Link href="/auth/register" className="font-medium text-[#581c1c] hover:underline">
              Join the SSBNFamily
            </Link>
          </div>
        </motion.div>

        {/* Footer Note */}
        <p className="absolute bottom-6 text-xs text-gray-400 text-center px-4">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}