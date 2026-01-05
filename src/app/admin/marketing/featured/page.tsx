"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Plus, MoreHorizontal, Pencil, Trash2, Loader2, Search, Check, ChevronsUpDown } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { AdminSidebar } from "@/components/admin/Sidebar"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from "@/components/ui/command"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Types
interface FeaturedItem {
  id: string
  title: string
  productName: string
  image: string
  productId: string
  active: boolean
  order: number
}

interface ProductOption {
  id: string
  name: string
  image: string | null
}

export default function FeaturedPage() {
  const [items, setItems] = useState<FeaturedItem[]>([])
  const [products, setProducts] = useState<ProductOption[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FeaturedItem | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({ title: "", productId: "", order: 1, active: true })
  const [openCombobox, setOpenCombobox] = useState(false)

  // --- Fetch Data ---
  const fetchData = async () => {
    try {
      setLoading(true)
      const [featRes, prodRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/featured`),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/products`) 
      ])
      setItems(featRes.data)
      setProducts(prodRes.data.map((p: any) => ({ id: p.id, name: p.name, image: p.image })))
    } catch (error) {
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- Handlers ---
  const openCreateDialog = () => {
    setSelectedItem(null)
    setFormData({ title: "", productId: "", order: items.length + 1, active: true })
    setIsDialogOpen(true)
  }

  const openEditDialog = (item: FeaturedItem) => {
    setSelectedItem(item)
    setFormData({ 
      title: item.title, 
      productId: item.productId, 
      order: item.order, 
      active: item.active 
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this item from featured?")) return
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/featured/${id}`)
      toast.success("Item removed")
      fetchData()
    } catch (error) {
      toast.error("Failed to delete")
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.productId) {
      toast.error("Title and Product are required")
      return
    }

    setIsSubmitting(true)
    try {
      if (selectedItem) {
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/featured/${selectedItem.id}`, formData)
        toast.success("Updated successfully")
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/featured`, formData)
        toast.success("Created successfully")
      }
      setIsDialogOpen(false)
      fetchData()
    } catch (error) {
      toast.error("Operation failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50/30">
      <AdminSidebar />
      <Toaster position="top-right" />
      
      <main className="flex flex-1 flex-col p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Fantastic Finds</h2>
            <p className="text-sm text-muted-foreground">Manage the curated items on the homepage.</p>
          </div>
          <Button onClick={openCreateDialog} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>

        {/* --- Table --- */}
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[80px]">Order</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead>Display Title</TableHead>
                <TableHead>Linked Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No items found. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium">#{item.order}</TableCell>
                    <TableCell>
                       <Avatar className="h-10 w-10 rounded-md bg-slate-100 border">
                          <AvatarImage src={item?.image} className="object-cover" />
                          <AvatarFallback>IMG</AvatarFallback>
                       </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-indigo-700">{item.title}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>
                      <Badge variant={item.active ? "default" : "secondary"} className={item.active ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}>
                        {item.active ? "Active" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(item)}>
                            <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Remove
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

        {/* --- Create/Edit Dialog --- */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] overflow-visible">
            <DialogHeader>
              <DialogTitle>{selectedItem ? "Edit Featured Item" : "Add Featured Item"}</DialogTitle>
              <DialogDescription>Link a product to display in the Fantastic Finds section.</DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
               
               <div className="grid gap-2">
                  <Label>Display Title</Label>
                  <Input 
                    placeholder="e.g. Women's Kurtas" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
               </div>

               <div className="grid gap-2">
                  <Label>Select Product</Label>
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCombobox}
                        className="w-full justify-between"
                      >
                        {formData.productId
                          ? products.find((product) => product.id === formData.productId)?.name
                          : "Select product..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[450px] p-0">
                      <Command>
                        <CommandInput placeholder="Search product..." />
                        <CommandList>
                          <CommandEmpty>No product found.</CommandEmpty>
                          <CommandGroup className="max-h-[200px] overflow-y-auto">
                            {products.map((product) => (
                              <CommandItem
                                key={product.id}
                                value={product.name}
                                onSelect={() => {
                                  setFormData({...formData, productId: product.id})
                                  setOpenCombobox(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.productId === product.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {product.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                      <Label>Sort Order</Label>
                      <Input 
                        type="number" 
                        value={formData.order}
                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                      />
                  </div>
                  <div className="flex items-center justify-between border p-2 rounded-md">
                      <Label className="cursor-pointer" htmlFor="active-sw">Active</Label>
                      <Switch 
                        id="active-sw"
                        checked={formData.active}
                        onCheckedChange={(val) => setFormData({...formData, active: val})}
                      />
                  </div>
               </div>

            </div>

            <DialogFooter>
               <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
               <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Item"}
               </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  )
}