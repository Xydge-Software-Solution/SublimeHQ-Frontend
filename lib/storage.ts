"use client";

// Types for stored data
export interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface OnboardingData {
  sellOptions: string[];
  businessType: string;
  productTypes: string[];
  storeName: string;
  storeDescription: string;
  completedAt?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  status: "published" | "draft";
  createdAt: string;
  sales: number;
}

export interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  product: string;
  amount: number;
  status: "completed" | "pending" | "processing" | "cancelled";
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  conversionRate: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  conversionChange: number;
}

export interface ChartDataPoint {
  date: string;
  orders: number;
  users: number;
}

// Storefront Types
export interface StorefrontNavbar {
  logoUrl: string;
  showCart: boolean;
}

export interface StorefrontHero {
  backgroundType: "gradient" | "image";
  gradientFrom: string;
  gradientTo: string;
  gradientDirection: string;
  backgroundImage: string;
  headline: string;
  subheadline: string;
  textColor: string;
}

export interface StorefrontTestimonial {
  id: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  content: string;
  productName: string;
  createdAt: string;
}

export interface StorefrontFooter {
  storeName: string;
  description: string;
  supportEmail: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  copyrightText: string;
}

export interface StorefrontSettings {
  isPublished: boolean;
  storeSlug: string;
  navbar: StorefrontNavbar;
  hero: StorefrontHero;
  productsOnStorefront: string[]; // Array of product IDs to show
  testimonials: StorefrontTestimonial[];
  footer: StorefrontFooter;
  updatedAt: string;
}

export interface StoreData {
  user: UserData | null;
  onboarding: OnboardingData | null;
  products: Product[];
  orders: Order[];
  stats: DashboardStats;
  chartData: ChartDataPoint[];
  storefront: StorefrontSettings;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
}

const STORAGE_KEY = "sublime_store_data";

// Default mock data
const defaultProducts: Product[] = [
  {
    id: "prod_1",
    title: "Digital Marketing Masterclass",
    description: "Learn proven strategies to grow your business online with social media, SEO, and paid advertising.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 124,
    status: "published",
    createdAt: "2024-01-15",
    sales: 45,
  },
  {
    id: "prod_2",
    title: "E-book Bundle: Content Creation",
    description: "5 comprehensive e-books covering writing, design, video production, and content strategy.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 89,
    status: "published",
    createdAt: "2024-01-20",
    sales: 38,
  },
  {
    id: "prod_3",
    title: "1-on-1 Business Coaching",
    description: "Personalized coaching sessions to help you launch and scale your online business.",
    price: 199.00,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    rating: 5.0,
    reviewCount: 32,
    status: "published",
    createdAt: "2024-01-25",
    sales: 28,
  },
  {
    id: "prod_4",
    title: "Premium Design Templates",
    description: "50+ professionally designed templates for social media, presentations, and marketing materials.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 156,
    status: "published",
    createdAt: "2024-02-01",
    sales: 32,
  },
  {
    id: "prod_5",
    title: "Video Editing Course",
    description: "Master video editing with step-by-step tutorials using industry-standard software.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 67,
    status: "published",
    createdAt: "2024-02-10",
    sales: 22,
  },
  {
    id: "prod_6",
    title: "Email Marketing Toolkit",
    description: "Complete toolkit with 30 email templates, automation guides, and copywriting tips.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop",
    rating: 4.4,
    reviewCount: 43,
    status: "published",
    createdAt: "2024-02-15",
    sales: 18,
  },
];

const defaultOrders: Order[] = [
  { id: "#3210", customer: "John Smith", customerEmail: "john@email.com", product: "Digital Marketing Masterclass", amount: 49.99, status: "completed", createdAt: "2024-03-05" },
  { id: "#3209", customer: "Emily Chen", customerEmail: "emily@email.com", product: "E-book Bundle", amount: 29.99, status: "completed", createdAt: "2024-03-05" },
  { id: "#3208", customer: "Michael Brown", customerEmail: "michael@email.com", product: "1-on-1 Coaching", amount: 199.00, status: "pending", createdAt: "2024-03-04" },
  { id: "#3207", customer: "Sarah Wilson", customerEmail: "sarah@email.com", product: "Template Pack", amount: 19.99, status: "completed", createdAt: "2024-03-04" },
  { id: "#3206", customer: "David Lee", customerEmail: "david@email.com", product: "Premium Membership", amount: 99.00, status: "processing", createdAt: "2024-03-03" },
  { id: "#3205", customer: "Anna Martinez", customerEmail: "anna@email.com", product: "Video Editing Course", amount: 79.99, status: "completed", createdAt: "2024-03-03" },
  { id: "#3204", customer: "James Taylor", customerEmail: "james@email.com", product: "Email Marketing Toolkit", amount: 39.99, status: "completed", createdAt: "2024-03-02" },
  { id: "#3203", customer: "Lisa Anderson", customerEmail: "lisa@email.com", product: "Digital Marketing Masterclass", amount: 49.99, status: "completed", createdAt: "2024-03-01" },
];

