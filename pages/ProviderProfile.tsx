
import React, { useState } from 'react';
import { User, Service, ServiceCategory } from '../types';
import { CATEGORIES, LOCATIONS } from '../services/mockData';
import { Button } from '../components/UI';
import { MapPin, Phone, Save, Camera, Plus, Trash2, Edit2, ArrowLeft, MessageCircle, Loader2, X, User as UserIcon, AlignLeft, ExternalLink } from 'lucide-react';

interface Props {
  user: User;
  onNavigate: (path: string) => void;
  services: Service[];
  onAddService: (s: Service) => void;
}

export const ProviderProfile: React.FC<Props> = ({ user, onNavigate, services, onAddService }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    location: user.location || '',
    phone: user.phone || '',
    whatsapp: user.whatsapp || '',
    bio: user.bio || ''
  });

  // Modal State for New Service
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
     name: '', price: 0, description: '', location: user.location || 'Maputo', features: [], images: []
  });

  const myServices = services.filter(s => s.providerId === user.id);

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate API save
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 1000);
  };

  const handleSubmitService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.category || !newService.price) return;

    const serviceToAdd: Service = {
      id: `s-${Date.now()}`,
      providerId: user.id,
      name: newService.name,
      category: newService.category as ServiceCategory,
      subcategory: newService.subcategory || 'Geral',
      description: newService.description || '',
      price: Number(newService.price),
      priceUnit: newService.priceUnit || 'evento',
      location: newService.location || 'Maputo',
      rating: 5.0, // New service starts with 5 stars
      reviews: 0,
      images: [
         'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop' // Placeholder
      ],
      features: ['Serviço Profissional', 'Garantia de Qualidade'],
      unavailableDates: [],
      status: 'pending'
    };
    
    onAddService(serviceToAdd);
    setIsAddServiceOpen(false);
    setNewService({ name: '', price: 0, description: '', location: 'Maputo' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
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
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    {isEditing && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera size={24} />
                        </div>
                    )}
                 </div>
               </div>

               {/* View Mode */}
               {!isEditing ? (
                  <div className="text-center">
                      <h2 className="text-xl font-bold text-slate-900">{profileData.name}</h2>
                      <div className="flex items-center justify-center text-slate-500 text-sm mt-1 mb-4">
                        <MapPin size={14} className="mr-1" /> {profileData.location || 'Sem localização'}
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
                           </select>
                        </div>
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

          {/* Right Column: Services */}
          <div className="lg:col-span-2 space-y-6">
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
                        <label className="block text-sm font-bold text-slate-700 mb-2">Preço (MZN)</label>
                        <input required type="number" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-indigo-500 outline-none focus:ring-2 focus:ring-indigo-50 transition-all" placeholder="0.00" value={newService.price} onChange={e => setNewService({...newService, price: Number(e.target.value)})} />
                     </div>
                  </div>
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

    </div>
  );
};
