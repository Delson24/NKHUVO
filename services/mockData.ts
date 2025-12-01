
import { Service, User, EventItem, Booking, CategoryDef, SystemStats } from '../types';

// CENTRALIZED APP LOGO
// Substitua este URL pelo URL da imagem real que você carregou
export const APP_LOGO = "https://ui-avatars.com/api/?name=N&background=4f46e5&color=fff&size=128&rounded=true&bold=true&font-size=0.6";

export const LOCATIONS = [
  'Maputo', 'Matola', 'Beira', 'Nampula', 'Inhambane', 'Xai-Xai', 'Pemba', 'Tete', 'Chimoio', 'Quelimane'
];

export const CATEGORIES: CategoryDef[] = [
  { 
    id: 'Musica', 
    label: 'DJs e Música', 
    icon: 'Music',
    subcategories: ['DJs', 'Bandas ao vivo', 'MCs / Apresentadores', 'Técnicos de som']
  },
  { 
    id: 'Catering', 
    label: 'Catering & Bebida', 
    icon: 'Utensils',
    subcategories: ['Cozinheiros', 'Empresas de catering', 'Churrasqueiros', 'Pastelaria / Bolos', 'Bartenders', 'Fornecedores de bebidas']
  },
  { 
    id: 'Decoracao', 
    label: 'Decoração', 
    icon: 'Palette',
    subcategories: ['Decoradores', 'Floristas', 'Aluguer de mobiliário', 'Iluminação decorativa', 'Cenografia']
  },
  { 
    id: 'Venue', 
    label: 'Salões & Locais', 
    icon: 'Home',
    subcategories: ['Salões de eventos', 'Quintas e jardins', 'Hotéis com salas', 'Espaços costeiros', 'Auditórios']
  },
  { 
    id: 'FotoVideo', 
    label: 'Fotografia & Vídeo', 
    icon: 'Camera',
    subcategories: ['Fotógrafos', 'Videógrafos', 'Drones', 'Live streaming']
  },
  { 
    id: 'Entretenimento', 
    label: 'Entretenimento', 
    icon: 'Smile',
    subcategories: ['Animadores infantis', 'Humoristas', 'Dançarinos', 'Performers culturais', 'Artistas de fogo/magia']
  },
  { 
    id: 'Seguranca', 
    label: 'Segurança', 
    icon: 'Shield',
    subcategories: ['Seguranças privados', 'Controladores de entrada', 'Brigada médica', 'Paramédicos']
  },
  { 
    id: 'Equipamentos', 
    label: 'Equipamentos', 
    icon: 'Speaker',
    subcategories: ['Som', 'Iluminação', 'Tendas / coberturas', 'Palcos', 'Ventilação / AC', 'Geradores']
  },
  { 
    id: 'Transporte', 
    label: 'Transporte', 
    icon: 'Car',
    subcategories: ['Aluguer de viaturas', 'Carros de noiva', 'Transporte para convidados', 'Logística']
  },
  { 
    id: 'Planeamento', 
    label: 'Planeamento', 
    icon: 'ClipboardList',
    subcategories: ['Planeadores de eventos', 'Coordenadores', 'Consultores de protocolo']
  },
  { 
    id: 'VestuarioBeleza', 
    label: 'Vestuário & Beleza', 
    icon: 'Shirt',
    subcategories: ['Costureiras / Alfaiates', 'Roupas de gala', 'Maquilhadores', 'Cabeleireiros']
  }
];

