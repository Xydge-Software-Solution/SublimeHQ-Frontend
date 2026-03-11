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

export type ProductType = "digital" | "event" | "video" | "coaching" | "course" | "membership";

// Event-specific fields
export interface EventDetails {
  eventType: "in-person" | "virtual" | "hybrid";
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  timezone: string;
  venue?: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    googleMapsUrl?: string;
  };
  virtualLink?: string;
  virtualPlatform?: "zoom" | "google-meet" | "teams" | "custom";
  maxAttendees?: number;
  currentAttendees: number;
  ticketTypes: {
    id: string;
    name: string;
    price: number;
    description?: string;
    maxQuantity?: number;
    soldCount: number;
    benefits?: string[];
  }[];
  agenda?: {
    time: string;
    title: string;
    description?: string;
    speaker?: string;
  }[];
  speakers?: {
    name: string;
    title: string;
    bio?: string;
    image?: string;
    socialLinks?: { platform: string; url: string }[];
  }[];
  faqs?: { question: string; answer: string }[];
  refundPolicy?: string;
  ageRestriction?: string;
  dressCode?: string;
  accessibilityInfo?: string;
}

// Video-specific fields
export interface VideoDetails {
  duration?: string;
  previewUrl?: string;
  videoUrl?: string; // Hosted URL (YouTube, Vimeo, etc.)
  videoFileUrl?: string; // Direct video file upload
  videoFileName?: string;
  videoFileSize?: string;
  format?: string;
  resolution?: string;
  chapters?: { title: string; startTime: string; description?: string }[];
  subtitles?: string[];
}

// Coaching-specific fields
export interface CoachingDetails {
  sessionDuration: number; // in minutes
  sessionType: "one-on-one" | "group";
  maxGroupSize?: number;
  deliveryMethod?: string[];
  platform?: string;
  availability?: { day: string; startTime: string; endTime: string }[];
  timezone?: string;
  bookingNotice?: number; // hours in advance
  cancellationPolicy?: string;
  includedSessions?: number;
  whatToExpect?: string[];
  requirements?: string[];
}

// Course-specific fields
export interface CourseDetails {
  totalDuration?: string;
  totalLessons?: number;
  totalModules?: number;
  skillLevel?: "beginner" | "intermediate" | "advanced" | "all-levels";
  modules?: {
    title: string;
    description?: string;
    order?: number;
    lessons: {
      title: string;
      duration?: string;
      type: "video" | "text" | "quiz" | "download";
      order?: number;
      isFree?: boolean;
    }[];
  }[];
  certificate?: boolean;
  instructor?: string;
  lifetime?: boolean;
  supportIncluded?: boolean;
  requirements?: string[];
  whatYouWillLearn?: string[];
}

// Membership-specific fields
export interface MembershipDetails {
  billingPeriod: "monthly" | "yearly" | "one-time";
  trialDays?: number;
  benefits?: string[];
  accessLevel?: string;
  exclusiveContent?: boolean;
  communityAccess?: boolean;
  discountPercentage?: number;
}

// Digital product-specific fields
export interface DigitalDetails {
  fileType: string;
  fileSize?: string;
  fileUrl?: string; // The actual downloadable product file
  fileName?: string;
  downloadLimit?: number;
  deliveryMethod: "instant" | "email";
  contents?: string[];
  systemRequirements?: string[];
  version?: string;
  updates?: "lifetime" | "limited" | "none";
}

export interface Product {
  id: string;
  type: ProductType;
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  gallery?: string[];
  rating: number;
  reviewCount: number;
  status: "published" | "draft";
  createdAt: string;
  sales: number;
  category?: string;
  tags?: string[];
  // Type-specific details
  digitalDetails?: DigitalDetails;
  eventDetails?: EventDetails;
  videoDetails?: VideoDetails;
  coachingDetails?: CoachingDetails;
  courseDetails?: CourseDetails;
  membershipDetails?: MembershipDetails;
}

// Attendee info for event/ticket products
export interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  ticketNumber: string;
}

export interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  product: string;
  productId: string;
  productType: ProductType;
  amount: number;
  status: "completed" | "pending" | "processing" | "cancelled";
  createdAt: string;
  // Event/ticket specific
  attendees?: Attendee[];
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

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  storeSlug: string;
  updatedAt: string;
}

