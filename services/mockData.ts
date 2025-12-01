
import { Service, User, EventItem, Booking, CategoryDef, SystemStats } from '../types';

// CENTRALIZED APP LOGO
export const APP_LOGO = "https://ui-avatars.com/api/?name=N&background=4f46e5&color=fff&size=128&rounded=true&bold=true&font-size=0.6";

export const LOCATIONS = [
  'Maputo Cidade', 'Matola', 'Costa do Sol', 'Sommerschield', 'Polana Cimento', 
  'Zimpeto', 'Beira', 'Nampula', 'Inhambane', 'Xai-Xai', 'Pemba', 'Tete', 'Chimoio', 'Vilankulos'
];

export const CATEGORIES: CategoryDef[] = [
  { 
    id: 'Musica', 
    label: 'DJs e Música', 
    icon: 'Music',
    subcategories: ['DJs', 'Bandas ao vivo', 'MCs / Apresentadores', 'Saxofonistas', 'Coros Gospel', 'Técnicos de som']
  },
  { 
    id: 'Catering', 
    label: 'Catering & Bebida', 
    icon: 'Utensils',
    subcategories: ['Buffet Completo', 'Finger Food', 'Churrasqueiros', 'Bolos de Casamento', 'Bartenders & Cocktails', 'Vinhos & Espumantes']
  },
  { 
    id: 'Venue', 
    label: 'Salões & Locais', 
    icon: 'Home',
    subcategories: ['Salões de Luxo', 'Jardins para Eventos', 'Hotéis', 'Casas de Praia', 'Auditórios Corporativos']
  },
  { 
    id: 'Decoracao', 
    label: 'Decoração', 
    icon: 'Palette',
    subcategories: ['Decoradores Completos', 'Floristas', 'Aluguer de Mobiliário', 'Iluminação Decorativa', 'Balões e Festas']
  },
  { 
    id: 'FotoVideo', 
    label: 'Fotografia & Vídeo', 
    icon: 'Camera',
    subcategories: ['Fotografia de Casamento', 'Videografia Cinematográfica', 'Drones', 'Photo Booth / Cabine']
  },
  { 
    id: 'VestuarioBeleza', 
    label: 'Vestuário & Beleza', 
    icon: 'Shirt',
    subcategories: ['Maquilhadores (MUA)', 'Cabeleireiros', 'Estilistas & Alfaiates', 'Aluguer de Vestidos']
  },
  { 
    id: 'Transporte', 
    label: 'Transporte', 
    icon: 'Car',
    subcategories: ['Carros de Noiva (Luxo)', 'Autocarros para Convidados', 'Limousines', 'Logística']
  },
  { 
    id: 'Entretenimento', 
    label: 'Entretenimento', 
    icon: 'Smile',
    subcategories: ['Animadores Infantis', 'Humoristas', 'Dançarinos Tradicionais', 'Mágicos', 'Fogo de Artifício']
  },
  { 
    id: 'Equipamentos', 
    label: 'Equipamentos', 
    icon: 'Speaker',
    subcategories: ['Tendas & Palcos', 'Geradores', 'Sistema de Som PA', 'Ecrãs LED', 'Climatização']
  },
  { 
    id: 'Seguranca', 
    label: 'Segurança & Protocolo', 
    icon: 'Shield',
    subcategories: ['Protocolo & Recepcionistas', 'Segurança Privada', 'Valet Parking']
  }
];

