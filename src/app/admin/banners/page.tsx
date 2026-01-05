"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Plus, MoreHorizontal, Upload, Trash2, Pencil, Loader2, Image as ImageIcon } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { AdminSidebar } from "@/components/admin/Sidebar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Types matching Prisma Model
interface Banner {
  id: string
  title: string
  image: string
  link: string
  buttonText: string
  active: boolean
  order: number
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    imageFile: null as File | null,
    imagePreview: "",
    link: "/",
    buttonText: "Shop Now",
    active: true,
    order: 1
  })

  // --- Fetch Banners ---
  const fetchBanners = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/banner`)
      setBanners(res.data)
    } catch (error) {
      toast.error("Failed to load banners")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  // --- Handlers ---
  const openCreateDialog = () => {
    setSelectedBanner(null)
    setFormData({ 
      title: "", 
      imageFile: null,
      imagePreview: "", 
      link: "/", 
      buttonText: "Shop Now", 
      active: true, 
      order: banners.length + 1 
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (banner: Banner) => {
    setSelectedBanner(banner)
    setFormData({
      title: banner.title,
      imageFile: null, // Reset file, use existing URL
      imagePreview: banner.image,
      link: banner.link,
      buttonText: banner.buttonText || "Shop Now",
      active: true,
      order: banner.order
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedBanner) return
    setIsSubmitting(true)
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/banner/${selectedBanner.id}`)
      toast.success("Banner deleted")
      setIsDeleteDialogOpen(false)
      fetchBanners()
    } catch (error) {
      toast.error("Failed to delete banner")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.imagePreview || !formData.link) {
      toast.error("Please fill all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const data = new FormData()
      data.append("title", formData.title)
      data.append("link", formData.link)
      data.append("buttonText", formData.buttonText)
      data.append("active", formData.active ? "true" : "false")
      data.append("order", formData.order.toString())

      if (formData.imageFile) {
        data.append("imageFile", formData.imageFile)
      }

      if (selectedBanner) {
        // Update
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/banner/${selectedBanner.id}`, data)
        toast.success("Banner updated")
      } else {
        // Create
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/banner`, data)
        toast.success("Banner created")
      }

      setIsDialogOpen(false)
      fetchBanners()
    } catch (error) {
      toast.error("Operation failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFormData({
      ...formData,
      imageFile: file,
      imagePreview: URL.createObjectURL(file)
    })
  }

  const removeImage = () => {
    setFormData({
      ...formData,
      imageFile: null,
      imagePreview: ""
    })
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50/30">
      <AdminSidebar />
      <Toaster position="top-right" />

      <main className="flex flex-1 flex-col p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Hero Banners</h2>
            <p className="text-sm text-muted-foreground">Manage the sliding images on your homepage.</p>
          </div>
          <Button onClick={openCreateDialog} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Add Banner
          </Button>
        </div>

        {/* --- TABLE --- */}
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[50px]">Order</TableHead>
                <TableHead className="w-[120px]">Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Button Text</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" /> Loading banners...
                    </div>
                  </TableCell>
                </TableRow>
              ) : banners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No banners found. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                banners.map((banner) => (
                  <TableRow key={banner.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium">#{banner.order}</TableCell>
                    <TableCell>
                      <div className="h-12 w-20 relative rounded-md overflow-hidden bg-slate-100 border">
                          <img src={banner.image} alt={banner.title} className="object-cover w-full h-full" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{banner.title}</TableCell>
                    <TableCell>
                        <Badge variant="outline">{banner.buttonText}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm font-mono max-w-[150px] truncate">
                        {banner.link}
                    </TableCell>
                    <TableCell>
                      <Badge variant={banner.active ? "default" : "secondary"} className={banner.active ? "bg-green-600 hover:bg-green-700" : ""}>
                          {banner.active ? "Active" : "Draft"}
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
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditDialog(banner)}>
                              <Pencil className="mr-2 h-3.5 w-3.5 text-muted-foreground" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => { setSelectedBanner(banner); setIsDeleteDialogOpen(true); }}>
                              <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
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

        {/* --- CREATE / EDIT DIALOG --- */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedBanner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              
              {/* Image Upload & Preview */}
              <div className="space-y-2">
                <Label>Banner Image</Label>
                {formData.imagePreview && (
                  <div className="relative w-full h-40 rounded-md overflow-hidden border">
                    <img src={formData.imagePreview} className="object-cover w-full h-full" />
                    <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">×</button>
                  </div>
                )}
                <Input type="file" accept="image/*" onChange={handleImageChange} />
              </div>

              <div className="grid gap-2">
                <Label>Internal Title</Label>
                <Input 
                    placeholder="e.g. Winter Sale Hero" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Target Link</Label>
                    <Input 
                        placeholder="/collections/sale" 
                        value={formData.link}
                        onChange={(e) => setFormData({...formData, link: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Button Name</Label>
                    <Input 
                        placeholder="Shop Now" 
                        value={formData.buttonText}
                        onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                    />
                  </div>
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
                      <Label className="cursor-pointer" htmlFor="active-switch">Active</Label>
                      <Switch 
                        id="active-switch" 
                        checked={formData.active} 
                        onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                      />
                  </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 min-w-[100px]">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Banner"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

         {/* --- DELETE ALERT --- */}
         <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Banner?</AlertDialogTitle>
              <AlertDialogDescription>This will remove the banner from your homepage immediately.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </main>
    </div>
  )  
}
