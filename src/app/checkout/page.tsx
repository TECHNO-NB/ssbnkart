"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Lock,
  CreditCard,
  Truck,
  CheckCircle,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

// Note: Elements provider is kept if you want to use other Stripe features later, 
// but for Hosted Checkout (Sessions), it's not strictly necessary to wrap everything.
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

/* ================= STRIPE LOADER ================= */
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

/* ================= MAIN PAGE ================= */
export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [address, setAddress] = useState<any>(null);
  const [cartItem, setCartItem] = useState<any[]>([]);
  
  const userData = useSelector((state: any) => state.user);

  /* ===== FETCH CART ===== */
  const fetchCart = async () => {
    try {
      if (!userData?.id) return;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/${userData.id}`
      );

      const carts = res?.data?.data?.getAllCartItems || [];
      const items = carts.flatMap((c: any) => c.items);
      setCartItem(items);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  /* ===== FETCH ADDRESS ===== */
  const fetchAddress = async () => {
    try {
      if (!userData?.id) return;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/address/one/${userData.id}`
      );
      setAddress(res?.data.data);
    } catch (error) {
      console.error("Failed to fetch address", error);
    }
  };

  useEffect(() => {
    if (userData?.id) {
      fetchCart();
      fetchAddress();
    }
  }, [userData?.id]);

  /* ===== PRICE CALCULATION ===== */
  const subtotal = cartItem.reduce((sum, item) => {
    const base = Number(item.product.price);
    const diff = Number(item.productVariant?.priceDiff || 0);
    return sum + (base + diff) * item.quantity;
  }, 0);

  const shipping = subtotal > 100 ? 0 : 20;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  /* ===== HANDLE COD ORDER ===== */
  const handleCodOrder = async () => {
    if (!address?.id) {
      toast.error("Please save your delivery address first.");
      setStep(1);
      return;
    }

    setIsProcessing(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/checkout/cod/${userData.id}`,
        {
          addressId: address.id,
          totalAmount: total,
        }
      );

      if (res.status === 201 || res.data.success) {
        setIsSuccess(true);
        toast.success("Order placed successfully!");
      }
    } catch (error: any) {
      console.error("COD Error:", error);
      const msg = error.response?.data?.message || "Failed to place order";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  /* ===== HANDLE STRIPE REDIRECT ===== */
  const handleStripeRedirect = async () => {
    if (!address?.id) {
      toast.error("Please save your delivery address first.");
      setStep(1);
      return;
    }

    setIsProcessing(true);
    try {
      // Call your backend controller to create session
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/checkout/create-stripe-session`,
        {
            userId: userData.id, // Optional if handled by middleware
            // You can pass addressId here if you want to link it in metadata
        }
      );

      if (res.data && res.data.status.url) {
         window.location.href = res.data.status.url;
      } else {
        toast.error("Failed to start payment session");
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error("Stripe Error:", error);
      toast.error("Payment initiation failed");
      setIsProcessing(false);
    }
  };

  if (isSuccess) return <SuccessView />;

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-[#faf9f6]">
        {/* HEADER */}
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl text-[#581c1c]">
              SSBN
            </Link>
            <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 px-3 py-1 rounded-full">
              <Lock className="w-3 h-3" /> Secure Checkout
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-6">
            <ContactFormStep 
                step={step} 
                setStep={setStep} 
                address={address} 
                refreshAddress={fetchAddress} 
            />
            <DeliveryStep 
                step={step} 
                setStep={setStep} 
                shippingCost={shipping} 
            />
            <PaymentStep
              step={step}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              total={total}
              isProcessing={isProcessing}
              onPlaceCodOrder={handleCodOrder}
              onStripeRedirect={handleStripeRedirect}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <OrderSummary
                cartItem={cartItem}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
              />
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
}

/* ================= CONTACT FORM ================= */
function ContactFormStep({ step, setStep, address, refreshAddress }: any) {
  const [addressId, setAddressId] = useState<string | null>(null);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"HOME" | "WORK">("HOME");
  const [isDefault, setIsDefault] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  
  const userData = useSelector((state: any) => state.user);

  useEffect(() => {
    if (address) {
      setAddressId(address.id ?? null);
      setStreet(address.street ?? "");
      setCity(address.city ?? "");
      setState(address.state ?? "");
      setZipCode(address.zipCode ?? "");
      setCountry(address.country ?? "");
      setPhone(address.phone ?? "");
      setType(address.type ?? "HOME");
      setIsDefault(Boolean(address.isDefault));
      setEmail(address.email ?? "");
      setFullName(address.fullName ?? "");
    }
  }, [address]);

  const handleContinue = async () => {
    try {
      if (!email || !fullName || !street || !city || !zipCode) {
        toast.error("Please fill in all required fields.");
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/address/${userData?.id}`,
        {
          addressId,
          street,
          city,
          state,
          zipCode,
          country,
          phone,
          type,
          isDefault,
          email,
          fullName,
        }
      );
      
      if (refreshAddress) await refreshAddress();
      setStep(2);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
    }
  };

  const firstName = fullName.split(" ")[0] || "";
  const lastName = fullName.split(" ").slice(1).join(" ") || "";

  return (
    <div className={`bg-white p-6 rounded-xl border shadow-sm transition-opacity duration-300 ${step !== 1 && "opacity-60 grayscale pointer-events-none"}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-serif font-medium flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#581c1c] text-white text-xs">1</span>
          Contact & Shipping
        </h2>
        {step > 1 && (
          <Button variant="link" onClick={() => setStep(1)} className="text-[#581c1c] text-xs pointer-events-auto">Edit</Button>
        )}
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Form Fields (Simplified for brevity, same as before) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={firstName} onChange={(e) => setFullName(`${e.target.value} ${lastName}`.trim())} />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={lastName} onChange={(e) => setFullName(`${firstName} ${e.target.value}`.trim())} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>State</Label>
              <Input value={state} onChange={(e) => setState(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Street</Label>
              <Input value={street} onChange={(e) => setStreet(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Zip Code</Label>
              <Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>City</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </div>

          <Button onClick={handleContinue} className="w-full bg-[#581c1c] hover:bg-[#4a1717] mt-4 text-white">
            Continue to Shipping
          </Button>
        </motion.div>
      )}
    </div>
  );
}

/* ================= DELIVERY ================= */
function DeliveryStep({ step, setStep, shippingCost }: any) {
  return (
    <div className={`bg-white p-6 rounded-xl border shadow-sm transition-opacity duration-300 ${step !== 2 && "opacity-60 grayscale pointer-events-none"}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-serif font-medium flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#581c1c] text-white text-xs">2</span>
          Delivery Method
        </h2>
        {step > 2 && (
          <Button variant="link" onClick={() => setStep(2)} className="text-[#581c1c] text-xs pointer-events-auto">Edit</Button>
        )}
      </div>

      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <RadioGroup defaultValue="standard">
            <div className="flex justify-between items-center border p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="cursor-pointer font-medium">Standard Delivery</Label>
              </div>
              <span className="font-medium text-[#581c1c]">
                {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
          </RadioGroup>
          <Button onClick={() => setStep(3)} className="mt-4 bg-[#581c1c] hover:bg-[#4a1717] w-full text-white">
            Continue to Payment
          </Button>
        </motion.div>
      )}
    </div>
  );
}

/* ================= PAYMENT ================= */
function PaymentStep({
  step,
  paymentMethod,
  setPaymentMethod,
  total,
  isProcessing,
  onPlaceCodOrder,
  onStripeRedirect
}: any) {

  return (
    <div className={`bg-white p-6 rounded-xl border shadow-sm transition-opacity duration-300 ${step !== 3 && "opacity-60 grayscale pointer-events-none"}`}>
      <h2 className="text-lg font-serif font-medium flex items-center gap-2 mb-4">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#581c1c] text-white text-xs">3</span>
        Payment
      </h2>

      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          
          {/* Selector */}
          <div className="grid grid-cols-2 gap-4 mb-6 pointer-events-auto">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                paymentMethod === "card" ? "border-[#581c1c] bg-[#581c1c] text-white shadow-md" : "border-gray-200 hover:border-gray-300 text-gray-500 bg-white"
              }`}
            >
              <CreditCard className={`w-6 h-6 mb-2 ${paymentMethod === "card" ? "text-white" : "text-gray-500"}`} />
              <span className="font-medium text-sm">Credit Card</span>
            </button>

            <button
              onClick={() => setPaymentMethod("cod")}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                paymentMethod === "cod" ? "border-[#581c1c] bg-[#581c1c] text-white shadow-md" : "border-gray-200 hover:border-gray-300 text-gray-500 bg-white"
              }`}
            >
              <Truck className={`w-6 h-6 mb-2 ${paymentMethod === "cod" ? "text-white" : "text-gray-500"}`} />
              <span className="font-medium text-sm">Cash on Delivery</span>
            </button>
          </div>

          {/* Conditional Content */}
          <div className="pointer-events-auto">
            {paymentMethod === "card" ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-blue-800 text-sm flex items-start gap-3">
                  <ExternalLink className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Redirect to Secure Payment</p>
                    <p className="text-xs mt-1 text-blue-600">You will be redirected to Stripe to complete your purchase securely.</p>
                  </div>
                </div>
                <Button
                  onClick={onStripeRedirect}
                  disabled={isProcessing}
                  className="bg-[#581c1c] hover:bg-[#4a1717] w-full text-white h-12 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {isProcessing ? "Processing..." : `Proceed to Pay $${total.toFixed(2)}`}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-800 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  You can pay in cash when the courier delivers your order.
                </div>
                <Button
                  onClick={onPlaceCodOrder}
                  disabled={isProcessing}
                  className="bg-[#581c1c] hover:bg-[#4a1717] w-full text-white h-12 text-lg"
                >
                  {isProcessing ? "Placing Order..." : `Place Order ($${total.toFixed(2)})`}
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-2 mt-4 text-xs text-gray-500 items-center">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            Your payment information is encrypted and secure.
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ================= ORDER SUMMARY ================= */
function OrderSummary({ cartItem, subtotal, shipping, tax, total }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="font-serif text-xl mb-6 text-[#581c1c]">Order Summary</h3>

      <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-6 scrollbar-thin scrollbar-thumb-gray-200">
        {cartItem.map((item: any) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <img
                src={item.product.images?.[0] || "/placeholder.png"}
                className="w-full h-full object-cover"
                alt={item.product.name}
              />
              <span className="absolute top-0 right-0 bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded-bl">
                x{item.quantity}
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.product.name}</p>
              {item.productVariant && (
                 <p className="text-xs text-gray-500 mt-1">
                   {item.productVariant.size} {item.productVariant.color !== 'Default' ? `/ ${item.productVariant.color}` : ''}
                 </p>
              )}
            </div>
            <div className="flex flex-col justify-center text-right">
              <p className="text-sm font-medium text-gray-900">
                ${((Number(item.product.price) + Number(item.productVariant?.priceDiff || 0)) * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="mt-6 space-y-3 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium text-gray-900"}>
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Tax (18% GST)</span>
          <span className="font-medium text-gray-900">${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between items-center pt-2">
          <span className="font-serif text-lg text-[#581c1c] font-bold">Total</span>
          <span className="font-serif text-xl text-[#581c1c] font-bold">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}

/* ================= SUCCESS ================= */
function SuccessView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] px-4">
      <div className="bg-white p-10 rounded-xl text-center shadow-lg max-w-md w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-serif text-[#581c1c] mb-2">Order Confirmed!</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Thank you for your purchase. We've received your order and will begin processing it right away.
        </p>
        <Link href="/productlisting">
          <Button className="w-full h-12 text-lg bg-[#581c1c] hover:bg-[#4a1717] text-white">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}