// Helper to get today's date + n days
const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// --- REALISTIC SEED DATA FOR MOZAMBIQUE (SERVICES ONLY) ---
// We keep services so the app has content to browse.
export const MOCK_SERVICES: Service[] = [
  // VENUES
  {
    id: 's_venue_01',
    providerId: 'p_venue_01',
    name: 'Glória Hotel Maputo - Salão Nobre',
    category: 'Venue',
    subcategory: 'Hotéis',
    description: 'O local mais prestigiado de Maputo para grandes casamentos e conferências. Vista para a baía, serviço de 5 estrelas e capacidade para 800 pessoas sentadas.',
    price: 150000,
    priceUnit: 'dia',
    location: 'Costa do Sol',
    rating: 5.0,
    reviews: 89,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551632436-cbf8dd354ca8?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Gerador Industrial', 'Catering Exclusivo', 'Estacionamento 200 carros', 'Suite Presidencial incluída'],
    unavailableDates: [getFutureDate(5), getFutureDate(12), getFutureDate(13)],
    status: 'approved',
    businessHours: { type: '24h' }
  },
  {
    id: 's_venue_02',
    providerId: 'p_venue_02',
    name: 'Quinta das Acácias',
    category: 'Venue',
    subcategory: 'Jardins para Eventos',
    description: 'Um refúgio verde na Matola Rio. Perfeito para casamentos ao ar livre e festas de aniversário. Ambiente rústico e elegante.',
    price: 45000,
    priceUnit: 'evento',
    location: 'Matola',
    rating: 4.7,
    reviews: 42,
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af0bc3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Jardim Paisagístico', 'Cozinha de Apoio', 'Piscina Decorativa', 'Segurança 24h'],
    unavailableDates: [getFutureDate(2)],
    status: 'approved',
    businessHours: { type: 'custom', start: '08:00', end: '23:00' }
  },
  
  // DJ & MUSIC
  {
    id: 's_music_01',
    providerId: 'p_music_01',
    name: 'DJ Supaman Mozambique',
    category: 'Musica',
    subcategory: 'DJs',
    description: 'O rei do Afro-house e Amapiano. Experiência em festivais e casamentos de elite. Trago o meu próprio sistema de som JBL.',
    price: 25000,
    priceUnit: 'evento',
    location: 'Maputo Cidade',
    rating: 4.9,
    reviews: 156,
    images: [
      'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1642286469658-208b06626330?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Som Completo (PA)', 'Luzes de Pista', 'MC incluído', 'Playlist personalizada'],
    unavailableDates: [getFutureDate(1), getFutureDate(2), getFutureDate(8)],
    status: 'approved',
    businessHours: { type: 'custom', start: '18:00', end: '05:00' }
  },
  {
    id: 's_music_02',
    providerId: 'p_music_02',
    name: 'Banda Marrabenta Brasil',
    category: 'Musica',
    subcategory: 'Bandas ao vivo',
    description: 'Música ao vivo de alta qualidade. Tocamos Marrabenta, Jazz, Kizomba e Clássicos Internacionais. Banda de 6 elementos.',
    price: 60000,
    priceUnit: 'evento',
    location: 'Maputo Cidade',
    rating: 4.8,
    reviews: 30,
    images: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Instrumentos Próprios', 'Show de 4 horas', 'Música de Fundo para Jantar'],
    unavailableDates: [],
    status: 'approved'
  },

  // CATERING
  {
    id: 's_food_01',
    providerId: 'p_food_01',
    name: 'Sabores da Zambézia Catering',
    category: 'Catering',
    subcategory: 'Buffet Completo',
    description: 'A verdadeira gastronomia moçambicana. Frango à Zambeziana, Matapa com Caranguejo, Mucapata e muito mais. Serviço de luxo.',
    price: 1200,
    priceUnit: 'pessoa',
    location: 'Maputo Cidade',
    rating: 4.9,
    reviews: 210,
    images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Louça de Porcelana', 'Garçons Uniformizados', 'Bebidas Soft Incluídas', 'Sobremesas Típicas'],
    unavailableDates: [getFutureDate(10)],
    status: 'approved',
    businessHours: { type: '24h' }
  },
  {
    id: 's_cake_01',
    providerId: 'p_cake_01',
    name: 'Cake Design by Helena',
    category: 'Catering',
    subcategory: 'Bolos de Casamento',
    description: 'Bolos artísticos que são verdadeiras obras de arte. Pastas de açúcar, flores naturais e sabores gourmet (Red Velvet, Chocolate Belga).',
    price: 8000,
    priceUnit: 'unidade',
    location: 'Sommerschield',
    rating: 5.0,
    reviews: 95,
    images: [
      'https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562772386-b7234c919f8e?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Degustação Prévia', 'Entrega Segura', 'Design Personalizado', 'Noivinhos de Topo'],
    unavailableDates: [],
    status: 'approved'
  },

  // FOTO & VIDEO
  {
    id: 's_photo_01',
    providerId: 'p_photo_01',
    name: 'Pixel Moz Studios',
    category: 'FotoVideo',
    subcategory: 'Fotografia de Casamento',
    description: 'Equipa de 3 fotógrafos para capturar cada ângulo do seu dia. Estilo documental e editorial.',
    price: 45000,
    priceUnit: 'evento',
    location: 'Maputo Cidade',
    rating: 4.8,
    reviews: 67,
    images: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Álbum Impresso 40x30', 'Drone 4K', 'Entrega em Pen Drive Cristal', 'Sessão Pré-Wedding'],
    unavailableDates: [getFutureDate(3)],
    status: 'approved'
  },

  // DECOR
  {
    id: 's_decor_01',
    providerId: 'p_decor_01',
    name: 'Elegância Decor',
    category: 'Decoracao',
    subcategory: 'Decoradores Completos',
    description: 'Transformamos qualquer espaço num sonho. Especialistas em casamentos clássicos e modernos. Flores importadas.',
    price: 80000,
    priceUnit: 'evento',
    location: 'Polana Cimento',
    rating: 4.7,
    reviews: 112,
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1478146896981-b80fe4634430?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Flores Naturais', 'Cadeiras Tiffany/Dior', 'Centros de Mesa', 'Iluminação Cénica'],
    unavailableDates: [],
    status: 'approved'
  },

  // CARS
  {
    id: 's_car_01',
    providerId: 'p_car_01',
    name: 'LuxCars Wedding Fleet',
    category: 'Transporte',
    subcategory: 'Carros de Noiva (Luxo)',
    description: 'Chegue como uma rainha. Rolls Royce Phantom, Mercedes Classe S e Limousines.',
    price: 15000,
    priceUnit: 'dia',
    location: 'Maputo Cidade',
    rating: 4.9,
    reviews: 24,
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Motorista Fardado', 'Combustível Incluído', 'Decoração do Carro', 'Champanhe a Bordo'],
    unavailableDates: [],
    status: 'approved'
  },

  // BEAUTY
  {
    id: 's_beauty_01',
    providerId: 'p_beauty_01',
    name: 'Studio Glamour by Jessica',
    category: 'VestuarioBeleza',
    subcategory: 'Maquilhadores (MUA)',
    description: 'Maquilhagem profissional HD para noivas, resistente a lágrimas e calor. Produtos MAC e Huda Beauty.',
    price: 3500,
    priceUnit: 'pessoa',
    location: 'Polana Cimento',
    rating: 4.8,
    reviews: 150,
    images: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Teste de Maquilhagem', 'Pestanas Postiças', 'Deslocação ao Hotel', 'Kit Retoque'],
    unavailableDates: [],
    status: 'approved',
    businessHours: { type: 'custom', start: '06:00', end: '18:00' }
  }
];