// Payout types
export type PayoutProvider = "stripe" | "paystack" | "none";

export interface PayoutSettings {
  provider: PayoutProvider;
  stripeAccountId?: string;
  stripeConnected: boolean;
  paystackAccountId?: string;
  paystackConnected: boolean;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  payoutSchedule: "daily" | "weekly" | "monthly";
  minimumPayout: number;
  currency: string;
}

export interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "completed" | "failed";
  provider: PayoutProvider;
  createdAt: string;
  completedAt?: string;
  reference?: string;
}

// Account types
export interface AccountVerification {
  idType: "passport" | "national_id" | "drivers_license";
  idNumber: string;
  idImageUrl?: string;
  idImageName?: string;
  verificationStatus: "unverified" | "pending" | "verified" | "rejected";
  submittedAt?: string;
  verifiedAt?: string;
}

export interface AccountSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  timezone: string;
  language: string;
  country: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  verification?: AccountVerification;
}

// App Settings types
export interface AppSettings {
  notifications: {
    emailOrders: boolean;
    emailMarketing: boolean;
    emailPayouts: boolean;
    pushOrders: boolean;
    pushMarketing: boolean;
  };
  privacy: {
    publicProfile: boolean;
    showEarnings: boolean;
    allowAnalytics: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginNotifications: boolean;
    sessionTimeout: number; // minutes
  };
  display: {
    theme: "light" | "dark" | "system";
    compactMode: boolean;
    currency: string;
    dateFormat: string;
  };
}

// Customer types (store buyers)
export interface Customer {
  id: string;
  name: string;
  email: string;
  password: string; // In production, this would be hashed
  phone?: string;
  avatar?: string;
  createdAt: string;
  orders: string[]; // Order IDs
  storeSlug: string; // Which store they registered with
}

export interface CustomerAuth {
  isAuthenticated: boolean;
  customer: Customer | null;
}

// Product Review types
export interface ProductReview {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5
  title: string;
  content: string;
  createdAt: string;
  helpful: number; // count of "helpful" votes
  verified: boolean; // true if customer purchased the product
}

export interface StoreData {
  user: UserData | null;
  onboarding: OnboardingData | null;
  products: Product[];
  orders: Order[];
  stats: DashboardStats;
  chartData: ChartDataPoint[];
  storefront: StorefrontSettings;
  cart: Cart;
  payoutSettings: PayoutSettings;
  payouts: Payout[];
  accountSettings: AccountSettings | null;
  appSettings: AppSettings;
  customers: Customer[];
  customerAuth: CustomerAuth;
  reviews: ProductReview[];
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
}

const STORAGE_KEY = "sublime_store_data";