const defaultStats: DashboardStats = {
  totalRevenue: 12450,
  totalOrders: 156,
  totalCustomers: 2340,
  conversionRate: 3.2,
  revenueChange: 12.5,
  ordersChange: 8.2,
  customersChange: 23.1,
  conversionChange: -0.4,
};

const defaultChartData: ChartDataPoint[] = [
  { date: "Jan", orders: 65, users: 120 },
  { date: "Feb", orders: 85, users: 180 },
  { date: "Mar", orders: 72, users: 150 },
  { date: "Apr", orders: 95, users: 220 },
  { date: "May", orders: 110, users: 280 },
  { date: "Jun", orders: 125, users: 310 },
  { date: "Jul", orders: 140, users: 350 },
  { date: "Aug", orders: 130, users: 320 },
  { date: "Sep", orders: 156, users: 380 },
  { date: "Oct", orders: 145, users: 340 },
  { date: "Nov", orders: 165, users: 410 },
  { date: "Dec", orders: 180, users: 450 },
];

const defaultUser: UserData = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  createdAt: "2024-01-01",
};

const defaultStorefront: StorefrontSettings = {
  isPublished: false,
  storeSlug: "my-store",
  navbar: {
    logoUrl: "/logo.png",
    showCart: true,
  },
  hero: {
    backgroundType: "gradient",
    gradientFrom: "#4f46e5",
    gradientTo: "#7c3aed",
    gradientDirection: "to right",
    backgroundImage: "",
    headline: "Welcome to My Store",
    subheadline: "Discover amazing digital products crafted just for you",
    textColor: "#ffffff",
  },
  productsOnStorefront: ["prod_1", "prod_2", "prod_3", "prod_4", "prod_5", "prod_6"],
  testimonials: [],
  footer: {
    storeName: "My Store",
    description: "Your one-stop shop for premium digital products",
    supportEmail: "support@sublime.io",
    socialLinks: {},
    copyrightText: "© 2024 My Store. Powered by Sublime.",
  },
  updatedAt: new Date().toISOString(),
};

// Initialize store with default data
function getDefaultStore(): StoreData {
  return {
    user: defaultUser,
    onboarding: null,
    products: defaultProducts,
    orders: defaultOrders,
    stats: defaultStats,
    chartData: defaultChartData,
    storefront: defaultStorefront,
    isAuthenticated: true,
    hasCompletedOnboarding: false,
  };
}

