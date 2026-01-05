

// We define partial types for UI display to avoid strict Prisma dependency issues in this snippet
export type ProductWithDetails = {
  id: string
  name: string
  price: number
  stock: number
  status: "Active" | "Draft" | "Archived"
  category: string
  image: string
  variants: number // count
}

export const demoProducts: any[] = [
  {
    id: "prod_1",
    name: "Indigo Handblock Cotton Kurta",
    price: 2499.00,
    stock: 45,
    status: "Active",
    category: "Ethnic Wear",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=100",
    variants: 4 // S, M, L, XL
  },
  {
    id: "prod_2",
    name: "Beige Linen Trousers",
    price: 1850.00,
    stock: 12,
    status: "Active",
    category: "Bottoms",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=100",
    variants: 3
  },
  {
    id: "prod_3",
    name: "Floral Summer Maxi Dress",
    price: 3200.00,
    stock: 0,
    status: "Archived",
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=100",
    variants: 5
  },
]

export const demoStats = [
  { label: "Total Revenue", value: "$45,231.89", change: "+20.1% from last month" },
  { label: "Active Orders", value: "+2350", change: "+180.1% from last month" },
  { label: "Products in Stock", value: "12,234", change: "+19% from last month" },
]