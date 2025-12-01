
import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, User, Search, LogOut, PlusCircle, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../types';
import { APP_LOGO } from '../services/mockData';

interface LayoutProps {
  children: React.ReactNode;
  user: UserType | null;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<LayoutProps> = ({ user, onLogout, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ path, label, icon: Icon, primary = false }: any) => (
    <button
      onClick={() => {
        onNavigate(path);
        setIsOpen(false);
      }}
      className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-medium ${
        primary
          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5'
          : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'
      }`}
    >
      {Icon && <Icon size={18} />}
      <span>{label}</span>
    </button>
  );

  return (
    <>
    <nav 
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
            scrolled 
            ? 'top-4 max-w-7xl mx-auto px-4' 
            : 'top-0 w-full px-0'
        }`}
    >
      <div 
        className={`w-full transition-all duration-500 ${
            scrolled 
            ? 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem]' 
            : 'bg-white/60 backdrop-blur-lg border-b border-white/10'
        }`}
      >
        <div className={`px-4 sm:px-6 lg:px-8 mx-auto`}>
            <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div 
                className="flex items-center cursor-pointer group"
                onClick={() => onNavigate('/')}
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <img 
                    src={APP_LOGO} 
                    alt="NKHUVO Logo" 
                    className="relative w-10 h-10 rounded-xl shadow-sm object-cover" 
                    />
                </div>
                <span className="ml-3 text-2xl font-bold tracking-tighter text-slate-900">
                NKHUVO<span className="text-indigo-600">.</span>
                </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
                <NavLink path="/explore" label="Explorar" icon={Search} />
                
                {user ? (
                <>
                    <NavLink 
                    path={
                        user.role === 'admin' ? '/admin' :
                        user.role === 'organizer' ? '/dashboard' : '/provider-dashboard'
                    } 
                    label={user.role === 'admin' ? 'Painel' : 'Dashboard'} 
                    icon={user.role === 'admin' ? ShieldCheck : LayoutDashboard} 
                    />
                    
                    {user.role === 'organizer' && (
                    <NavLink path="/create-event" label="Criar Evento" icon={PlusCircle} primary />
                    )}
                    
                    <div className="h-8 w-px bg-slate-200 mx-3"></div>
                    <div className="flex items-center gap-3 pl-1 group cursor-pointer relative">
                    <div className="relative">
                        <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <button onClick={onLogout} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Sair">
                        <LogOut size={18} />
                    </button>
                    </div>
                </>
                ) : (
                <>
                    <div className="h-6 w-px bg-slate-200 mx-2"></div>
                    <NavLink path="/login" label="Entrar" />
                    <NavLink path="/register" label="Registar" primary />
                </>
                )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
                <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-600 hover:text-indigo-600 p-2 rounded-xl hover:bg-indigo-50 transition-colors"
                >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
            <div className="md:hidden border-t border-slate-100 px-4 py-6 space-y-2 bg-white/95 backdrop-blur-xl rounded-b-[2rem]">
            <NavLink path="/explore" label="Explorar Serviços" icon={Search} />
            {user ? (
                <>
                <NavLink 
                    path={
                        user.role === 'admin' ? '/admin' :
                        user.role === 'organizer' ? '/dashboard' : '/provider-dashboard'
                    } 
                    label="Meu Dashboard" 
                    icon={user.role === 'admin' ? ShieldCheck : LayoutDashboard} 
                />
                {user.role === 'organizer' && (
                    <NavLink path="/create-event" label="Novo Evento" icon={PlusCircle} />
                )}
                <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-4 px-4">
                        <img src={user.avatar} className="w-10 h-10 rounded-full" alt="" />
                        <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onLogout}
                        className="flex items-center space-x-2 px-5 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors font-medium"
                    >
                        <LogOut size={18} />
                        <span>Terminar Sessão</span>
                    </button>
                </div>
                </>
            ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button onClick={() => { onNavigate('/login'); setIsOpen(false); }} className="py-3 rounded-xl font-bold text-slate-600 bg-slate-50">Entrar</button>
                    <button onClick={() => { onNavigate('/register'); setIsOpen(false); }} className="py-3 rounded-xl font-bold text-white bg-indigo-600 shadow-lg shadow-indigo-200">Registar</button>
                </div>
            )}
            </div>
        )}
      </div>
    </nav>
    <div className={scrolled ? 'h-32' : 'h-20'}></div> 
    {/* Spacer to prevent content jump, adjusting based on navbar state */}
    </>
  );
};

export const Footer = () => (
  <footer className="bg-slate-950 text-slate-300 py-16 md:py-24 relative overflow-hidden">
    {/* Background glow */}
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-[128px]"></div>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[128px]"></div>

    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <div className="grid md:grid-cols-12 gap-12 mb-16">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
            <h3 className="text-white text-2xl font-bold tracking-tight">NKHUVO.</h3>
          </div>
          <p className="text-base leading-relaxed text-slate-400 mb-8 max-w-sm">
            A plataforma líder em Moçambique que conecta sonhos à realidade. Simplificamos a organização de eventos com tecnologia e paixão.
          </p>
          <div className="flex gap-4">
            {/* Social Placeholders */}
            {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all cursor-pointer">
                    <span className="text-xs">SOC</span>
                </div>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2 md:col-start-7">
          <h4 className="text-white font-bold mb-6 text-lg">Plataforma</h4>
          <ul className="space-y-4 text-sm font-medium text-slate-400">
            <li className="hover:text-white cursor-pointer transition-colors">Explorar Serviços</li>
            <li className="hover:text-white cursor-pointer transition-colors">Como Funciona</li>
            <li className="hover:text-white cursor-pointer transition-colors">Preços</li>
            <li className="hover:text-white cursor-pointer transition-colors">Segurança</li>
          </ul>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="text-white font-bold mb-6 text-lg">Empresa</h4>
          <ul className="space-y-4 text-sm font-medium text-slate-400">
            <li className="hover:text-white cursor-pointer transition-colors">Sobre Nós</li>
            <li className="hover:text-white cursor-pointer transition-colors">Carreiras</li>
            <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
            <li className="hover:text-white cursor-pointer transition-colors">Imprensa</li>
          </ul>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="text-white font-bold mb-6 text-lg">Suporte</h4>
          <ul className="space-y-4 text-sm font-medium text-slate-400">
            <li className="hover:text-white cursor-pointer transition-colors">Central de Ajuda</li>
            <li className="hover:text-white cursor-pointer transition-colors">Termos de Uso</li>
            <li className="hover:text-white cursor-pointer transition-colors">Privacidade</li>
            <li className="hover:text-white cursor-pointer transition-colors">Contactos</li>
          </ul>
        </div>
      </div>
      
      <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 font-medium">
        <div>© 2025 NKHUVO Plataforma. Todos os direitos reservados.</div>
        <div className="flex gap-6">
            <span className="cursor-pointer hover:text-white">Maputo, Moçambique</span>
            <span className="cursor-pointer hover:text-white">Português (MZ)</span>
        </div>
      </div>
    </div>
  </footer>
);