// Helper to get today's date + n days
const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const MOCK_SERVICES: Service[] = [
  {
    id: 's1',
    providerId: 'p1',
    name: 'DJ Maninho Vibes',
    category: 'Musica',
    subcategory: 'DJs',
    description: 'O melhor do Afro-house, Amapiano e Kizomba para o seu casamento ou festa privada. Equipamento de som JBL de última geração.',
    price: 15000,
    priceUnit: 'evento',
    location: 'Maputo',
    rating: 4.8,
    reviews: 124,
    images: [
      'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?q=80&w=1200&auto=format&fit=crop', 
      'https://images.unsplash.com/photo-1642286469658-208b06626330?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Sistema de som incluído', 'Iluminação básica', '5 horas de show', 'Playlist personalizada'],
    unavailableDates: [getFutureDate(2), getFutureDate(5), getFutureDate(6)],
    status: 'approved'
  },
  {
    id: 's2',
    providerId: 'p2',
    name: 'Sabores da Terra Catering',
    category: 'Catering',
    subcategory: 'Empresas de catering',
    description: 'Buffet completo com pratos típicos moçambicanos (Matapa, Frango à Zambeziana) e cozinha internacional.',
    price: 800,
    priceUnit: 'pessoa',
    location: 'Matola',
    rating: 4.9,
    reviews: 85,
    images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Garçons incluídos', 'Louça premium', 'Bebidas não alcoólicas', 'Sobremesas'],
    unavailableDates: [getFutureDate(1), getFutureDate(10)],
    status: 'approved'
  },
  {
    id: 's3',
    providerId: 'p3',
    name: 'Quinta do Sol',
    category: 'Venue',
    subcategory: 'Quintas e jardins',
    description: 'Espaço verde luxuoso para casamentos ao ar livre com vista para o mar. Capacidade para 300 pessoas.',
    price: 50000,
    priceUnit: 'dia',
    location: 'Inhambane',
    rating: 5.0,
    reviews: 42,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af0bc3?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Estacionamento privado', 'Cozinha industrial', 'Gerador de emergência', 'Suite para noivos'],
    unavailableDates: [getFutureDate(3), getFutureDate(4), getFutureDate(12)],
    status: 'approved'
  },
  {
    id: 's4',
    providerId: 'p4',
    name: 'Lentes Mágicas Studio',
    category: 'FotoVideo',
    subcategory: 'Fotógrafos',
    description: 'Capturamos os momentos mais emocionantes do seu dia especial com um olhar artístico e documental.',
    price: 25000,
    priceUnit: 'evento',
    location: 'Beira',
    rating: 4.7,
    reviews: 56,
    images: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Drone 4K', 'Álbum impresso 30x30', 'Edição em 48h', '2 Fotógrafos'],
    unavailableDates: [],
    status: 'approved'
  },
  {
    id: 's5',
    providerId: 'p5',
    name: 'Delícias da Mamã',
    category: 'Catering',
    subcategory: 'Pastelaria / Bolos',
    description: 'Bolos de casamento artísticos e salgados deliciosos para todos os gostos. Especialidade em bolos de noiva tradicionais.',
    price: 3500,
    priceUnit: 'unidade',
    location: 'Maputo',
    rating: 4.9,
    reviews: 210,
    images: [
      'https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562772386-b7234c919f8e?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Degustação gratuita', 'Design personalizado', 'Entregas ao domicílio', 'Opções sem glúten'],
    unavailableDates: [getFutureDate(7)],
    status: 'approved'
  },
  {
    id: 's6',
    providerId: 'p6',
    name: 'MC Gerson Alarico',
    category: 'Musica',
    subcategory: 'MCs / Apresentadores',
    description: 'Mestre de Cerimónias profissional com experiência em TV e Rádio. Trago elegância e animação na medida certa para o seu evento.',
    price: 10000,
    priceUnit: 'evento',
    location: 'Maputo',
    rating: 5.0,
    reviews: 34,
    images: [
      'https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Roteiro personalizado', 'Bilingue (PT/EN)', 'Interação com convidados', 'Gestão de tempo'],
    unavailableDates: [],
    status: 'approved'
  },
  {
    id: 's7',
    providerId: 'p7',
    name: 'LuxCars Mozambique',
    category: 'Transporte',
    subcategory: 'Carros de noiva',
    description: 'Aluguer de viaturas de luxo para noivos. Chegue ao seu casamento com estilo e conforto.',
    price: 8000,
    priceUnit: 'dia',
    location: 'Matola',
    rating: 4.6,
    reviews: 15,
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Motorista incluído', 'Decoração do carro', 'Champanhe a bordo', 'Pontualidade garantida'],
    unavailableDates: [getFutureDate(1)],
    status: 'approved'
  },
  {
    id: 's8',
    providerId: 'p1',
    name: 'Aluguer de Tendas & Cadeiras',
    category: 'Equipamentos',
    subcategory: 'Tendas / coberturas',
    description: 'Tudo o que precisa para montar o seu evento. Tendas, cadeiras Tiffany, mesas e toalhas.',
    price: 5000,
    priceUnit: 'evento',
    location: 'Maputo',
    rating: 4.5,
    reviews: 8,
    images: [
      'https://images.unsplash.com/photo-1530103862676-de3c9da59af7?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Montagem e Desmontagem', 'Transporte incluído', 'Material limpo e novo'],
    unavailableDates: [],
    status: 'approved'
  },
  {
    id: 's9',
    providerId: 'p8',
    name: 'Bela Noiva',
    category: 'VestuarioBeleza',
    subcategory: 'Maquilhadores',
    description: 'Maquilhagem profissional para noivas e madrinhas. Realçamos a sua beleza natural.',
    price: 2500,
    priceUnit: 'pessoa',
    location: 'Maputo',
    rating: 4.8,
    reviews: 45,
    images: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Prova incluída', 'Produtos premium', 'Deslocação ao local'],
    unavailableDates: [getFutureDate(2), getFutureDate(3)],
    status: 'approved'
  },
  {
    id: 's10',
    providerId: 'p9',
    name: 'Grupo Cultural Timbila',
    category: 'Entretenimento',
    subcategory: 'Performers culturais',
    description: 'Traga a tradição moçambicana para o seu evento com música e dança Chopi.',
    price: 12000,
    priceUnit: 'evento',
    location: 'Inhambane',
    rating: 4.9,
    reviews: 20,
    images: [
       'https://images.unsplash.com/photo-1514525253440-b393452e3383?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['10 Artistas', 'Instrumentos tradicionais', 'Show de 1 hora'],
    unavailableDates: [],
    status: 'pending' // One pending for demo
  }
];

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
  joinedDate: '2025-01-15'
};

