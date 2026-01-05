"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Filter, Download, Search, MoreHorizontal, Loader2 } from "lucide-react"
import Link from "next/link"
import { AdminSidebar } from "@/components/admin/Sidebar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/order`, {
          params: { tab: activeTab, search: searchQuery }
        })
        setOrders(res.data)
      } catch (error) {
        console.error("Failed to fetch orders", error)
      } finally {
        setLoading(false)
      }
    }

    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchOrders()
    }, 300)

    return () => clearTimeout(timer)
  }, [activeTab, searchQuery])

  // Helper colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "border-yellow-300 bg-yellow-100 text-yellow-700"
      case "SHIPPED": return "border-blue-300 bg-blue-100 text-blue-700"
      case "DELIVERED": return "border-green-300 bg-green-100 text-green-700"
      case "CANCELLED": return "border-red-300 bg-red-100 text-red-700"
      default: return "border-slate-200 bg-slate-100 text-slate-700"
    }
  }

  const getPaymentColor = (status: string) =>
    status === "PAID"
      ? "border-green-300 bg-green-50 text-green-700"
      : "border-orange-300 bg-orange-50 text-orange-700"

  return (
    <div className="flex min-h-screen w-full bg-slate-50/30">
      <AdminSidebar />

      <main className="flex flex-1 flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
            <p className="text-sm text-muted-foreground">
              Manage and fulfill customer orders
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>

        {/* Tabs & Search */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="returns">Returns</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-white shadow-sm overflow-hidden min-h-[400px]">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Fulfillment</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                       <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin" /> Loading orders...
                       </div>
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-indigo-600">
                        <Link href={`/admin/order/${order.id}`}>
                          {order.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {order.date}
                      </TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPaymentColor(order.paymentStatus)}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        $ {order.total.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/order/${order.id}`}>
                                View Details
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Tabs>
      </main>
    </div>
  )
}