// Storage utility functions
export const storage = {
  // Get all store data
  getStore(): StoreData {
    if (typeof window === "undefined") return getDefaultStore();
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const defaultData = getDefaultStore();
      this.setStore(defaultData);
      return defaultData;
    }
    
    try {
      const parsed = JSON.parse(stored) as Partial<StoreData>;
      const defaults = getDefaultStore();
      
      // Merge with defaults to ensure all properties exist
      const merged: StoreData = {
        ...defaults,
        ...parsed,
        // Ensure nested objects are properly merged
        storefront: {
          ...defaults.storefront,
          ...(parsed.storefront || {}),
          navbar: {
            ...defaults.storefront.navbar,
            ...(parsed.storefront?.navbar || {}),
          },
          hero: {
            ...defaults.storefront.hero,
            ...(parsed.storefront?.hero || {}),
          },
          footer: {
            ...defaults.storefront.footer,
            ...(parsed.storefront?.footer || {}),
          },
        },
        stats: {
          ...defaults.stats,
          ...(parsed.stats || {}),
        },
      };
      
      // Save merged data back if storefront was missing
      if (!parsed.storefront) {
        this.setStore(merged);
      }
      
      return merged;
    } catch {
      return getDefaultStore();
    }
  },

  // Set all store data
  setStore(data: StoreData): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  // User methods
  getUser(): UserData | null {
    return this.getStore().user;
  },

  setUser(user: UserData): void {
    const store = this.getStore();
    store.user = user;
    store.isAuthenticated = true;
    this.setStore(store);
  },

  // Auth methods
  isAuthenticated(): boolean {
    return this.getStore().isAuthenticated;
  },

  login(email: string, name: string): UserData {
    const user: UserData = {
      id: `user_${Date.now()}`,
      name,
      email,
      createdAt: new Date().toISOString(),
    };
    this.setUser(user);
    return user;
  },

  logout(): void {
    const store = this.getStore();
    store.user = null;
    store.isAuthenticated = false;
    store.hasCompletedOnboarding = false;
    store.onboarding = null;
    this.setStore(store);
  },

  // Onboarding methods
  getOnboarding(): OnboardingData | null {
    return this.getStore().onboarding;
  },

  setOnboarding(data: OnboardingData): void {
    const store = this.getStore();
    store.onboarding = { ...data, completedAt: new Date().toISOString() };
    store.hasCompletedOnboarding = true;
    this.setStore(store);
  },

  hasCompletedOnboarding(): boolean {
    return this.getStore().hasCompletedOnboarding;
  },

  // Products methods
  getProducts(): Product[] {
    return this.getStore().products;
  },

  getPublishedProducts(): Product[] {
    return this.getProducts().filter((p) => p.status === "published");
  },

  getProduct(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  },

  addProduct(product: Omit<Product, "id" | "createdAt" | "sales">): Product {
    const store = this.getStore();
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      sales: 0,
    };
    store.products.unshift(newProduct);
    this.setStore(store);
    return newProduct;
  },

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const store = this.getStore();
    const index = store.products.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    
    store.products[index] = { ...store.products[index], ...updates };
    this.setStore(store);
    return store.products[index];
  },

  deleteProduct(id: string): boolean {
    const store = this.getStore();
    const index = store.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    
    store.products.splice(index, 1);
    this.setStore(store);
    return true;
  },

  // Orders methods
  getOrders(): Order[] {
    return this.getStore().orders;
  },

  getRecentOrders(limit = 5): Order[] {
    return this.getOrders().slice(0, limit);
  },

  addOrder(order: Omit<Order, "id" | "createdAt">): Order {
    const store = this.getStore();
    const newOrder: Order = {
      ...order,
      id: `#${3300 + store.orders.length}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    store.orders.unshift(newOrder);
    this.setStore(store);
    return newOrder;
  },

  // Stats methods
  getStats(): DashboardStats {
    return this.getStore().stats;
  },

  updateStats(stats: Partial<DashboardStats>): void {
    const store = this.getStore();
    store.stats = { ...store.stats, ...stats };
    this.setStore(store);
  },

  // Chart data methods
  getChartData(): ChartDataPoint[] {
    return this.getStore().chartData;
  },

  // Storefront methods
  getStorefront(): StorefrontSettings {
    return this.getStore().storefront;
  },

  updateStorefront(settings: Partial<StorefrontSettings>): StorefrontSettings {
    const store = this.getStore();
    store.storefront = { 
      ...store.storefront, 
      ...settings, 
      updatedAt: new Date().toISOString() 
    };
    this.setStore(store);
    return store.storefront;
  },

  updateStorefrontNavbar(navbar: Partial<StorefrontNavbar>): void {
    const store = this.getStore();
    store.storefront.navbar = { ...store.storefront.navbar, ...navbar };
    store.storefront.updatedAt = new Date().toISOString();
    this.setStore(store);
  },

  updateStorefrontHero(hero: Partial<StorefrontHero>): void {
    const store = this.getStore();
    store.storefront.hero = { ...store.storefront.hero, ...hero };
    store.storefront.updatedAt = new Date().toISOString();
    this.setStore(store);
  },

  updateStorefrontFooter(footer: Partial<StorefrontFooter>): void {
    const store = this.getStore();
    store.storefront.footer = { ...store.storefront.footer, ...footer };
    store.storefront.updatedAt = new Date().toISOString();
    this.setStore(store);
  },

  addProductToStorefront(productId: string): void {
    const store = this.getStore();
    if (!store.storefront.productsOnStorefront.includes(productId)) {
      store.storefront.productsOnStorefront.push(productId);
      store.storefront.updatedAt = new Date().toISOString();
      this.setStore(store);
    }
  },

  removeProductFromStorefront(productId: string): void {
    const store = this.getStore();
    store.storefront.productsOnStorefront = store.storefront.productsOnStorefront.filter(
      (id) => id !== productId
    );
    store.storefront.updatedAt = new Date().toISOString();
    this.setStore(store);
  },

  addTestimonial(testimonial: Omit<StorefrontTestimonial, "id" | "createdAt">): StorefrontTestimonial {
    const store = this.getStore();
    const newTestimonial: StorefrontTestimonial = {
      ...testimonial,
      id: `testimonial_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    store.storefront.testimonials.push(newTestimonial);
    store.storefront.updatedAt = new Date().toISOString();
    this.setStore(store);
    return newTestimonial;
  },

  removeTestimonial(testimonialId: string): void {
    const store = this.getStore();
    store.storefront.testimonials = store.storefront.testimonials.filter(
      (t) => t.id !== testimonialId
    );
    store.storefront.updatedAt = new Date().toISOString();
    this.setStore(store);
  },

  publishStorefront(): void {
    const store = this.getStore();
    store.storefront.isPublished = true;
    store.storefront.updatedAt = new Date().toISOString();
    this.setStore(store);
  },

  unpublishStorefront(): void {
    const store = this.getStore();
    store.storefront.isPublished = false;
    store.storefront.updatedAt = new Date().toISOString();
    this.setStore(store);
  },

  // Reset to default data
  reset(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },
};

// Hook for reactive store access
export function useStore() {
  if (typeof window === "undefined") {
    return getDefaultStore();
  }
  return storage.getStore();
}
