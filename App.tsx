


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
import { MOCK_SERVICES, MOCK_BOOKINGS, APP_LOGO, MOCK_EVENTS, MOCK_USER, MOCK_PROVIDER_USER, MOCK_ADMIN, CATEGORIES } from './services/mockData';
import { User, Service, Booking, EventItem, ChatMessage, BookingType } from './types';
import { Button, Toast } from './components/UI';
import { ChatModal } from './components/ChatModal';
import { AvailabilityCalendar } from './components/AvailabilityCalendar';
import { ArrowLeft, MessageCircle, Calendar, Camera, MapPin, Clock, Truck } from 'lucide-react';

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
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [allUsers, setAllUsers] = useState<User[]>([MOCK_USER, MOCK_PROVIDER_USER, MOCK_ADMIN]);

  // Toast Notification State
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error', visible: boolean}>({
    msg: '', type: 'success', visible: false
  });
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type, visible: true });
  };


  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeServiceChat, setActiveServiceChat] = useState<{serviceName: string, providerId: string} | null>(null);
  // Store chat history by providerId (simple keying for demo)
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({});

  // Booking State
  // Updated to include Start and End time
  const [bookingSelection, setBookingSelection] = useState<{date: Date, startTime: string, endTime: string} | null>(null);
  const [bookingLocation, setBookingLocation] = useState('');

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
    setBookingLocation('');
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'admin') {
      navigate('/admin');
    } else if (loggedInUser.role === 'organizer') {
      navigate('/dashboard');
    } else {
      // Logic moved to Auth.tsx for registration redirection, but login lands here
      navigate('/provider-dashboard');
    }
  };

  const handleRegister = (newUser: User) => {
      setAllUsers(prev => [...prev, newUser]);
      handleLogin(newUser);
  };

  // --- USER UPDATE HANDLER (Profile Edits) ---
  const handleUpdateUser = (updatedUser: User) => {
      // 1. Update the logged in user session if it matches
      if (user && user.id === updatedUser.id) {
          setUser(updatedUser);
      }
      
      // 2. Update the "Database" of users
      setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      
      showToast('Perfil atualizado com sucesso!');
  };

  const handleCreateService = (newService: Service) => {
    setServices(prev => [newService, ...prev]);
  };

  const handleCreateEvent = (newEvent: EventItem) => {
      // Update the user ID if the current user is logged in
      if (user) {
          newEvent.organizerId = user.id;
      }
      setEvents(prev => [newEvent, ...prev]);
      navigate('/dashboard');
  };

  const handleUpdateEvent = (updatedEvent: EventItem) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    showToast('Evento atualizado com sucesso!');
  };

  const handleRemoveBooking = (bookingId: string) => {
    if (window.confirm("Tem a certeza que deseja cancelar este serviço?")) {
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      showToast('Serviço removido e orçamento atualizado.');
    }
  };

  const handleCreateBooking = (serviceId: string, price: number, date: Date, bookingType: BookingType) => {
     if (!user) {
        navigate('/login');
        return;
     }
     if (!bookingLocation) {
        showToast("Por favor, indique a localização do evento.", "error");
        return;
     }
     
     // Construct correct ISO string including Start Time
     const startTime = bookingSelection?.startTime || "10:00";
     const [startH, startM] = startTime.split(':').map(Number);
     const bookingDate = new Date(date);
     bookingDate.setHours(startH, startM, 0, 0);

     // Construct End Time ISO
     let endDate;
     if (bookingType === 'time_bound') {
         const endTime = bookingSelection?.endTime || "11:00";
         const [endH, endM] = endTime.split(':').map(Number);
         endDate = new Date(date);
         endDate.setHours(endH, endM, 0, 0);
     } else {
         // For delivery, endDate matches start date or isn't strictly used for blocking
         endDate = new Date(bookingDate);
     }

     // Find the most recent event created by user to attach booking to, or use temp
     // In a real app, user would select event from dropdown
     const userLastEvent = events.find(e => e.organizerId === user.id);
     const eventId = userLastEvent ? userLastEvent.id : 'temp-event';

     const newBooking: Booking = {
        id: `b-${Date.now()}`,
        eventId: eventId,
        serviceId: serviceId,
        status: 'pending',
        date: bookingDate.toISOString(), // Start Time
        endDate: endDate.toISOString(),   // End Time
        amount: price,
        location: bookingLocation
     };
     setBookings(prev => [newBooking, ...prev]);
     showToast('Reserva enviada! O fornecedor confirmará o horário.');
     navigate('/dashboard');
  };

  const openChat = (serviceName: string, providerId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setActiveServiceChat({ serviceName, providerId });
    setIsChatOpen(true);
    
    // Initialize chat if empty
    if (!chatHistory[providerId]) {
        setChatHistory(prev => ({
            ...prev,
            [providerId]: [{
                id: 'init',
                text: `Olá! Obrigado pelo interesse em "${serviceName}". Como posso ajudar com o seu evento?`,
                sender: 'provider',
                timestamp: new Date()
            }]
        }));
    }
  };

  const handleSendMessage = (text: string) => {
      if (!activeServiceChat) return;
      const providerId = activeServiceChat.providerId;

      const userMsg: ChatMessage = {
          id: Date.now().toString(),
          text,
          sender: 'user',
          timestamp: new Date()
      };

      // Update state
      setChatHistory(prev => ({
          ...prev,
          [providerId]: [...(prev[providerId] || []), userMsg]
      }));

      // Auto reply simulation
      setTimeout(() => {
         const replyMsg: ChatMessage = {
             id: (Date.now() + 1).toString(),
             text: 'Recebemos a sua mensagem! Responderei em breve.',
             sender: 'provider',
             timestamp: new Date()
         };
         setChatHistory(prev => ({
            ...prev,
            [providerId]: [...(prev[providerId] || []), replyMsg]
        }));
      }, 1500);
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
        return <Home onNavigate={navigate} services={services} />;
      
      case '/dashboard':
        if (!user || user.role !== 'organizer') { navigate('/login'); return null; }
        // Filter events so user only sees their own
        const myEvents = events.filter(e => e.organizerId === user.id);
        return (
          <OrganizerDashboard 
            user={user} 
            onNavigate={navigate} 
            events={myEvents} 
            bookings={bookings}
            services={services}
            onUpdateEvent={handleUpdateEvent}
            onRemoveBooking={handleRemoveBooking}
          />
        );

      case '/provider-dashboard':
        if (!user || user.role !== 'provider') { navigate('/login'); return null; }
        return <ProviderDashboard user={user} onNavigate={navigate} services={services} bookings={bookings} />;

      case '/provider-profile':
        if (!user || user.role !== 'provider') { navigate('/login'); return null; }
        return (
            <ProviderProfile 
                user={user} 
                onNavigate={navigate} 
                services={services} 
                onAddService={handleCreateService} 
                onUpdateProfile={handleUpdateUser} // Pass the update handler
                isNewProvider={route.params?.new} 
            />
        );
      
      case '/admin':
        if (!user || user.role !== 'admin') { navigate('/login'); return null; }
        return (
            <AdminDashboard 
                user={user} 
                onNavigate={navigate} 
                users={allUsers}
                bookings={bookings}
                events={events}
                services={services}
            />
        );
      
      case '/login':
        return <Auth mode="login" onLogin={handleLogin} onNavigate={navigate} />;
        
      case '/register':
        // Wrap handleLogin to also add to allUsers
        return <Auth mode="register" onLogin={(u) => { handleRegister(u); }} onNavigate={navigate} />;

      case '/create-event':
         if (!user) { navigate('/login'); return null; }
         return <CreateEvent onNavigate={navigate} onFinish={handleCreateEvent} />;

      case '/explore':
        return <Explore onNavigate={navigate} initialSearch={route.params?.search} initialLocation={route.params?.location} services={services} />;

      case '/service-detail':
        const sId = route.params?.id;
        const service = services.find(s => s.id === sId);
        if (!service) return <div>Serviço não encontrado</div>;
        
        // Determine booking type (time or delivery)
        const categoryDef = CATEGORIES.find(c => c.id === service.category);
        const bookingType: BookingType = categoryDef?.bookingType || 'time_bound';

        // Find bookings for this service (Pass full booking objects to Calendar for interval checking)
        const serviceBookings = bookings.filter(b => b.serviceId === service.id && b.status === 'confirmed');

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
                              bookedSlots={serviceBookings} 
                              onSelect={(date, startTime, endTime) => setBookingSelection({date, startTime, endTime})}
                              businessHours={service.businessHours} 
                              bookingType={bookingType}
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
                                       <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                                           {bookingType === 'delivery_bound' ? 'Entrega Prevista' : 'Intervalo Selecionado'}
                                       </div>
                                       <div className="text-sm text-emerald-600 font-bold flex items-center justify-end">
                                          <Calendar size={14} className="mr-1" />
                                          {bookingSelection.date.getDate()}/{bookingSelection.date.getMonth()+1}
                                       </div>
                                       <div className="text-sm text-slate-600 font-bold flex items-center justify-end mt-0.5">
                                          {bookingType === 'delivery_bound' ? (
                                              <><Truck size={14} className="mr-1 text-slate-400" /> {bookingSelection.startTime}</>
                                          ) : (
                                              <><Clock size={14} className="mr-1 text-slate-400" /> {bookingSelection.startTime} - {bookingSelection.endTime}</>
                                          )}
                                       </div>
                                   </div>
                                )}
                            </div>

                            {/* Booking Location Input */}
                            {bookingSelection && (
                                <div className="animate-fade-in-up">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Localização do Evento / Entrega</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input 
                                            type="text" 
                                            placeholder="Ex: Salão de Festas Matola"
                                            className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 shadow-sm"
                                            value={bookingLocation}
                                            onChange={(e) => setBookingLocation(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                            
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
                                        className={`w-full justify-center py-4 text-lg transition-all shadow-lg ${bookingSelection && bookingLocation ? 'bg-indigo-600 shadow-indigo-200' : 'bg-slate-300 cursor-not-allowed hover:bg-slate-300 shadow-none'}`}
                                        onClick={() => (bookingSelection && bookingLocation) ? handleCreateBooking(service.id, service.price, bookingSelection.date, bookingType) : null}
                                        disabled={!bookingSelection || !bookingLocation}
                                    >
                                        {bookingSelection ? 'Confirmar Pedido' : 'Selecione uma Data e Horário'}
                                    </Button>
                                    {bookingSelection && !bookingLocation && (
                                        <p className="text-xs text-center text-red-500 mt-2">Por favor insira a localização.</p>
                                    )}
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
                messages={chatHistory[activeServiceChat.providerId] || []}
                onSendMessage={handleSendMessage}
              />
            )}
          </div>
        );
        
      default:
        return <Home onNavigate={navigate} services={services} />;
    }
  };

  if (user?.role === 'admin' && route.path === '/admin') {
    return (
      <div className="font-sans text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-800">
         <AdminDashboard 
            user={user} 
            onNavigate={navigate} 
            users={allUsers}
            bookings={bookings}
            events={events}
            services={services}
         />
      </div>
    );
  }

  return (
    <div className="font-sans text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-800">
      <Toast 
        message={toast.msg} 
        type={toast.type} 
        isVisible={toast.visible} 
        onClose={() => setToast({ ...toast, visible: false })} 
      />
      <Navbar user={user} onLogout={() => { setUser(null); navigate('/'); }} onNavigate={navigate} />
      {renderContent()}
      <Footer />
    </div>
  );
}

export default App;