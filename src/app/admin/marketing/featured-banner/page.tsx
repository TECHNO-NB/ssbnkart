"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { AdminSidebar } from "@/components/admin/Sidebar";

type Banner = {
  id: string;
  image: string;
  title: string;
  description: string;
  cta: string;
  link: string;
};

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State - We keep text fields here
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cta: "",
    link: "",
  });
  
  // Separate state for the actual File object and the preview URL
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Banners
  const fetchBanners = async () => {
    try {
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/featuredbanners`);
      const data = await res.json();
      setBanners(data);
    } catch (error) {
      console.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // 2. Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Create a fake URL for immediate preview (visual only)
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      
      // 2. Store the actual File object for upload
      setSelectedFile(file);
    }
  };

  // 3. Submit Handler (Multipart Version)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
        alert("Please select an image");
        return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData object
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("cta", formData.cta);
      data.append("link", formData.link);
      // Append the file with the key 'image' (must match backend middleware)
      data.append("image", selectedFile); 

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/featuredbanners`, {
        method: "POST",
        credentials:"include",
        // IMPORTANT: Do NOT set Content-Type header manually. 
        // The browser sets it to 'multipart/form-data; boundary=...' automatically.
        body: data, 
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Something went wrong");
        return;
      }

      await fetchBanners(); // Refresh list
      setIsDialogOpen(false); // Close modal
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Failed to create banner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Delete Handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/featuredbanners/${id}`, { method: "DELETE",credentials:"include" });
      setBanners(banners.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Failed to delete");
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", cta: "", link: "" });
    setSelectedFile(null);
    setImagePreview(null);
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50/30">
      
      <AdminSidebar />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Featured Banners</h1>
            <p className="text-muted-foreground">Manage your homepage hero section.</p>
          </div>

          {/* --- ADD BANNER DIALOG --- */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={banners.length >= 2}>
                <Plus className="w-4 h-4 mr-2" />
                Add Banner ({banners.length}/2)
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Banner</DialogTitle>
                <DialogDescription>
                  Add details for the featured section. Max 2 allowed.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Image Upload Area */}
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="image">Banner Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <Input 
                      id="image" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      required 
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Summer Sale" 
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea 
                    id="desc" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Short description..." 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cta">CTA Text</Label>
                    <Input 
                      id="cta" 
                      value={formData.cta}
                      onChange={(e) => setFormData({...formData, cta: e.target.value})}
                      placeholder="Shop Now" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="link">Link URL</Label>
                    <Input 
                      id="link" 
                      value={formData.link}
                      onChange={(e) => setFormData({...formData, link: e.target.value})}
                      placeholder="/collections/men" 
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Banner
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* --- BANNER LIST --- */}
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gray-400" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <Card key={banner.id} className="overflow-hidden group relative shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-video relative bg-gray-100">
                  <img 
                    src={banner.image} 
                    alt={banner.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(banner.id)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-1">{banner.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{banner.description}</p>
                  <div className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
                    {banner.cta} <span className="ml-1">&rarr;</span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {banners.length === 0 && (
              <div className="col-span-full text-center py-16 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 bg-white">
                <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>No banners active. Add one to get started.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}