"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Loader2, Save } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { AdminSidebar } from "@/components/admin/Sidebar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useSelector } from "react-redux"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const userData=useSelector((state:any)=> state.user)

  // Data State
  const [storeData, setStoreData] = useState({ storeName: "", supportEmail: "", taxRate: "" })
  const [accountData, setAccountData] = useState({ name: "", email: "", password: "" })
  const [notifData, setNotifData] = useState({ orders: false, stock: false, reviews: false })

  // --- Fetch Initial Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/settings/${userData.id}`)
        const { store, account, notifications } = res.data
        
        setStoreData({
          storeName: store.storeName,
          supportEmail: store.supportEmail,
          taxRate: store.taxRate
        })
        setAccountData({ name: account.name, email: account.email, password: "" })
        setNotifData({
          orders: notifications.orders,
          stock: notifications.stock,
          reviews: notifications.reviews
        })
      } catch (error) {
        toast.error("Failed to load settings")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [userData?.id])

  // --- Handlers ---

  const handleSaveStore = async () => {
    setSaving(true)
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/settings/store`, storeData)
      toast.success("Store settings updated")
    } catch (error) {
      toast.error("Failed to update store settings")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAccount = async () => {
    setSaving(true)
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/settings/account${userData.id}`, {
        fullName: accountData.name,
        email: accountData.email,
        password: accountData.password || undefined // Only send if not empty
      })
      toast.success("Account profile updated")
      setAccountData(prev => ({ ...prev, password: "" })) // Clear password field
    } catch (error) {
      toast.error("Failed to update account")
    } finally {
      setSaving(false)
    }
  }

  // Auto-save toggle switches for better UX
  const handleToggleNotif = async (key: string, val: boolean) => {
    // Optimistic Update
    setNotifData(prev => ({ ...prev, [key]: val }))
    
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/settings/notifications${userData.id}`, {
        notifyOrder: key === 'orders' ? val : notifData.orders,
        notifyStock: key === 'stock' ? val : notifData.stock,
        notifyReview: key === 'reviews' ? val : notifData.reviews,
      })
      toast.success("Preference saved")
    } catch (error) {
      toast.error("Failed to save preference")
      // Revert on error
      setNotifData(prev => ({ ...prev, [key]: !val }))
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50/20">
      <AdminSidebar />
      <Toaster position="top-right" />
      
      <main className="flex flex-1 flex-col p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
        
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your store preferences and account.</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="general">Store Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          {/* --- TAB 1: STORE PROFILE --- */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>
                  This is how your store appears to customers and on invoices.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input 
                    id="storeName" 
                    value={storeData.storeName} 
                    onChange={(e) => setStoreData({...storeData, storeName: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="storeEmail">Support Email</Label>
                  <Input 
                    id="storeEmail" 
                    value={storeData.supportEmail}
                    onChange={(e) => setStoreData({...storeData, supportEmail: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tax">Tax Rate (%)</Label>
                    <Input 
                      id="tax" 
                      type="number" 
                      value={storeData.taxRate}
                      onChange={(e) => setStoreData({...storeData, taxRate: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleSaveStore} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* --- TAB 2: ACCOUNT --- */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>
                  Manage your personal admin credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Full Name</Label>
                  <Input 
                    value={accountData.name}
                    onChange={(e) => setAccountData({...accountData, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input 
                    value={accountData.email}
                    onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                  />
                </div>
                <Separator className="my-2" />
                <div className="grid gap-2">
                  <Label>New Password</Label>
                  <Input 
                    type="password" 
                    placeholder="Leave blank to keep current password"
                    value={accountData.password}
                    onChange={(e) => setAccountData({...accountData, password: e.target.value})}
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleSaveAccount} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update Profile
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* --- TAB 3: NOTIFICATIONS --- */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Configure when you want to receive alerts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">New Orders</Label>
                    <p className="text-sm text-muted-foreground">Receive an email when a customer places an order.</p>
                  </div>
                  <Switch 
                    checked={notifData.orders}
                    onCheckedChange={(val) => handleToggleNotif('orders', val)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when product inventory is low.</p>
                  </div>
                  <Switch 
                    checked={notifData.stock}
                    onCheckedChange={(val) => handleToggleNotif('stock', val)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">New Reviews</Label>
                    <p className="text-sm text-muted-foreground">Receive an email when a customer leaves a review.</p>
                  </div>
                  <Switch 
                    checked={notifData.reviews}
                    onCheckedChange={(val) => handleToggleNotif('reviews', val)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}