export const MOCK_PROVIDER_USER: User = {
  id: 'p1',
  name: 'Maninho Vibes',
  email: 'maninho@dj.co.mz',
  role: 'provider',
  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
  location: 'Maputo',
  phone: '84 999 8888',
  whatsapp: '84 999 8888',
  bio: 'DJ profissional com mais de 10 anos de experiência em casamentos e eventos corporativos. Especialista em criar a atmosfera perfeita.',
  status: 'active',
  joinedDate: '2024-11-20'
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

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'e1',
    organizerId: 'u1',
    name: 'Casamento da Joana & Pedro',
    date: '2025-11-15T14:00:00.000Z',
    type: 'Casamento',
    location: 'Maputo',
    guests: 150,
    budget: 500000,
    status: 'planning',
    services: ['s1'],
    tasks: [
      { id: 't1', title: 'Reservar salão', completed: false },
      { id: 't2', title: 'Escolher vestido', completed: true },
      { id: 't3', title: 'Degustação do menu', completed: false }
    ]
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    eventId: 'e1',
    serviceId: 's1',
    status: 'confirmed',
    date: '2025-11-15T14:00:00.000Z',
    amount: 15000
  },
  {
    id: 'b2',
    eventId: 'e2',
    serviceId: 's1',
    status: 'pending',
    date: '2025-12-20T18:00:00.000Z',
    amount: 15000
  },
  {
    id: 'b3',
    eventId: 'e3',
    serviceId: 's8',
    status: 'completed',
    date: '2025-01-10T10:00:00.000Z',
    amount: 5000
  }
];

export const MOCK_SYSTEM_STATS: SystemStats = {
  totalUsers: 1250,
  totalProviders: 320,
  totalEvents: 450,
  totalRevenue: 2500000,
  activeBookings: 85,
  growthRate: 15.5,
  recentActivity: [
    { id: 'a1', user: 'Joana Macamo', action: 'Criou um novo evento: Casamento', time: '10 min atrás', type: 'info' },
    { id: 'a2', user: 'DJ Maninho', action: 'Recebeu uma nova reserva', time: '1 hora atrás', type: 'success' },
    { id: 'a3', user: 'Sabores Catering', action: 'Atualizou o preçário', time: '3 horas atrás', type: 'info' },
    { id: 'a4', user: 'Novo Utilizador', action: 'Tentativa de login falhada', time: '5 horas atrás', type: 'warning' }
  ]
};
