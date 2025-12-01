
import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, Sparkles, TrendingUp, ShieldCheck, Heart } from 'lucide-react';
import { CATEGORIES, MOCK_SERVICES, LOCATIONS } from '../services/mockData';
import { ServiceCard, Button } from '../components/UI';

export const Home: React.FC<{ onNavigate: (path: string, params?: any) => void }> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    onNavigate('/explore', { search: searchTerm, location: location });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section - Centered Layout (Requested Style) */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-10 overflow-hidden">
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000&auto=format&fit=crop" 
            alt="Event Background" 
            className="w-full h-full object-cover scale-105 animate-float" // Added scale and slow float for effect
            style={{ animationDuration: '20s' }}
          />
          {/* Overlay: Slightly more transparent white to see image, but stronger blur for readability */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
          {/* Gradient to fade into the next section smoothly */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-slate-50"></div>
        </div>

        {/* Centered Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-white/50 text-indigo-800 text-sm font-bold mb-8 shadow-lg backdrop-blur-md mx-auto animate-fade-in-down">
            <Sparkles size={14} className="text-indigo-600" /> O futuro dos eventos em Moçambique
          </div>
          
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1] drop-shadow-sm">
            O teu evento começa <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              com um clique.
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-slate-700 mb-10 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
            Encontre DJs, cozinheiros, salões e tudo que precisa. A plataforma NKHUVO simplifica a organização do seu evento.
          </p>

          {/* Search Bar - Centered */}
          <div className="bg-white/90 backdrop-blur-md p-2 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-white/50 max-w-3xl mx-auto flex flex-col md:flex-row gap-2 relative z-20">
            <div className="flex-1 flex items-center px-6 py-4 md:border-r border-slate-200/50 group">
              <Search className="text-slate-400 mr-3 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="O que procura? (ex: DJ, Catering...)" 
                className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex-1 flex items-center px-6 py-4 group">
              <MapPin className="text-slate-400 mr-3 group-focus-within:text-indigo-600 transition-colors" />
              <select 
                className="w-full bg-transparent outline-none text-slate-700 appearance-none cursor-pointer font-medium"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Onde?</option>
                <option value="">Em todo país</option>
                {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
            <button 
              onClick={handleSearch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-[1.5rem] font-bold transition-all shadow-lg shadow-indigo-500/30 active:scale-95 flex items-center justify-center gap-2 md:w-auto w-full"
            >
              <Search size={20} className="hidden md:block"/>
              <span>Pesquisar</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-slate-600">
             <div className="flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 shadow-sm"><ShieldCheck size={16} className="text-indigo-600"/> Pagamento Seguro</div>
             <div className="flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 shadow-sm"><Heart size={16} className="text-indigo-600"/> +500 Fornecedores</div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white relative z-10 rounded-t-[3rem] -mt-10 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10 border-b border-slate-100 pb-4">
            <div>
               <h2 className="text-3xl font-bold text-slate-900">Categorias Populares</h2>
            </div>
            <button 
              onClick={() => onNavigate('/explore')}
              className="group flex items-center gap-1 text-indigo-600 font-bold hover:text-indigo-800 transition-colors text-sm"
            >
              Ver todas <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <div 
                key={cat.id}
                onClick={() => onNavigate('/explore', { category: cat.id })}
                className="group flex flex-col items-center justify-center p-6 rounded-[2rem] bg-slate-50 border border-transparent hover:border-indigo-100 hover:bg-white transition-all cursor-pointer hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm group-hover:shadow-md flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all mb-3 text-xl font-bold">
                  {cat.label[0]}
                </div>
                <span className="font-bold text-slate-700 group-hover:text-slate-900 text-center text-sm">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2 uppercase tracking-wider text-xs">
                 <TrendingUp size={14} /> Em Alta
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Profissionais em Destaque</h2>
            </div>
            <p className="text-slate-500 max-w-md text-right hidden md:block text-sm">
               Seleção curada dos fornecedores com as melhores avaliações da comunidade esta semana.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {MOCK_SERVICES.slice(0, 4).map(service => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onClick={() => onNavigate(`/service-detail`, { id: service.id })}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" onClick={() => onNavigate('/explore')} className="w-full md:w-auto px-12">Ver todos os serviços</Button>
          </div>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="py-12 px-4">
         <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col items-center justify-center text-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
               <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Transforme o seu evento numa <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">experiência única.</span>
               </h2>
               <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                  Junte-se à comunidade que está a revolucionar o mercado de eventos em Moçambique.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => onNavigate('/register')} className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10">
                     Começar Gratuitamente
                  </button>
                  <button onClick={() => onNavigate('/explore')} className="px-8 py-4 bg-transparent border border-slate-700 text-white rounded-full font-bold hover:bg-white/10 transition-colors">
                     Explorar Serviços
                  </button>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};
