export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  category: string;
  description: string;
  features: string;
  images: string[];
  colors: string[] | null;
  in_stock: boolean;
  created_at: string;
}

export interface OrderItem {
  slug: string;
  name: string;
  price: number;
  qty: number;
  color?: string | null;
  image?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  address: string;
  mobile: string;
  items: OrderItem[];
  subtotal: number;
  delivery_charge: number;
  total: number;
  status: string;
  created_at: string;
}

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  qty: number;
  color?: string | null;
  image: string;
}

export const SHOP = {
  name: "Zenera",
  phone: "+880 1989-990678",
  whatsapp: "01989990678",
  address: "Noorjahan Road, Mohammadpur, Dhaka-1207",
  fbGadgets: "https://www.facebook.com/zenera1030",
  fbFashion: "https://www.facebook.com/onelineshopping1",
};

export function formatPrice(n: number): string {
  return "৳" + n.toLocaleString("bn-BD");
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("zenera_cart") || "[]");
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem("zenera_cart", JSON.stringify(items));
  window.dispatchEvent(new Event("zenera-cart-updated"));
}

export function cartCount(): number {
  return getCart().reduce((s, i) => s + i.qty, 0);
}