// --- USERS ---
export const MOCK_USER: User = {
  id: 'u1',
  name: 'Joana Macamo',
  email: 'joana@email.com',
  role: 'organizer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  location: 'Maputo',
  phone: '84 123 4567',
  whatsapp: '84 123 4567',
  status: 'active',
  joinedDate: new Date().toISOString().split('T')[0] // Joined today
};

export const MOCK_PROVIDER_USER: User = {
  id: 'p_music_01',
  name: 'DJ Supaman',
  email: 'supaman@dj.co.mz',
  role: 'provider',
  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
  location: 'Maputo',
  phone: '84 999 8888',
  whatsapp: '84 999 8888',
  bio: 'DJ profissional com mais de 10 anos de experiência em casamentos e eventos corporativos. Especialista em criar a atmosfera perfeita.',
  status: 'active',
  joinedDate: '2024-11-20',
  businessHours: { type: 'custom', start: '18:00', end: '04:00' },
  portfolio: []
};

export const MOCK_ADMIN: User = {
  id: 'admin1',
  name: 'Administrador NKHUVO',
  email: 'admin@NKHUVO.com',
  role: 'admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin+Nkhuvo&background=312e81&color=fff',
  location: 'Maputo HQ',
  status: 'active'
};

// --- EVENTS & BOOKINGS (ZEROED OUT FOR FRESH START) ---
export const MOCK_EVENTS: EventItem[] = [];

export const MOCK_BOOKINGS: Booking[] = [];

// --- SYSTEM STATS (ZEROED OUT) ---
export const MOCK_SYSTEM_STATS: SystemStats = {
  totalUsers: 2, // Admin + Default User
  totalProviders: 1, // Default Provider
  totalEvents: 0,
  totalRevenue: 0,
  activeBookings: 0,
  growthRate: 0,
  recentActivity: []
};
