"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { DollarSign, Users, CreditCard, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { AdminSidebar } from "@/components/admin/Sidebar"
import { OverviewChart } from "@/components/admin/OverviewChart"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

// --- Types matching your Backend Controller Response ---
interface StatMetric {
  value: number
  change: number // percentage
}

interface RecentSale {
  id: string
  name: string
  email: string
  amount: number
  img?: string
}

interface DashboardStats {
  revenue: StatMetric
  subscriptions: StatMetric
  sales: StatMetric
  activeNow: {
    value: number
    since: string
  }
  recentSales: RecentSale[]
  graphData: { name: string; total: number }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Calling the backend controller endpoint
        const response = await axios.get<DashboardStats>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/dashboard`)
        setStats(response.data)
      } catch (err) {
        console.error("Failed to load dashboard data", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Helper for Currency Formatting
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // Change to 'INR' or other currency code if needed
    }).format(value)
  }

  // Helper for Percentage Change Color
  const ChangeIndicator = ({ change }: { change: number }) => {
    const isPositive = change >= 0
    return (
      <p className={`text-xs flex items-center mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
        {Math.abs(change).toFixed(1)}% from last month
      </p>
    )
  }

  // --- Loading State (Skeleton UI) ---
  if (loading) {
    return (
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-slate-50/20">
          <div className="flex items-center justify-between">
             <Skeleton className="h-9 w-48" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-3 w-40" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
             <Skeleton className="col-span-4 h-[300px] rounded-xl" />
             <Skeleton className="col-span-3 h-[300px] rounded-xl" />
          </div>
        </main>
      </div>
    )
  }

  // --- Error State ---
  if (error || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">Failed to load data</h2>
          <p className="text-slate-500">Please check your internet connection or server status.</p>
        </div>
      </div>
    )
  }

  // --- Success State ---
  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-slate-50/20">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          
          {/* 1. Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.revenue.value)}</div>
              <ChangeIndicator change={stats.revenue.change} />
            </CardContent>
          </Card>
          
          {/* 2. Subscriptions / Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.subscriptions.value.toLocaleString()}</div>
              <ChangeIndicator change={stats.subscriptions.change} />
            </CardContent>
          </Card>

          {/* 3. Sales Count */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.sales.value.toLocaleString()}</div>
              <ChangeIndicator change={stats.sales.change} />
            </CardContent>
          </Card>

          {/* 4. Active Now */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.activeNow.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active within the last hour
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sales Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <OverviewChart data={stats.graphData} />
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <p className="text-sm text-muted-foreground">
                You made {stats.sales.value} sales this month.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {stats.recentSales.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent sales found.</p>
                ) : (
                  stats.recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={sale.img || ""} alt="Avatar" />
                        <AvatarFallback>{sale.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{sale.name}</p>
                        <p className="text-xs text-muted-foreground">{sale.email}</p>
                      </div>
                      <div className="ml-auto font-medium">
                        +{formatCurrency(sale.amount)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}