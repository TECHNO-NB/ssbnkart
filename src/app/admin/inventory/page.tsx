"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Search, Package, ArrowUpCircle, ArrowDownCircle, AlertTriangle, Loader2 } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { AdminSidebar } from "@/components/admin/Sidebar"

// Shadcn UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Types matching Controller Response
interface InventoryItem {
  id: string
  sku: string
  product: string
  size: string
  color: string
  stock: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
}

export default function InventoryPage() {
  // --- State ---
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showLowStockOnly, setShowLowStockOnly] = useState(false)

  // Dialog & Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add")
  const [qtyInput, setQtyInput] = useState("")
  const [reasonInput, setReasonInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- Fetch Data ---
  const fetchInventory = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/inventory`, {
        params: {
          search: searchQuery,
          lowStock: showLowStockOnly
        }
      })
      setInventory(response.data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load inventory")
    } finally {
      setLoading(false)
    }
  }

  // Debounce Search & Filter Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInventory()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, showLowStockOnly])

  // --- Handlers ---

  const openAdjustDialog = (item: InventoryItem) => {
    setSelectedItem(item)
    setAdjustmentType("add")
    setQtyInput("")
    setReasonInput("")
    setIsDialogOpen(true)
  }

  const handleUpdateStock = async () => {
    if (!selectedItem || !qtyInput) return
    
    const qty = parseInt(qtyInput)
    if (isNaN(qty) || qty <= 0) {
      toast.error("Please enter a valid quantity")
      return
    }

    setIsSubmitting(true)
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/inventory/${selectedItem.id}`, {
        type: adjustmentType,
        quantity: qty,
        reason: reasonInput
      })

      toast.success(`Stock ${adjustmentType === 'add' ? 'added' : 'removed'} successfully`)
      setIsDialogOpen(false)
      fetchInventory() // Refresh table
    } catch (error: any) {
      const msg = error.response?.data?.error || "Failed to update stock"
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50/30">
      <AdminSidebar />
      <Toaster position="top-right" />

      <main className="flex flex-1 flex-col p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
            <p className="text-sm text-muted-foreground">Manage stock levels across all SKUs.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Package className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Toolbar: Search & Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-2 rounded-lg border shadow-sm">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by SKU or Product Name..." 
              className="pl-9 border-none shadow-none focus-visible:ring-0 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
             <Button 
                variant={showLowStockOnly ? "secondary" : "ghost"}
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                className={`border ${showLowStockOnly 
                  ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100" 
                  : "border-transparent text-slate-500"}`}
             >
                <AlertTriangle className={`mr-2 h-4 w-4 ${showLowStockOnly ? "text-orange-600" : ""}`} /> 
                {showLowStockOnly ? "Low Stock Only" : "Filter Low Stock"}
             </Button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                     <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" /> Loading inventory...
                     </div>
                  </TableCell>
                </TableRow>
              ) : inventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No items found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                inventory.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-mono text-xs font-medium text-slate-600">
                      {item.sku}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.product}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="mr-2 rounded-sm">{item.size}</Badge>
                      <span className="text-sm text-slate-500">{item.color}</span>
                    </TableCell>
                    <TableCell className="font-bold text-base">
                      {item.stock}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.status === "Out of Stock" ? "destructive" : "secondary"}
                        className={
                          item.status === "Low Stock" ? "bg-orange-100 text-orange-700 hover:bg-orange-200" :
                          item.status === "In Stock" ? "bg-green-100 text-green-700 hover:bg-green-200" : ""
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" 
                        onClick={() => openAdjustDialog(item)}
                      >
                        Adjust Stock
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* --- STOCK ADJUSTMENT DIALOG --- */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adjust Stock</DialogTitle>
              {selectedItem && (
                 <DialogDescription>
                    Updating <span className="font-mono text-xs bg-slate-100 px-1 rounded">{selectedItem.sku}</span> - {selectedItem.product} ({selectedItem.size}/{selectedItem.color})
                 </DialogDescription>
              )}
            </DialogHeader>

            {selectedItem && (
              <div className="grid gap-6 py-4">
                {/* Current Stock Display */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                    <span className="text-sm font-medium text-slate-500">Current Quantity</span>
                    <span className="text-3xl font-bold text-slate-900">{selectedItem.stock}</span>
                </div>

                {/* Add/Remove Radio */}
                <RadioGroup 
                  value={adjustmentType} 
                  onValueChange={(val: "add" | "remove") => setAdjustmentType(val)} 
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="add" id="add" className="peer sr-only" />
                    <Label
                      htmlFor="add"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-slate-50 hover:text-accent-foreground peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-50 cursor-pointer transition-all"
                    >
                      <ArrowUpCircle className="mb-2 h-6 w-6 text-green-600" />
                      <span className="font-semibold text-green-700">Add Stock</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="remove" id="remove" className="peer sr-only" />
                    <Label
                      htmlFor="remove"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-slate-50 hover:text-accent-foreground peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-50 cursor-pointer transition-all"
                    >
                      <ArrowDownCircle className="mb-2 h-6 w-6 text-red-600" />
                      <span className="font-semibold text-red-700">Remove</span>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Inputs */}
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="qty">Quantity</Label>
                        <Input 
                            id="qty" 
                            type="number" 
                            placeholder="0" 
                            className="text-lg h-12" 
                            value={qtyInput}
                            onChange={(e) => setQtyInput(e.target.value)}
                            min={1}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason (Optional)</Label>
                        <Input 
                            id="reason" 
                            placeholder="e.g. New Shipment, Defective, Return..." 
                            value={reasonInput}
                            onChange={(e) => setReasonInput(e.target.value)}
                        />
                    </div>
                </div>
              </div>
            )}

            <DialogFooter>
               <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                 Cancel
               </Button>
               <Button onClick={handleUpdateStock} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 min-w-[100px]">
                 {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Update"}
               </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  )
}