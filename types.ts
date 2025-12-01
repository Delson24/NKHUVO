

export type UserRole = 'organizer' | 'provider' | 'admin';

export interface BusinessHours {
  type: '24h' | 'custom';
  start?: string; // "09:00"
  end?: string;   // "17:00"
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'provider';
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  location?: string;
  phone?: string;
  whatsapp?: string;
  bio?: string;
  status?: 'active' | 'suspended' | 'pending'; // For admin control
  joinedDate?: string;
  businessHours?: BusinessHours;
  portfolio?: PortfolioItem[];
}

export type ServiceCategory = 
  | 'Musica' 
  | 'Catering' 
  | 'Decoracao' 
  | 'Venue' 
  | 'FotoVideo' 
  | 'Entretenimento' 
  | 'Seguranca' 
  | 'Equipamentos' 
  | 'Transporte'
  | 'Planeamento'
  | 'VestuarioBeleza';

export type BookingType = 'time_bound' | 'delivery_bound';

export interface CategoryDef {
  id: ServiceCategory;
  label: string;
  icon: string;
  subcategories: string[];
  bookingType: BookingType; // New field to determine calendar logic
}

export interface Service {
  id: string;
  providerId: string;
  name: string;
  category: ServiceCategory;
  subcategory: string; // New field for specific type
  description: string;
  price: number;
  priceUnit: 'hora' | 'evento' | 'pessoa' | 'dia' | 'unidade';
  location: string;
  rating: number;
  reviews: number;
  images: string[];
  features: string[];
  unavailableDates: string[]; // ISO Date strings YYYY-MM-DD (Blocked full days)
  status?: 'approved' | 'pending' | 'rejected'; // For admin moderation
  businessHours?: BusinessHours; // Snapshot of provider availability
}

export interface EventItem {
  id: string;
  organizerId: string;
  name: string;
  date: string; // ISO string
  type: string;
  location: string;
  guests: number;
  budget: number; // Total Budget Limit defined by organizer
  status: 'planning' | 'active' | 'completed';
  services: string[]; // Service IDs
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Booking {
  id: string;
  eventId: string;
  serviceId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string; // ISO string with START TIME
  endDate?: string; // ISO string with END TIME (Optional for delivery)
  amount: number;
  location?: string; // Location specified by organizer
}

export interface SystemStats {
  totalUsers: number;
  totalProviders: number;
  totalEvents: number;
  totalRevenue: number;
  activeBookings: number;
  growthRate: number; // Percentage
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  time: string;
  type: 'info' | 'warning' | 'success';
}