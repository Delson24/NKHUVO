
import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { OrganizerDashboard } from './pages/Dashboard';
import { ProviderDashboard } from './pages/ProviderDashboard';
import { ProviderProfile } from './pages/ProviderProfile';
import { AdminDashboard } from './pages/AdminDashboard';
import { Explore } from './pages/Explore';
import { Auth } from './pages/Auth';
import { CreateEvent } from './pages/CreateEvent';
import { MOCK_SERVICES, MOCK_BOOKINGS, APP_LOGO } from './services/mockData';
import { User, Service, Booking } from './types';
import { Button } from './components/UI';
import { ChatModal } from './components/ChatModal';
import { AvailabilityCalendar } from './components/AvailabilityCalendar';
import { ArrowLeft, MessageCircle, Calendar, Camera } from 'lucide-react';

// Simplified Router
type Route = { path: string; params?: any };

function App() {
  const [route, setRoute] = useState<Route>({ path: '/' });
  const [user, setUser] = useState<User | null>(null);
  
  // App Loading State (Splash Screen)
  const [isAppLoading, setIsAppLoading] = useState(true);
  
  // GLOBAL STATE (Simulating Backend)
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeServiceChat, setActiveServiceChat] = useState<{serviceName: string, providerId: string} | null>(null);

  // Booking State
  const [bookingSelection, setBookingSelection] = useState<{date: Date, time: string} | null>(null);

  // Simulate Initial Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2500); // 2.5 seconds splash screen
    return () => clearTimeout(timer);
  }, []);

  const navigate = (path: string, params?: any) => {
    window.scrollTo(0, 0);
    setRoute({ path, params });
    setBookingSelection(null); // Reset booking on nav
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'admin') {
      navigate('/admin');
    } else if (loggedInUser.role === 'organizer') {
      navigate('/dashboard');
    } else {
      navigate('/provider-dashboard');
    }
  };

  const handleCreateService = (newService: Service) => {
    setServices(prev => [newService, ...prev]);
  };

  const handleCreateBooking = (serviceId: string, price: number, date: Date) => {
     if (!user) {
        navigate('/login');
        return;
     }
     const newBooking: Booking = {
        id: `b-${Date.now()}`,
        eventId: 'temp-event',
        serviceId: serviceId,
        status: 'pending',
        date: date.toISOString(),
        amount: price
     };
     setBookings(prev => [newBooking, ...prev]);
     alert('Reserva enviada com sucesso! O fornecedor confirmará em breve.');
     navigate('/dashboard');
  };

  const openChat = (serviceName: string, providerId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setActiveServiceChat({ serviceName, providerId });
    setIsChatOpen(true);
  };

  // Splash Screen Render
  if (isAppLoading) {
    return (
      <div className="fixed inset-0 bg-slate-50 z-[9999] flex flex-col items-center justify-center transition-opacity duration-700">
        <div className="relative flex flex-col items-center">
           {/* Glow Effect */}
           <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
           
           {/* Logo Animation */}
           <div className="relative z-10 mb-8 animate-float">
              <img 
                src={APP_LOGO} 
                alt="NKHUVO Loading" 
                className="w-24 h-24 rounded-2xl shadow-2xl object-cover"
              />
           </div>
           
           {/* Text Animation */}
           <h1 className="text-3xl font-bold text-slate-900 tracking-[0.3em] animate-pulse">
             NKHUVO<span className="text-indigo-600">.</span>
           </h1>
           
           {/* Loading Bar */}
           <div className="mt-8 w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-600 rounded-full animate-[loading_2s_ease-in-out_infinite]" style={{width: '50%'}}></div>
           </div>
        </div>
        
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  const renderContent = () => {
    switch (route.path) {
      case '/':
        return <Home onNavigate={navigate} />;
      
      case '/dashboard':
        if (!user || user.role !== 'organizer') { navigate('/login'); return null; }
        return <OrganizerDashboard user={user} onNavigate={navigate} />;

      case '/provider-dashboard':
        if (!user || user.role !== 'provider') { navigate('/login'); return null; }
        return <ProviderDashboard user={user} onNavigate={navigate} services={services} bookings={bookings} />;

      case '/provider-profile':
        if (!user || user.role !== 'provider') { navigate('/login'); return null; }
        return <ProviderProfile user={user} onNavigate={navigate} services={services} onAddService={handleCreateService} />;
      
      case '/admin':
        if (!user || user.role !== 'admin') { navigate('/login'); return null; }
        return <AdminDashboard user={user} onNavigate={navigate} />;
      
      case '/login':
        return <Auth mode="login" onLogin={handleLogin} onNavigate={navigate} />;
        
      case '/register':
        return <Auth mode="register" onLogin={handleLogin} onNavigate={navigate} />;

      case '/create-event':
         if (!user) { navigate('/login'); return null; }
         return <CreateEvent onNavigate={navigate} onFinish={() => navigate('/dashboard')} />;

      case '/explore':
        return <Explore onNavigate={navigate} initialSearch={route.params?.search} initialLocation={route.params?.location} services={services} />;

      case '/service-detail':
        const sId = route.params?.id;
        const service = services.find(s => s.id === sId);
        if (!service) return <div>Serviço não encontrado</div>;

        return (
          <div className="min-h-screen pt-24 pb-12 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <button onClick={() => navigate('/explore')} className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
                <ArrowLeft size={18} className="mr-2" /> Voltar
              </button>
              
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Left: Images */}
                <div className="space-y-6">
                  {/* Main Image */}
                  <div className="rounded-3xl overflow-hidden shadow-2xl h-[400px] lg:h-[600px] group relative cursor-pointer border border-slate-100">
                    <img src={service.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Main" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     {service.images[1] && <img src={service.images[1]} className="rounded-2xl h-40 w-full object-cover shadow-sm hover:opacity-90 transition-opacity cursor-pointer" alt="Thumb" />}
                     <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl h-40 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer" onClick={() => alert('Galeria em breve')}>
                        <Camera size={24} className="mb-2 opacity-50" />
                        <span className="font-medium text-sm">+ 4 fotos</span>
                     </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full py-3 border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm" 
                    onClick={() => alert('Visualização de galeria completa em breve!')}
                  >
                    <Camera size={18} className="mr-2" />
                    Ver Mais Fotos
                  </Button>
                  
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mt-4">
                      <h3 className="font-bold text-slate-900 mb-3">O que está incluído:</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {service.features.map((feat, i) => (
                          <li key={i} className="flex items-center text-sm text-slate-700">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div> {feat}
                          </li>
                        ))}
                      </ul>
                   </div>
                </div>

                {/* Right: Info & Booking */}
                <div>
                   <div className="sticky top-24">
                     <div className="flex items-center gap-2 mb-2">
                       <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase">{service.category}</span>
                       <span className="flex items-center text-amber-500 text-sm font-bold"><span className="mr-1">★</span> {service.rating} ({service.reviews} avaliações)</span>
                     </div>
                     
                     <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">{service.name}</h1>
                     <p className="text-slate-600 text-lg leading-relaxed mb-8">{service.description}</p>
                     
                     {/* Unified Booking Card */}
                     <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                        <div className="p-6">
                            <AvailabilityCalendar 
                              unavailableDates={service.unavailableDates || []}
                              onSelect={(date, time) => setBookingSelection({date, time})}
                            />
                        </div>
                        
                        <div className="bg-slate-50 p-6 border-t border-slate-100 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Total Estimado</p>
                                    <div className="text-3xl font-bold text-indigo-600">
                                      {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(service.price)}
                                      <span className="text-sm text-slate-400 font-normal">/{service.priceUnit}</span>
                                    </div>
                                </div>
                                {bookingSelection && (
                                   <div className="hidden sm:block text-right">
                                       <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Data</div>
                                       <div className="text-sm text-emerald-600 font-bold flex items-center justify-end">
                                          <Calendar size={14} className="mr-1" />
                                          {bookingSelection.date.getDate()}/{bookingSelection.date.getMonth()+1} às {bookingSelection.time}
                                       </div>
                                   </div>
                                )}
                            </div>
                            
                            {/* Buttons Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-center border-slate-300 hover:border-indigo-600 text-slate-600 hover:text-indigo-600 bg-white"
                                  onClick={() => openChat(service.name, service.providerId)}
                                >
                                  <MessageCircle size={18} className="mr-2" />
                                  Chat
                                </Button>
                                
                                <a 
                                  href={`https://wa.me/${service.providerId === 'p1' ? '258841234567' : '258849998888'}?text=Olá, vi o seu serviço ${service.name} no NKHUVO e gostaria de mais informações.`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block w-full"
                                >
                                  <Button 
                                    variant="outline"
                                    className="w-full justify-center border-green-500 text-green-600 hover:bg-green-50 bg-white"
                                  >
                                    WhatsApp
                                  </Button>
                                </a>

                                <div className="col-span-2">
                                    <Button 
                                        className={`w-full justify-center py-4 text-lg transition-all shadow-lg ${bookingSelection ? 'bg-indigo-600 shadow-indigo-200' : 'bg-slate-300 cursor-not-allowed hover:bg-slate-300 shadow-none'}`}
                                        onClick={() => bookingSelection ? handleCreateBooking(service.id, service.price, bookingSelection.date) : null}
                                        disabled={!bookingSelection}
                                    >
                                        {bookingSelection ? 'Confirmar Reserva' : 'Selecione uma Data acima'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
            
            {activeServiceChat && (
              <ChatModal 
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                serviceName={activeServiceChat.serviceName}
                providerName="Fornecedor Profissional"
              />
            )}
          </div>
        );
        
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  if (user?.role === 'admin' && route.path === '/admin') {
    return (
      <div className="font-sans text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-800">
        <AdminDashboard user={user} onNavigate={navigate} />
      </div>
    );
  }

  return (
    <div className="font-sans text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-800">
      <Navbar user={user} onLogout={() => { setUser(null); navigate('/'); }} onNavigate={navigate} />
      {renderContent()}
      <Footer />
    </div>
  );
}

export default App;
