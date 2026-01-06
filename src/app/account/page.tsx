"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  CreditCard,
  Camera,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useSelector } from "react-redux";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AddressDialog } from "@/components/AddAddressModal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const userData = useSelector((state: any) => state.user);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const router=useRouter();

  async function fetchData() {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/userAccount/${userData.id}`
      );
      const data = res.data.data;
      setUserProfile(data.userProfile);
      setOrders(data.alluserOrder || []);
      setAddresses(data.getAllShippingAddress || []);
      setPayments(data.getPaymentMethod || []);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  }

  useEffect(() => {
    if(!userData?.id){
      toast.error("You are not login!")
      router.push("/auth/login")
      return;
    }
    fetchData();
  }, [userData.id]);

  if (!userProfile) return <p className="text-center mt-10">Loading...</p>;

  const openOrderDialog = (order: any) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* --- Header & Stats --- */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                {userProfile.image ? (
                  <AvatarImage src={userProfile.image} />
                ) : (
                  <AvatarFallback>{userProfile.fullName[0]}</AvatarFallback>
                )}
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-[#581c1c] p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-3 h-3" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-serif text-[#581c1c]">
                {userProfile.fullName}
              </h1>
              <p className="text-muted-foreground text-sm">
                {userProfile.email}
              </p>
            </div>
          </div>
        </div>

        {/* --- Main Content Tabs --- */}
        <Tabs defaultValue="orders" className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 shrink-0">
            <TabsList className="flex lg:flex-col h-auto w-full bg-white p-2 rounded-xl border shadow-sm gap-1 justify-start">
              {[
                { value: "orders", icon: Package, label: "My Orders" },
                { value: "addresses", icon: MapPin, label: "Addresses" },
                {
                  value: "payment",
                  icon: CreditCard,
                  label: "Payment Methods",
                },
                {
                  value: "settings",
                  icon: Settings,
                  label: "Account Settings",
                },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="w-full justify-start gap-3 px-4 py-3 text-sm font-medium data-[state=active]:bg-[#581c1c] data-[state=active]:text-white transition-all rounded-lg"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log Out</span>
              </Button>
            </TabsList>
          </aside>

          {/* Tab Content Area */}
          <div className="flex-1">
            {/* Orders Tab */}
            <TabsContent value="orders" className="mt-0 space-y-6">
              <h2 className="font-serif text-2xl mb-4">Order History</h2>
              {orders.map((order) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={order.id}
                >
                  <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="bg-gray-50/50 py-4 px-6 flex flex-row items-center justify-between space-y-0">
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="block text-muted-foreground text-xs uppercase">
                            Order Placed
                          </span>
                          <span className="font-medium text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="block text-muted-foreground text-xs uppercase">
                            Total
                          </span>
                          <span className="font-medium text-gray-900">
                            ${Number(order.total).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-muted-foreground text-xs uppercase">
                          Order #
                        </span>
                        <span className="font-medium text-gray-900">
                          {order.orderNumber}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col sm:flex-row gap-6 items-center">
                      <img
                        src={order.items[0]?.productImage}
                        alt="Product"
                        className="w-20 h-24 object-cover rounded-md bg-gray-100"
                      />
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-medium text-gray-900">
                          {order.items[0]?.productName}{" "}
                          {order.items.length > 1 &&
                            `+ ${order.items.length - 1} more`}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Status:{" "}
                          <span
                            className={
                              order.status === "DELIVERED"
                                ? "text-green-600 font-medium"
                                : "text-amber-600 font-medium"
                            }
                          >
                            {order.status}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <Button
                          className="w-full bg-[#581c1c] hover:bg-[#4a1717]"
                          onClick={() => openOrderDialog(order)}
                        >
                          View Order
                        </Button>
                        {order.status === "DELIVERED" && (
                          <Button variant="outline" className="w-full">
                            Invoice
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="mt-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl">Saved Addresses</h2>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  variant="outline"
                  className="border-[#581c1c] text-[#581c1c] hover:bg-[#581c1c] hover:text-white"
                >
                  + Add New Address
                </Button>

                <AddressDialog
                  isOpen={isDialogOpen}
                  setIsOpen={setIsDialogOpen}
                  userId={userData?.id}
                  onSuccess={() => {
                    toast.success("Address saved!");
                    fetchData();
                  }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <Card key={addr.id} className="relative group">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Badge
                          variant={addr.isDefault ? "default" : "outline"}
                          className={addr.isDefault ? "bg-[#581c1c]" : ""}
                        >
                          {addr.type}
                        </Badge>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-sm text-gray-500 hover:text-[#581c1c]">
                            Edit
                          </button>
                          <span className="text-gray-300">|</span>
                          <button className="text-sm text-gray-500 hover:text-red-600">
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900">
                        {userProfile.fullName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {addr.street}
                        <br />
                        {addr.city} - {addr.zip}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {userProfile.phone}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment" className="mt-0">
              <h2 className="font-serif text-2xl mb-4">Payment Methods</h2>
              {payments.map((pay) => (
                <Card key={pay.id} className="mb-4">
                  <CardContent className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{pay.provider}</p>
                      <p className="text-sm text-muted-foreground">
                        ${Number(pay.amount).toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant={pay.status === "PAID" ? "default" : "outline"}
                    >
                      {pay.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-0">
              <h2 className="font-serif text-2xl mb-6">Account Settings</h2>
              <Card>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input defaultValue={userProfile.fullName} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        defaultValue={userProfile.email}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input defaultValue={userProfile.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        defaultValue={userProfile.dob?.split("T")[0]}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="font-medium mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Order Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive SMS/Email about order status.
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">
                            Promotional Emails
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive offers and newsletters.
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button variant="ghost">Cancel</Button>
                    <Button className="bg-[#581c1c] hover:bg-[#4a1717]">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* --- Dialog for Order Details --- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder?.orderNumber} - {selectedOrder?.status}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedOrder?.items.map((item: any) => (
              <div
                key={item.id}
                className="flex gap-4 items-center border-b pb-2"
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-16 h-20 object-cover rounded-md"
                />
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-500">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-900 font-medium">
                    ${Number(item.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-between mt-4 font-medium">
              <p>Subtotal:</p>
              <p>${Number(selectedOrder?.subtotal).toLocaleString()}</p>
            </div>
            <div className="flex justify-between font-medium">
              <p>Shipping:</p>
              <p>${Number(selectedOrder?.shippingCost).toLocaleString()}</p>
            </div>
            <div className="flex justify-between font-medium">
              <p>Tax:</p>
              <p>${Number(selectedOrder?.tax).toLocaleString()}</p>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <p>Total:</p>
              <p>${Number(selectedOrder?.total).toLocaleString()}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
