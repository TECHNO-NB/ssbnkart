"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Plus, MoreHorizontal, Pencil, Trash2, Loader2, Check, ChevronsUpDown, ImageIcon, Upload, X } from "lucide-react"
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from "@/components/ui/command"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Types
interface BentoItem {
  id: string
  categoryName: string
  image: string
  size: "large" | "medium" | "small"
  active: boolean
  order: number
  categoryId: string
  customImage?: string
}

interface CategoryOption {
  id: string
  name: string
}

export default function BentoGridPage() {
  const [items, setItems] = useState<BentoItem[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<BentoItem | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({ 
    categoryId: "", 
    size: "small", 
    customImage: "", 
    order: 1, 
    active: true 
  })
  
  // New State for handling File Upload directly
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  const [openCombobox, setOpenCombobox] = useState(false)
  
  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- Fetch Data ---
  const fetchData = async () => {
    try {
      setLoading(true)
      const [bentoRes, catRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/bento`),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/category`)
      ])
      setItems(bentoRes.data)
      setCategories(catRes.data.map((c: any) => ({ id: c.id, name: c.name })))
    } catch (error) {
      toast.error("Failed to load grid data")
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
    setFormData({ 
        categoryId: "", 
        size: "small", 
        customImage: "", 
        order: items.length + 1, 
        active: true 
    })
    setImageFile(null) // Reset file
    setIsDialogOpen(true)
  }

  const openEditDialog = (item: BentoItem) => {
    setSelectedItem(item)
    setFormData({ 
      categoryId: item.categoryId, 
      size: item.size, 
      customImage: item.customImage || "", 
      order: item.order, 
      active: item.active 
    })
    setImageFile(null) // Reset file
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this category from the grid?")) return
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/bento/${id}`)
      toast.success("Item removed")
      fetchData()
    } catch (error) {
      toast.error("Failed to delete")
    }
  }

  // --- File Selection Handler ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // We don't upload yet, we just store it in state to send on submit
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setFormData(prev => ({ ...prev, customImage: "" }))
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // --- Submit Handler (FormData) ---
  const handleSubmit = async () => {
    if (!formData.categoryId) {
      toast.error("Category is required")
      return
    }

    setIsSubmitting(true)
    
    try {
      // Create FormData object
      const data = new FormData()
      
      // Append text fields
      data.append("categoryId", formData.categoryId)
      data.append("size", formData.size)
      data.append("order", formData.order.toString())
      data.append("active", String(formData.active)) // Convert boolean to string for FormData
      
      // Handle Image:
      // 1. If a new file is selected, send it
      if (imageFile) {
        data.append("image", imageFile) // Backend should look for req.file or 'image' key
      } 
      // 2. If no new file but we have an existing URL string (from editing), send that
      else if (formData.customImage) {
        data.append("customImage", formData.customImage)
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } }

      if (selectedItem) {
        // Update (PUT)
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/bento/${selectedItem.id}`, data, config)
        toast.success("Grid updated successfully")
      } else {
        // Create (POST)
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/bento`, data, config)
        toast.success("Added to grid successfully")
      }
      
      setIsDialogOpen(false)
      fetchData()
    } catch (error) {
      console.error("Submit Error:", error)
      toast.error("Operation failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Determine what to show in the preview box
  // Priority: 1. New Local File (Blob), 2. Existing URL, 3. Empty State
  const previewUrl = imageFile 
    ? URL.createObjectURL(imageFile) 
    : formData.customImage

  const getSizeBadgeColor = (size: string) => {
      switch(size) {
          case 'large': return "bg-purple-100 text-purple-700 border-purple-200"
          case 'medium': return "bg-blue-100 text-blue-700 border-blue-200"
          default: return "bg-slate-100 text-slate-700 border-slate-200"
      }
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50/30">
      <AdminSidebar />
      <Toaster position="top-right" />
      
      <main className="flex flex-1 flex-col p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Curated Categories</h2>
            <p className="text-sm text-muted-foreground">Manage the Bento Grid layout on the homepage.</p>
          </div>
          <Button onClick={openCreateDialog} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Add Grid Item
          </Button>
        </div>

        {/* --- Table --- */}
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[80px]">Order</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Grid Size</TableHead>
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
                    No grid items configured. Add one to start.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium">#{item.order}</TableCell>
                    <TableCell>
                       <div className={`rounded-md bg-slate-100 border overflow-hidden relative ${item.size === 'large' ? 'h-16 w-16' : 'h-10 w-10'}`}>
                          <img src={item.image} className="object-cover w-full h-full" alt="" />
                       </div>
                    </TableCell>
                    <TableCell className="font-medium text-indigo-700">{item.categoryName}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className={getSizeBadgeColor(item.size)}>
                            {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
                        </Badge>
                    </TableCell>
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
              <DialogTitle>{selectedItem ? "Edit Grid Item" : "Add Grid Item"}</DialogTitle>
              <DialogDescription>Configure a category to display in the curated grid.</DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
               
               {/* Category Selection */}
               <div className="grid gap-2">
                  <Label>Select Category</Label>
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCombobox}
                        className="w-full justify-between"
                      >
                        {formData.categoryId
                          ? categories.find((cat) => cat.id === formData.categoryId)?.name
                          : "Select category..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[450px] p-0">
                      <Command>
                        <CommandInput placeholder="Search category..." />
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup className="max-h-[200px] overflow-y-auto">
                            {categories.map((cat) => (
                              <CommandItem
                                key={cat.id}
                                value={cat.name}
                                onSelect={() => {
                                  setFormData({...formData, categoryId: cat.id})
                                  setOpenCombobox(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.categoryId === cat.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {cat.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
               </div>

               {/* Grid Size Selection */}
               <div className="grid gap-2">
                  <Label>Grid Size</Label>
                  <Select 
                    value={formData.size} 
                    onValueChange={(val) => setFormData({...formData, size: val})}
                  >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="small">Small (1x1)</SelectItem>
                        <SelectItem value="medium">Medium (2x1)</SelectItem>
                        <SelectItem value="large">Large (2x2)</SelectItem>
                    </SelectContent>
                  </Select>
               </div>

               {/* Custom Image Upload & Preview */}
               <div className="grid gap-3">
                  <Label>Custom Image</Label>
                  
                  {/* Image Preview Box */}
                  <div className="relative w-full h-40 bg-slate-50 border rounded-md overflow-hidden flex items-center justify-center group hover:bg-slate-100 transition-colors cursor-pointer border-dashed border-slate-300"
                       onClick={() => fileInputRef.current?.click()}
                  >
                    {previewUrl ? (
                        <>
                            <img 
                                src={previewUrl} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                            />
                            {/* Remove Button Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button 
                                  variant="destructive" size="sm" 
                                  onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Remove Image
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                           <Upload className="h-8 w-8" />
                           <span className="text-xs font-medium">Click to Upload Image</span>
                        </div>
                    )}
                  </div>

                  {/* Hidden File Input */}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />

                  {/* Manual URL Input Fallback */}
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Or paste URL here..." 
                      value={formData.customImage}
                      onChange={(e) => {
                          setFormData({...formData, customImage: e.target.value})
                          setImageFile(null) // If user types URL, clear local file
                      }}
                      className="text-xs h-8"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Optional. Leave empty to use the category's default image.</p>
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