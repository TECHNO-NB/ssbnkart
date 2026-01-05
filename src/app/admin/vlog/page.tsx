"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  Save, 
  RotateCcw, 
  ImageIcon, 
  Loader2,
  Upload,
  Trash2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "@/components/admin/Sidebar";

// Define the shape of our data
interface HeritageData {
  tagline: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
}

const DEFAULT_DATA: HeritageData = {
  tagline: "The Philosophy",
  title: "Celebrating India's Artisanal Legacy",
  description: "",
  imageUrl: "",
  buttonText: "Read Our Story",
  buttonLink: "/about",
  isActive: true,
};

export default function HeritageCMSPage() {
  const [formData, setFormData] = useState<HeritageData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // New state for file upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Fetch Current Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cms/heritage-story`);
        if (res.data.data) {
          setFormData(res.data.data);
        }
      } catch (error) {
        console.error("Fetch error", error);
        toast.error("Failed to load CMS data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Handle Input Change ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Handle File Select ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setFormData(prev => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Handle Save (Update with FormData) ---
  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append("tagline", formData.tagline);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("buttonText", formData.buttonText);
      data.append("buttonLink", formData.buttonLink);
      data.append("isActive", String(formData.isActive));

      // Handle Image Logic
      if (imageFile) {
        data.append("image", imageFile); // Send new file
      } else {
        data.append("imageUrl", formData.imageUrl); // Send existing URL
      }

      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cms/heritage-story`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      toast.success("Section updated successfully!");
      
      // Clear local file after successful save
      setImageFile(null);
      
      // Optionally refetch to get the new Cloudinary URL if needed
      // const res = await axios.get(...) 
      // setFormData(res.data.data)

    } catch (error) {
      console.error("Update error", error);
      toast.error("Failed to update section");
    } finally {
      setSaving(false);
    }
  };

  // --- Handle Visibility Toggle ---
  const toggleVisibility = async (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  // Determine preview source (Local File > Existing URL > Placeholder)
  const previewUrl = imageFile 
    ? URL.createObjectURL(imageFile) 
    : formData.imageUrl;

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
       <AdminSidebar/>

       <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Heritage Story Section</h1>
              <p className="text-gray-500 mt-1">Manage the "Philosophy" section on the homepage.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border p-2 rounded-lg shadow-sm">
                <Switch 
                  checked={formData.isActive} 
                  onCheckedChange={toggleVisibility}
                  id="visibility-mode"
                />
                <Label htmlFor="visibility-mode" className="cursor-pointer text-sm font-medium">
                  {formData.isActive ? "Visible" : "Hidden"}
                </Label>
              </div>
              <Button onClick={handleSave} disabled={saving} className="bg-[#581c1c] hover:bg-[#4a1717] text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Form Inputs */}
            <div className="lg:col-span-2 space-y-6">
              
              <Card>
                <CardHeader>
                  <CardTitle>Text Content</CardTitle>
                  <CardDescription>Edit the headings and description text displayed to users.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tagline (Small Text)</Label>
                      <Input 
                        name="tagline" 
                        value={formData.tagline} 
                        onChange={handleChange} 
                        placeholder="e.g. THE PHILOSOPHY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Main Title</Label>
                      <Input 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        placeholder="e.g. Celebrating Artisanal Legacy"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange} 
                      rows={6}
                      placeholder="Enter the main paragraph text..."
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Call To Action</CardTitle>
                  <CardDescription>Configure the button and its destination link.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input 
                      name="buttonText" 
                      value={formData.buttonText} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link URL</Label>
                    <Input 
                      name="buttonLink" 
                      value={formData.buttonLink} 
                      onChange={handleChange} 
                      placeholder="/about"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Image & Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visuals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="space-y-2">
                    <Label>Section Image</Label>
                    
                    {/* Clickable Image Upload Box */}
                    <div 
                      className="relative w-full aspect-[4/3] bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg overflow-hidden flex items-center justify-center group hover:bg-slate-100 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {previewUrl ? (
                        <>
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          {/* Overlay with Delete Button */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={(e) => { e.stopPropagation(); removeImage(); }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Remove
                            </Button>
                          </div>
                          
                          {/* Text Preview Overlay (Always visible) */}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-3 text-white backdrop-blur-sm pointer-events-none">
                            <p className="text-[10px] uppercase opacity-70 tracking-widest">{formData.tagline}</p>
                            <p className="text-xs font-serif font-bold truncate mt-0.5">{formData.title}</p>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <Upload className="w-8 h-8" />
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

                    {/* Fallback URL Input */}
                    <div className="pt-2">
                        <Label className="text-xs text-muted-foreground mb-1 block">Or use manual URL</Label>
                        <Input 
                            value={formData.imageUrl} 
                            onChange={(e) => {
                                setFormData({...formData, imageUrl: e.target.value});
                                setImageFile(null); // Clear file if typing URL
                            }}
                            placeholder="https://..."
                            className="text-xs h-8"
                        />
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* Reset Actions */}
              <Card className="bg-gray-50 border-dashed border-gray-200">
                <CardContent className="pt-6">
                  <Button 
                    variant="ghost" 
                    className="w-full text-gray-600 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                        setFormData(DEFAULT_DATA);
                        setImageFile(null);
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Default Data
                  </Button>
                </CardContent>
              </Card>
            </div>

          </div>
       </main>
    </div>
  );
}