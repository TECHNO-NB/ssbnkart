// src/lib/category-data.ts

export const CATEGORY_DATA: Record<string, any> = {
  "women": {
    title: "Women's Collection",
    description: "Handwoven textiles, intricate embroideries, and contemporary silhouettes.",
    heroImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2000&auto=format&fit=crop",
    subCategories: [
      { name: "Kurtas", image: "https://images.unsplash.com/photo-1583391733958-e026b1346338?w=300" },
      { name: "Sarees", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300" },
      { name: "Dresses", image: "https://images.unsplash.com/photo-1596401057633-565652b8ddbe?w=300" },
      { name: "Jewelry", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300" },
    ]
  },
  "men": {
    title: "Men's Heritage",
    description: "Classic kurtas, nehru jackets, and shirts crafted for the modern man.",
    heroImage: "https://images.unsplash.com/photo-1596401057633-565652b8ddbe?q=80&w=2000&auto=format&fit=crop",
    subCategories: [
      { name: "Long Kurtas", image: "https://images.unsplash.com/photo-1596401057633-565652b8ddbe?w=300" },
      { name: "Nehru Jackets", image: "https://images.unsplash.com/photo-1583391733958-e026b1346338?w=300" },
      { name: "Shirts", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300" },
    ]
  },
  "kids": {
    title: "Little Fab",
    description: "Soft, organic cottons for your little ones. Playful and pure.",
    heroImage: "https://images.unsplash.com/photo-1620015502396-857c0c16b5d9?q=80&w=2000&auto=format&fit=crop",
    subCategories: [
      { name: "Girls", image: "https://images.unsplash.com/photo-1620015502396-857c0c16b5d9?w=300" },
      { name: "Boys", image: "https://images.unsplash.com/photo-1596401057633-565652b8ddbe?w=300" },
      { name: "Infants", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300" },
    ]
  },
  "home-linen": {
    title: "Home & Living",
    description: "Transform your space with our handcrafted linens and decor.",
    heroImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2000&auto=format&fit=crop",
    subCategories: [
      { name: "Bed Linen", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?w=300" },
      { name: "Curtains", image: "https://images.unsplash.com/photo-1583391733958-e026b1346338?w=300" },
      { name: "Cushions", image: "https://images.unsplash.com/photo-1596401057633-565652b8ddbe?w=300" },
    ]
  },
  "furniture": {
    title: "Artisanal Furniture",
    description: "Solid wood furniture that tells a story of craftsmanship.",
    heroImage: "https://images.unsplash.com/photo-1538688536322-a7aaa27ae488?q=80&w=2000&auto=format&fit=crop",
    subCategories: [
      { name: "Seating", image: "https://images.unsplash.com/photo-1538688536322-a7aaa27ae488?w=300" },
      { name: "Tables", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?w=300" },
      { name: "Storage", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300" },
    ]
  },
  "beauty": {
    title: "Fab Essentials",
    description: "Natural, toxin-free personal care for glowing skin.",
    heroImage: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=2000&auto=format&fit=crop",
    subCategories: [
      { name: "Skincare", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=300" },
      { name: "Haircare", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?w=300" },
      { name: "Wellness", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300" },
    ]
  }
};