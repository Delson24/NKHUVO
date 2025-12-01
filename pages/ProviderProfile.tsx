


import React, { useState, useEffect } from 'react';
import { User, Service, ServiceCategory, BusinessHours, PortfolioItem } from '../types';
import { CATEGORIES, LOCATIONS } from '../services/mockData';
import { Button, Toast, FileUploader } from '../components/UI';
import { MapPin, Phone, Save, Camera, Plus, Trash2, Edit2, ArrowLeft, MessageCircle, Loader2, X, User as UserIcon, AlignLeft, ExternalLink, Clock, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface Props {
  user: User;
  onNavigate: (path: string) => void;
  services: Service[];
  onAddService: (s: Service) => void;
  onUpdateProfile: (u: User) => void; // New prop to persist changes
  isNewProvider?: boolean; // Prop to trigger onboarding
}

export const ProviderProfile: React.FC<Props> = ({ user, onNavigate, services, onAddService, onUpdateProfile, isNewProvider = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    avatar: user.avatar,
    location: user.location || '',
    customLocation: '', // To hold custom input
    phone: user.phone || '',
    whatsapp: user.whatsapp || '',
    bio: user.bio || '',
    businessHours: user.businessHours || { type: '24h', start: '09:00', end: '17:00' } as BusinessHours
  });

  // Notifications
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error', visible: boolean}>({
    msg: '', type: 'success', visible: false
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type, visible: true });
  };

  // Portfolio State
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(user.portfolio || []);
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ title: '', description: '', image: '' });

  // Onboarding Modal State
  const [showOnboarding, setShowOnboarding] = useState(isNewProvider);

  // Modal State for New Service
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newService, setNewService] = useState<Partial<Service> & { customSubcategory?: string }>({
     name: '', price: 0, description: '', location: user.location || 'Maputo', features: [], images: []
  });

  const myServices = services.filter(s => s.providerId === user.id);

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Combine location if custom
    const finalLocation = profileData.location === 'Outra' && profileData.customLocation 
        ? profileData.customLocation 
        : profileData.location;

    // Construct full User object with updates
    const updatedUser: User = {
        ...user,
        name: profileData.name,
        avatar: profileData.avatar,
        location: finalLocation,
        phone: profileData.phone,
        whatsapp: profileData.whatsapp,
        bio: profileData.bio,
        businessHours: profileData.businessHours,
        portfolio: portfolio // Ensure portfolio is saved too
    };

    // Simulate API save
    setTimeout(() => {
      onUpdateProfile(updatedUser); // Update global state
      setIsSaving(false);
      setIsEditing(false);
    }, 1000);
  };

  const handleAvatarChange = (base64: string) => {
    setProfileData(prev => ({ ...prev, avatar: base64 }));
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newPortfolio.title || !newPortfolio.image) {
        showToast('Por favor, adicione um título e uma imagem.', 'error');
        return;
    }

    const item: PortfolioItem = {
      id: `pf-${Date.now()}`,
      title: newPortfolio.title,
      description: newPortfolio.description,
      image: newPortfolio.image,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedPortfolio = [item, ...portfolio];
    setPortfolio(updatedPortfolio);

    // Also persist this update immediately to user profile
    const updatedUser: User = {
        ...user,
        portfolio: updatedPortfolio
    };
    onUpdateProfile(updatedUser);

    setIsAddPortfolioOpen(false);
    setNewPortfolio({ title: '', description: '', image: '' });
    showToast('Trabalho adicionado ao portfólio!');
  };

  const handleSubmitService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.category || !newService.price) {
        showToast('Preencha os campos obrigatórios.', 'error');
        return;
    }

    // Determine subcategory
    const sub = newService.subcategory === 'Outro' && newService.customSubcategory 
        ? newService.customSubcategory 
        : newService.subcategory || 'Geral';

    const serviceToAdd: Service = {
      id: `s-${Date.now()}`,
      providerId: user.id,
      name: newService.name,
      category: newService.category as ServiceCategory,
      subcategory: sub,
      description: newService.description || '',
      price: Number(newService.price),
      priceUnit: newService.priceUnit || 'evento',
      location: newService.location || 'Maputo',
      rating: 5.0, // New service starts with 5 stars
      reviews: 0,
      images: [
         newService.images?.[0] || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop' 
      ],
      features: ['Serviço Profissional', 'Garantia de Qualidade'],
      unavailableDates: [],
      status: 'pending',
      businessHours: profileData.businessHours // Inherit provider hours
    };
    
    onAddService(serviceToAdd);
    setIsAddServiceOpen(false);
    setNewService({ name: '', price: 0, description: '', location: 'Maputo', images: [] });
    showToast('Serviço criado! Aguardando aprovação.');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <Toast 
        message={toast.msg} 
        type={toast.type} 
        isVisible={toast.visible} 
        onClose={() => setToast({ ...toast, visible: false })} 
      />

      <div className="max-w-5xl mx-auto">
        
        <button 
          onClick={() => onNavigate('/provider-dashboard')} 
          className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={18} className="mr-2" /> Voltar ao Dashboard
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Personal Profile & Edit Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-28">
               
               {/* Avatar Section */}
               <div className="flex flex-col items-center mb-6">
                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 mb-4 shadow-lg bg-slate-100 relative group cursor-pointer">
                    <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
                    
                    {/* Hidden input label for avatar upload */}
                    {isEditing && (
                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera size={24} />
                            <input 
                                type="file" 
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if(file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => handleAvatarChange(reader.result as string);
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </label>
                    )}
                 </div>
               </div>

               {/* View Mode */}
               {!isEditing ? (
                  <div className="text-center">
                      <h2 className="text-xl font-bold text-slate-900">{profileData.name}</h2>
                      <div className="flex items-center justify-center text-slate-500 text-sm mt-1 mb-4">
                        <MapPin size={14} className="mr-1" /> {profileData.location === 'Outra' ? profileData.customLocation : profileData.location || 'Sem localização'}
                      </div>
                      
                      {profileData.bio && (
                        <p className="text-sm text-slate-600 italic mb-6 px-2 leading-relaxed bg-slate-50 py-3 rounded-xl border border-slate-100">
                           "{profileData.bio}"
                        </p>
                      )}

                      <div className="space-y-4 text-left border-t border-slate-50 pt-4 mb-6">
                          <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chamadas</p>
                              <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                                  <Phone size={18} className="text-indigo-500" />
                                  {profileData.phone || '-'}
                              </div>
                          </div>
                          <div>
                              <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">WhatsApp</p>
                              <a 
                                href={profileData.whatsapp ? `https://wa.me/${profileData.whatsapp.replace(/\D/g,'')}` : '#'} 
                                target="_blank" 
                                rel="noreferrer"
                                className="block w-full group"
                              >
                                  <Button 
                                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-md shadow-green-100 flex justify-center items-center"
                                  >
                                    <MessageCircle size={18} className="mr-2" />
                                    Conversar no WhatsApp
                                    <ExternalLink size={14} className="ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                                  </Button>
                              </a>
                          </div>
                          <div>
                               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Disponibilidade</p>
                               <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                                  <Clock size={18} className="text-orange-500" />
                                  {profileData.businessHours.type === '24h' ? '24/24 Horas' : `${profileData.businessHours.start} - ${profileData.businessHours.end}`}
                               </div>
                          </div>
                      </div>

                      <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full text-sm py-2.5">
                        <Edit2 size={16} className="mr-2" /> Editar Perfil
                      </Button>
                  </div>
               ) : (
                  /* Edit Mode Form */
                  <div className="space-y-4 animate-fade-in-up">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Nome da Empresa</label>
                        <div className="relative">
                           <UserIcon size={16} className="absolute left-3 top-3 text-slate-400" />
                           <input 
                              className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:border-indigo-500 outline-none focus:ring-2 focus:ring-indigo-100 transition-all" 
                              value={profileData.name} 
                              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                              placeholder="Nome"
                           />
                        </div>
                     </div>
                     
                     <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Localização</label>
                        <div className="relative">
                           <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                           <select 
                              className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:border-indigo-500 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-100 transition-all"
                              value={profileData.location}
                              onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                           >
                              <option value="">Selecione...</option>
                              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                              <option value="Outra">Outra</option>
                           </select>
                        </div>
                        {profileData.location === 'Outra' && (
                           <input 
                              className="w-full mt-2 pl-3 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:border-indigo-500 outline-none" 
                              placeholder="Digite a localização..." 
                              value={profileData.customLocation} 
                              onChange={(e) => setProfileData({...profileData, customLocation: e.target.value})}
                           />
                        )}
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Bio / Sobre</label>
                        <div className="relative">
                            <AlignLeft size={16} className="absolute left-3 top-3 text-slate-400" />
                            <textarea 
                                className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:border-indigo-500 outline-none min-h-[80px] focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                                value={profileData.bio}
                                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                                placeholder="Descreva os seus serviços..."
                            />
                        </div>
                     </div>

                     <div className="pt-2 border-t border-slate-100 mt-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Telefone (Chamadas)</label>
                        <div className="relative">
                           <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                           <input 
                              className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:border-indigo-500 outline-none focus:ring-2 focus:ring-indigo-100 transition-all" 
                              value={profileData.phone} 
                              onChange={e => setProfileData({...profileData, phone: e.target.value})}
                              placeholder="+258..."
                           />
                        </div>
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-green-600 mb-1 ml-1">WhatsApp</label>
                        <div className="relative">
                           <MessageCircle size={16} className="absolute left-3 top-3 text-green-600" />
                           <input 
                              className="w-full pl-10 pr-3 py-2.5 text-sm border border-green-200 rounded-xl bg-green-50 text-green-900 placeholder:text-green-700/50 focus:border-green-500 outline-none focus:ring-2 focus:ring-green-100 transition-all" 
                              value={profileData.whatsapp} 
                              onChange={e => setProfileData({...profileData, whatsapp: e.target.value})}
                              placeholder="+258..."
                           />
                        </div>
                     </div>

                     {/* Availability Section */}
                     <div className="pt-2 border-t border-slate-100 mt-2">
                        <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">Horário de Atendimento</label>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                           <div className="flex gap-2">
                              <button 
                                type="button"
                                onClick={() => setProfileData({...profileData, businessHours: { ...profileData.businessHours, type: '24h' }})}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${profileData.businessHours.type === '24h' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}
                              >
                                24/24 Horas
                              </button>
                              <button 
                                type="button"
                                onClick={() => setProfileData({...profileData, businessHours: { ...profileData.businessHours, type: 'custom' }})}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${profileData.businessHours.type === 'custom' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}
                              >
                                Horário Fixo
                              </button>
                           </div>
                           
                           {profileData.businessHours.type === 'custom' && (
                              <div className="flex items-center gap-2 animate-fade-in-up">
                                 <div className="flex-1">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase">De</label>
                                    <input 
                                      type="time" 
                                      value={profileData.businessHours.start || '09:00'}
                                      onChange={(e) => setProfileData({...profileData, businessHours: { ...profileData.businessHours, start: e.target.value }})}
                                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                                    />
                                 </div>
                                 <div className="flex-1">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase">Até</label>
                                    <input 
                                      type="time" 
                                      value={profileData.businessHours.end || '17:00'}
                                      onChange={(e) => setProfileData({...profileData, businessHours: { ...profileData.businessHours, end: e.target.value }})}
                                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                                    />
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="flex gap-2 pt-2">
                        <Button variant="secondary" onClick={() => setIsEditing(false)} className="flex-1 bg-slate-100 text-slate-600 shadow-none hover:bg-slate-200" disabled={isSaving}>
                           Cancelar
                        </Button>
                        <Button onClick={handleSaveProfile} className="flex-1" disabled={isSaving}>
                           {isSaving ? <><Loader2 className="animate-spin mr-2" size={16}/> Guardar</> : 'Guardar'}
                        </Button>
                     </div>
                  </div>
               )}
            </div>
          </div>

          {/* Right Column: Services & Portfolio */}
          <div className="lg:col-span-2 space-y-8">
             {/* Services Section */}
             <div className="space-y-6">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Meus Serviços</h2>
                        <p className="text-slate-500 text-sm">Gerencie o seu portfólio de serviços ativos.</p>
                    </div>
                    <Button onClick={() => setIsAddServiceOpen(true)}>
                       <Plus size={18} className="mr-2" /> Adicionar Novo
                    </Button>
                 </div>

                 {myServices.length > 0 ? (
                   <div className="grid gap-4">
                      {myServices.map(service => (
                         <div key={service.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-5 items-start group hover:border-indigo-200 transition-all">
                            <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden shadow-sm">
                               <img src={service.images[0]} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 w-full">
                               <div className="flex justify-between items-start">
                                  <div>
                                     <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{service.name}</h3>
                                     <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">{service.category}</span>
                                  </div>
                                  <div className="flex gap-1">
                                     <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                                     <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                  </div>
                               </div>
                               <p className="text-slate-500 text-sm mt-2 line-clamp-2">{service.description}</p>
                               <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                                   <div className="font-bold text-slate-800">{service.price.toLocaleString()} MZN <span className="text-xs font-normal text-slate-400">/{service.priceUnit}</span></div>
                                   <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                      <span className={`w-2 h-2 rounded-full ${service.status === 'approved' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                      {service.status === 'approved' ? 'Aprovado' : 'Pendente'}
                                   </div>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                 ) : (
                   <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-300">
                         <Plus size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Ainda não tem serviços</h3>
                      <p className="text-slate-500 text-sm mt-1 mb-6">Comece por adicionar o seu primeiro serviço.</p>
                      <Button variant="outline" onClick={() => setIsAddServiceOpen(true)}>Criar Primeiro Serviço</Button>
                   </div>
                 )}
             </div>

             {/* Portfolio Section */}
             <div className="space-y-6 pt-6 border-t border-slate-200/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Portfólio & Trabalhos</h2>
                        <p className="text-slate-500 text-sm">Mostre os seus melhores trabalhos anteriores.</p>
                    </div>
                    <Button variant="secondary" onClick={() => setIsAddPortfolioOpen(true)}>
                       <ImageIcon size={18} className="mr-2" /> Adicionar Foto
                    </Button>
                </div>
                
                {portfolio.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                     {portfolio.map(item => (
                       <div key={item.id} className="group relative rounded-2xl overflow-hidden aspect-square border border-slate-100 shadow-sm cursor-pointer">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                             <h4 className="text-white font-bold text-sm">{item.title}</h4>
                             <p className="text-white/80 text-xs line-clamp-2">{item.description}</p>
                          </div>
                       </div>
                     ))}
                  </div>
                ) : (
                   <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-slate-500 text-sm">Nenhum trabalho adicionado ainda.</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* ADD SERVICE MODAL */}
      {isAddServiceOpen && (
         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                  <h3 className="text-xl font-bold text-slate-900">Novo Serviço</h3>
                  <button onClick={() => setIsAddServiceOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
               </div>
               <form onSubmit={handleSubmitService} className="p-6 space-y-6">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Nome do Serviço</label>
                     <input required className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-indigo-500 outline-none focus:ring-2 focus:ring-indigo-50 transition-all" placeholder="Ex: Fotografia Premium Casamento" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Categoria</label>
                        <select required className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-indigo-500 outline-none focus:ring-2 focus:ring-indigo-50 transition-all" onChange={e => setNewService({...newService, category: e.target.value as ServiceCategory})}>
                           <option value="">Selecione...</option>
                           {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                     </div>
                     <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Subcategoria</label>
                         <select 
                             required={!newService.subcategory || newService.subcategory !== 'Outro'}
                             className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-indigo-500 outline-none focus:ring-2 focus:ring-indigo-50 transition-all mb-2" 
                             onChange={e => setNewService({...newService, subcategory: e.target.value})}
                         >
                            <option value="">Selecione...</option>
                            {newService.category && CATEGORIES.find(c => c.id === newService.category)?.subcategories.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                            <option value="Outro">Outro (Personalizar)</option>
                         </select>
                         {newService.subcategory === 'Outro' && (
                             <input 
                                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-indigo-500 outline-none"
                                placeholder="Especifique a subcategoria..."
                                value={newService.customSubcategory || ''}
                                onChange={e => setNewService({...newService, customSubcategory: e.target.value})}
                             />
                         )}
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Preço (MZN)</label>
                    <input required type="number" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-indigo-500 outline-none focus:ring-2 focus:ring-indigo-50 transition-all" placeholder="0.00" value={newService.price} onChange={e => setNewService({...newService, price: Number(e.target.value)})} />
                  </div>
                  
                  {/* Service Image Upload */}
                  <FileUploader 
                     label="Imagem Principal do Serviço"
                     onFileSelect={(base64) => setNewService(prev => ({ ...prev, images: [base64] }))}
                     currentImage={newService.images?.[0]}
                  />

                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Descrição</label>
                     <textarea className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 h-32 focus:border-indigo-500 outline-none focus:ring-2 focus:ring-indigo-50 transition-all resize-none" placeholder="Descreva os detalhes do serviço, o que inclui, etc..." value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})}></textarea>
                  </div>
                  <div className="pt-2">
                     <Button type="submit" className="w-full py-4 text-lg shadow-xl shadow-indigo-200">Publicar Serviço</Button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* ADD PORTFOLIO MODAL */}
      {isAddPortfolioOpen && (
         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">Novo Trabalho</h3>
                  <button onClick={() => setIsAddPortfolioOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
               </div>
               <form onSubmit={handleAddPortfolio} className="p-6 space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Título do Evento</label>
                     <input required className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-indigo-500 outline-none" placeholder="Ex: Casamento Matola" value={newPortfolio.title} onChange={e => setNewPortfolio({...newPortfolio, title: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Descrição Curta</label>
                     <textarea className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 h-20 outline-none resize-none" placeholder="Detalhes..." value={newPortfolio.description} onChange={e => setNewPortfolio({...newPortfolio, description: e.target.value})}></textarea>
                  </div>
                  
                  {/* File Upload for Portfolio */}
                  <FileUploader 
                     label="Carregar Foto"
                     onFileSelect={(base64) => setNewPortfolio(prev => ({ ...prev, image: base64 }))}
                     currentImage={newPortfolio.image}
                  />

                  <Button type="submit" className="w-full mt-2">Adicionar ao Portfólio</Button>
               </form>
            </div>
         </div>
      )}

      {/* ONBOARDING MODAL */}
      {showOnboarding && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-fade-in-up">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl p-8 relative overflow-hidden text-center">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
               
               <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                  <CheckCircle size={40} />
               </div>
               
               <h2 className="text-3xl font-bold text-slate-900 mb-4">Bem-vindo ao NKHUVO! 🎉</h2>
               <p className="text-slate-600 mb-8 leading-relaxed">
                  A sua conta de fornecedor foi criada com sucesso. Para começar a receber pedidos, precisa configurar o seu perfil.
               </p>

               <div className="bg-slate-50 p-6 rounded-2xl text-left space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">1</div>
                     <span className="text-sm font-medium text-slate-700">Adicione foto e contactos (WhatsApp)</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">2</div>
                     <span className="text-sm font-medium text-slate-700">Defina o seu horário de disponibilidade</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">3</div>
                     <span className="text-sm font-medium text-slate-700">Crie o seu primeiro serviço e preço</span>
                  </div>
               </div>

               <Button 
                 className="w-full py-4 text-lg shadow-xl shadow-indigo-200"
                 onClick={() => setShowOnboarding(false)}
               >
                 Configurar Perfil Agora
               </Button>
            </div>
         </div>
      )}

    </div>
  );
};