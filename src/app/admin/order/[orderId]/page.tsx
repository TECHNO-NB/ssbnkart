"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Printer,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { AdminSidebar } from "@/components/admin/Sidebar";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function OrderDetailsPage() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  const print = () => {
    window.print();
  };

  // Fetch Order Details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/order/${params.orderId}`
        );
        setOrder(res.data);
      } catch (error) {
        toast.error("Failed to load order details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.orderId]);

  // Update Status
  const handleStatusChange = async (val: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/order/${order.dbId}/status`,
        { status: val }
      );
      setOrder({ ...order, status: val });
      toast.success(`Order marked as ${val}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Update Payment
  const handlePaymentChange = async (val: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/order/${order.dbId}/payment`,
        { status: val }
      );
      setOrder({ ...order, paymentStatus: val });
      toast.success(`Payment marked as ${val}`);
    } catch (error) {
      toast.error("Failed to update payment");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!order) return <div className="p-8">Order not found.</div>;

  return (
    <div className="flex min-h-screen w-full bg-slate-50/30">
      <AdminSidebar />
      <Toaster position="top-right" />

      <main className="flex flex-1 flex-col p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
        {/* --- Top Bar --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/orders">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
                Order #{order.id}
                <Badge variant="outline" className="text-sm font-normal">
                  {order.date}
                </Badge>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={print}>
              <Printer className="h-4 w-4" /> Print Invoice
            </Button>
            {order.status !== "CANCELLED" && (
              <Button
                variant="destructive"
                onClick={() => handleStatusChange("CANCELLED")}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- LEFT COLUMN (2/3 width) --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right pr-6">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded bg-slate-100 border overflow-hidden">
                              <Image
                                src={
                                  item.image ||
                                  "https://apisap.fabindia.com/medias/20235813-01.jpg?context=bWFzdGVyfGltYWdlc3w4Njg1NnxpbWFnZS9qcGVnfGFETmhMMmcyTlM4eE16UXlPVEk0TVRNd05UTTVPREl2TWpBeU16VTRNVE5mTURFdWFuQm58NWM4YjY0NjM0NTM0ZDFlNDVjNGZkZDNmZDIzMDdjYzJmYjVkNTMyZmQ4MjAwY2IwNDA1MzFkMWI0MDNkYzAwZQ&aio=w-400"
                                }
                                alt={item.name || "Product Image"}
                                fill
                                className="object-cover object-center"
                                sizes="40px"
                                priority
                              />
                            </div>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {item.sku}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>$ {item.price.toLocaleString()}</TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell className="text-right pr-6">
                          $ {item.total.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex-col items-end py-6 space-y-2 bg-slate-50/50 border-t">
                <div className="flex justify-between w-full max-w-xs text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>$ {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-full max-w-xs text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>$ {order.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-full max-w-xs text-base font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>$ {order.total.toLocaleString()}</span>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* --- RIGHT COLUMN (1/3 width) --- */}
          <div className="space-y-6">
            {/* 1. Order Status Control */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={order.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* 2. Payment Control */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Provider:</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Payment Status
                  </label>
                  <Select
                    value={order.paymentStatus}
                    onValueChange={handlePaymentChange}
                  >
                    <SelectTrigger
                      className={`w-full ${
                        order.paymentStatus === "PAID"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-orange-50 text-orange-700 border-orange-200"
                      }`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground">
                    * Manual override. Updates order paid status automatically.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 3. Customer Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {order.customer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{order.customer.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.customer.ordersCount} previous orders
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="hover:underline"
                  >
                    {order.customer.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customer.phone}</span>
                </div>
              </CardContent>
            </Card>

            {/* 4. Address Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4 text-muted-foreground" /> Shipping
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                {order.shippingAddress ? (
                  <>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}
                    </p>
                    <p>
                      {order.shippingAddress.zipCode},{" "}
                      {order.shippingAddress.country}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground italic">
                    No shipping address provided
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