// Default mock data
const defaultProducts: Product[] = [
  {
    id: "prod_1",
    type: "course",
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
    type: "digital",
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
    type: "coaching",
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
    type: "digital",
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
    type: "video",
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
    type: "digital",
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
  { id: "#3210", customer: "John Smith", customerEmail: "john@email.com", product: "Digital Marketing Masterclass", productId: "prod_1", productType: "course", amount: 49.99, status: "completed", createdAt: "2024-03-05" },
  { id: "#3209", customer: "Emily Chen", customerEmail: "emily@email.com", product: "E-book Bundle", productId: "prod_2", productType: "digital", amount: 29.99, status: "completed", createdAt: "2024-03-05" },
  { id: "#3208", customer: "Michael Brown", customerEmail: "michael@email.com", product: "1-on-1 Coaching", productId: "prod_3", productType: "coaching", amount: 199.00, status: "pending", createdAt: "2024-03-04" },
  { id: "#3207", customer: "Sarah Wilson", customerEmail: "sarah@email.com", product: "Template Pack", productId: "prod_4", productType: "digital", amount: 19.99, status: "completed", createdAt: "2024-03-04" },
  { id: "#3206", customer: "David Lee", customerEmail: "david@email.com", product: "Premium Membership", productId: "prod_5", productType: "membership", amount: 99.00, status: "processing", createdAt: "2024-03-03" },
  { id: "#3205", customer: "Anna Martinez", customerEmail: "anna@email.com", product: "Video Editing Course", productId: "prod_6", productType: "video", amount: 79.99, status: "completed", createdAt: "2024-03-03" },
  { id: "#3204", customer: "James Taylor", customerEmail: "james@email.com", product: "Email Marketing Toolkit", productId: "prod_2", productType: "digital", amount: 39.99, status: "completed", createdAt: "2024-03-02" },
  { id: "#3203", customer: "Lisa Anderson", customerEmail: "lisa@email.com", product: "Digital Marketing Masterclass", productId: "prod_1", productType: "course", amount: 49.99, status: "completed", createdAt: "2024-03-01" },
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

const defaultCart: Cart = {
  items: [],
  storeSlug: "my-store",
  updatedAt: new Date().toISOString(),
};

const defaultPayoutSettings: PayoutSettings = {
  provider: "none",
  stripeConnected: false,
  paystackConnected: false,
  payoutSchedule: "weekly",
  minimumPayout: 100,
  currency: "USD",
};

const defaultPayouts: Payout[] = [
  { id: "pay_1", amount: 1250.00, currency: "USD", status: "completed", provider: "stripe", createdAt: "2024-03-01", completedAt: "2024-03-02", reference: "po_abc123" },
  { id: "pay_2", amount: 890.50, currency: "USD", status: "completed", provider: "stripe", createdAt: "2024-02-15", completedAt: "2024-02-16", reference: "po_def456" },
  { id: "pay_3", amount: 2100.00, currency: "USD", status: "processing", provider: "stripe", createdAt: "2024-03-08", reference: "po_ghi789" },
  { id: "pay_4", amount: 750.25, currency: "USD", status: "completed", provider: "stripe", createdAt: "2024-02-01", completedAt: "2024-02-02", reference: "po_jkl012" },
  { id: "pay_5", amount: 1500.00, currency: "USD", status: "pending", provider: "stripe", createdAt: "2024-03-10" },
];

const defaultAppSettings: AppSettings = {
  notifications: {
    emailOrders: true,
    emailMarketing: false,
    emailPayouts: true,
    pushOrders: true,
    pushMarketing: false,
  },
  privacy: {
    publicProfile: true,
    showEarnings: false,
    allowAnalytics: true,
  },
  security: {
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30,
  },
  display: {
    theme: "light",
    compactMode: false,
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
  },
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
    cart: defaultCart,
    payoutSettings: defaultPayoutSettings,
    payouts: defaultPayouts,
    accountSettings: null,
    appSettings: defaultAppSettings,
    customers: [],
    customerAuth: { isAuthenticated: false, customer: null },
    reviews: [],
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
        cart: {
          ...defaults.cart,
          ...(parsed.cart || {}),
        },
        customers: parsed.customers || [],
        customerAuth: parsed.customerAuth || { isAuthenticated: false, customer: null },
        reviews: parsed.reviews || [],
      };
      
      // Save merged data back if storefront or cart was missing
      if (!parsed.storefront || !parsed.cart) {
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

  // Cart methods
  getCart(): Cart {
    return this.getStore().cart;
  },

  getCartItems(): CartItem[] {
    return this.getCart().items;
  },

  getCartItemCount(): number {
    return this.getCartItems().reduce((sum, item) => sum + item.quantity, 0);
  },

  getCartTotal(): number {
    const items = this.getCartItems();
    let total = 0;
    for (const item of items) {
      const product = this.getProduct(item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    }
    return total;
  },

  getCartWithProducts(): Array<CartItem & { product: Product }> {
    const items = this.getCartItems();
    const result: Array<CartItem & { product: Product }> = [];
    for (const item of items) {
      const product = this.getProduct(item.productId);
      if (product) {
        result.push({ ...item, product });
      }
    }
    return result;
  },

  addToCart(productId: string, quantity: number = 1): void {
    const store = this.getStore();
    const existingIndex = store.cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingIndex >= 0) {
      store.cart.items[existingIndex].quantity += quantity;
    } else {
      store.cart.items.push({
        productId,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }
    store.cart.updatedAt = new Date().toISOString();
    this.setStore(store);
  },

  removeFromCart(productId: string): void {
    const store = this.getStore();
    store.cart.items = store.cart.items.filter(
      (item) => item.productId !== productId
    );
    store.cart.updatedAt = new Date().toISOString();
    this.setStore(store);
  },

  updateCartItemQuantity(productId: string, quantity: number): void {
    const store = this.getStore();
    const item = store.cart.items.find((item) => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        store.cart.updatedAt = new Date().toISOString();
        this.setStore(store);
      }
    }
  },

  clearCart(): void {
    const store = this.getStore();
    store.cart.items = [];
    store.cart.updatedAt = new Date().toISOString();
    this.setStore(store);
  },

  // Payout methods
  getPayoutSettings(): PayoutSettings {
    return this.getStore().payoutSettings;
  },

  updatePayoutSettings(settings: Partial<PayoutSettings>): PayoutSettings {
    const store = this.getStore();
    store.payoutSettings = { ...store.payoutSettings, ...settings };
    this.setStore(store);
    return store.payoutSettings;
  },

  connectStripe(accountId: string): void {
    const store = this.getStore();
    store.payoutSettings.stripeAccountId = accountId;
    store.payoutSettings.stripeConnected = true;
    store.payoutSettings.provider = "stripe";
    this.setStore(store);
  },

  disconnectStripe(): void {
    const store = this.getStore();
    store.payoutSettings.stripeAccountId = undefined;
    store.payoutSettings.stripeConnected = false;
    if (store.payoutSettings.provider === "stripe") {
      store.payoutSettings.provider = "none";
    }
    this.setStore(store);
  },

  connectPaystack(accountId: string): void {
    const store = this.getStore();
    store.payoutSettings.paystackAccountId = accountId;
    store.payoutSettings.paystackConnected = true;
    store.payoutSettings.provider = "paystack";
    this.setStore(store);
  },

  disconnectPaystack(): void {
    const store = this.getStore();
    store.payoutSettings.paystackAccountId = undefined;
    store.payoutSettings.paystackConnected = false;
    if (store.payoutSettings.provider === "paystack") {
      store.payoutSettings.provider = "none";
    }
    this.setStore(store);
  },

  getPayouts(): Payout[] {
    return this.getStore().payouts;
  },

  addPayout(payout: Omit<Payout, "id" | "createdAt">): Payout {
    const store = this.getStore();
    const newPayout: Payout = {
      ...payout,
      id: `pay_${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    store.payouts.unshift(newPayout);
    this.setStore(store);
    return newPayout;
  },

  // Account methods
  getAccountSettings(): AccountSettings | null {
    return this.getStore().accountSettings;
  },

  updateAccountSettings(settings: Partial<AccountSettings>): AccountSettings {
    const store = this.getStore();
    store.accountSettings = { 
      ...store.accountSettings, 
      ...settings 
    } as AccountSettings;
    this.setStore(store);
    return store.accountSettings;
  },

  updateAccountVerification(verification: Partial<AccountVerification>): void {
    const store = this.getStore();
    if (store.accountSettings) {
      store.accountSettings.verification = {
        ...store.accountSettings.verification,
        ...verification,
      } as AccountVerification;
      this.setStore(store);
    }
  },

  // App Settings methods
  getAppSettings(): AppSettings {
    return this.getStore().appSettings;
  },

  updateAppSettings(settings: Partial<AppSettings>): AppSettings {
    const store = this.getStore();
    store.appSettings = { ...store.appSettings, ...settings };
    this.setStore(store);
    return store.appSettings;
  },

  updateNotificationSettings(settings: Partial<AppSettings["notifications"]>): void {
    const store = this.getStore();
    store.appSettings.notifications = { ...store.appSettings.notifications, ...settings };
    this.setStore(store);
  },

  updatePrivacySettings(settings: Partial<AppSettings["privacy"]>): void {
    const store = this.getStore();
    store.appSettings.privacy = { ...store.appSettings.privacy, ...settings };
    this.setStore(store);
  },

  updateSecuritySettings(settings: Partial<AppSettings["security"]>): void {
    const store = this.getStore();
    store.appSettings.security = { ...store.appSettings.security, ...settings };
    this.setStore(store);
  },

  updateDisplaySettings(settings: Partial<AppSettings["display"]>): void {
    const store = this.getStore();
    store.appSettings.display = { ...store.appSettings.display, ...settings };
    this.setStore(store);
  },

  // Customer methods (store buyers)
  getCustomers(): Customer[] {
    return this.getStore().customers;
  },

  getCustomerById(id: string): Customer | null {
    return this.getStore().customers.find((c) => c.id === id) || null;
  },

  getCustomerByEmail(email: string): Customer | null {
    return this.getStore().customers.find((c) => c.email.toLowerCase() === email.toLowerCase()) || null;
  },

  registerCustomer(data: { name: string; email: string; password: string; storeSlug: string }): Customer | { error: string } {
    const store = this.getStore();
    
    // Check if customer already exists
    const existingCustomer = store.customers.find(
      (c) => c.email.toLowerCase() === data.email.toLowerCase()
    );
    
    if (existingCustomer) {
      return { error: "An account with this email already exists" };
    }

    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password, // In production, this would be hashed
      createdAt: new Date().toISOString(),
      orders: [],
      storeSlug: data.storeSlug,
    };

    store.customers.push(newCustomer);
    store.customerAuth = { isAuthenticated: true, customer: newCustomer };
    this.setStore(store);
    return newCustomer;
  },

  loginCustomer(email: string, password: string): Customer | { error: string } {
    const store = this.getStore();
    const customer = store.customers.find(
      (c) => c.email.toLowerCase() === email.toLowerCase()
    );

    if (!customer) {
      return { error: "No account found with this email" };
    }

    if (customer.password !== password) {
      return { error: "Invalid password" };
    }

    store.customerAuth = { isAuthenticated: true, customer };
    this.setStore(store);
    return customer;
  },

  logoutCustomer(): void {
    const store = this.getStore();
    store.customerAuth = { isAuthenticated: false, customer: null };
    this.setStore(store);
  },

  getCustomerAuth(): CustomerAuth {
    return this.getStore().customerAuth;
  },

  isCustomerAuthenticated(): boolean {
    return this.getStore().customerAuth.isAuthenticated;
  },

  getCurrentCustomer(): Customer | null {
    return this.getStore().customerAuth.customer;
  },

  addOrderToCustomer(customerId: string, orderId: string): void {
    const store = this.getStore();
    const customer = store.customers.find((c) => c.id === customerId);
    if (customer) {
      customer.orders.push(orderId);
      // Update customerAuth if this is the logged-in customer
      if (store.customerAuth.customer?.id === customerId) {
        store.customerAuth.customer = customer;
      }
      this.setStore(store);
    }
  },

  getCustomerOrders(customerId: string): Order[] {
    const store = this.getStore();
    const customer = store.customers.find((c) => c.id === customerId);
    if (!customer) return [];
    return store.orders.filter((order) => customer.orders.includes(order.id));
  },

  // Review methods
  getProductReviews(productId: string): ProductReview[] {
    return this.getStore().reviews.filter((r) => r.productId === productId);
  },

  addReview(review: Omit<ProductReview, "id" | "createdAt" | "helpful">): ProductReview {
    const store = this.getStore();
    const newReview: ProductReview = {
      ...review,
      id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      helpful: 0,
    };
    store.reviews.push(newReview);
    
    // Update product rating and reviewCount
    const product = store.products.find((p) => p.id === review.productId);
    if (product) {
      const productReviews = store.reviews.filter((r) => r.productId === review.productId);
      const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      product.rating = Math.round(avgRating * 10) / 10; // Round to 1 decimal
      product.reviewCount = productReviews.length;
    }
    
    this.setStore(store);
    return newReview;
  },

  canReviewProduct(customerId: string, productId: string): { canReview: boolean; reason?: string } {
    const store = this.getStore();
    
    // Check if customer has already reviewed this product
    const existingReview = store.reviews.find(
      (r) => r.customerId === customerId && r.productId === productId
    );
    if (existingReview) {
      return { canReview: false, reason: "You have already reviewed this product" };
    }
    
    // Check if customer has purchased this product
    const customer = store.customers.find((c) => c.id === customerId);
    if (!customer) {
      return { canReview: false, reason: "Customer not found" };
    }
    
    const customerOrders = store.orders.filter((o) => customer.orders.includes(o.id));
    const hasPurchased = customerOrders.some((order) => {
      // Check if any order contains this product (order.product stores product name, not ID)
      const product = store.products.find((p) => p.id === productId);
      return product && order.product === product.title;
    });
    
    return { canReview: true, reason: hasPurchased ? undefined : "not_purchased" };
  },

  markReviewHelpful(reviewId: string): void {
    const store = this.getStore();
    const review = store.reviews.find((r) => r.id === reviewId);
    if (review) {
      review.helpful += 1;
      this.setStore(store);
    }
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
