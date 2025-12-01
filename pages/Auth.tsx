
import React, { useState } from 'react';
import { Button } from '../components/UI';
import { User } from '../types';
import { MOCK_USER, MOCK_PROVIDER_USER, MOCK_ADMIN } from '../services/mockData';
import { Mail, Lock, User as UserIcon, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

interface AuthProps {
  mode: 'login' | 'register';
  onLogin: (user: User) => void;
  onNavigate: (path: string, params?: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ mode, onLogin, onNavigate }) => {
  const [role, setRole] = useState<'organizer' | 'provider'>('organizer');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (mode === 'login' && formData.email === 'admin@NKHUVO.com' && formData.password === 'admin123') {
        onLogin(MOCK_ADMIN);
      } else {
        const user = role === 'organizer' ? MOCK_USER : MOCK_PROVIDER_USER;
        onLogin(user); // App.tsx handles generic navigation, but we override for register flow below
        
        // Custom redirection for registration logic
        if (mode === 'register' && role === 'provider') {
            // Pass 'new=true' param to trigger onboarding modal
            onNavigate('/provider-profile', { new: true }); 
        }
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Modern Visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900 flex-col justify-between p-16">
        <div className="absolute inset-0 bg-indigo-600/20 mix-blend-overlay z-10"></div>
        <img 
          src={mode === 'login' 
            ? "https://images.unsplash.com/photo-1519671482538-518b5c2a9d2f?q=80&w=1200&auto=format&fit=crop" 
            : "https://images.unsplash.com/photo-1505373877841-8d43f703f295?q=80&w=1200&auto=format&fit=crop"} 
          className="w-full h-full object-cover absolute inset-0 opacity-40 scale-105"
          alt="Background"
        />
        
        {/* Ambient Light Effect */}
        <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-500 rounded-full blur-[150px] opacity-40 z-0"></div>

        <div className="relative z-20">
            <button onClick={() => onNavigate('/')} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8">
                <ArrowLeft size={20} /> Voltar à Home
            </button>
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-indigo-600 text-xl shadow-lg mb-8">N</div>
        </div>

        <div className="relative z-20 max-w-lg">
          <h2 className="text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            {mode === 'login' ? 'Bem-vindo de volta.' : 'Crie memórias inesquecíveis.'}
          </h2>
          <p className="text-xl text-slate-300 leading-relaxed font-light">
            {mode === 'login' 
              ? 'Acesse o seu painel de controlo e continue a organizar eventos perfeitos.' 
              : 'Junte-se à plataforma #1 em Moçambique e transforme a forma como eventos são criados.'}
          </p>
        </div>
        
        <div className="relative z-20 text-slate-400 text-sm">
            © 2025 NKHUVO. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Side - Clean Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
         <div className="max-w-md w-full animate-fade-in-up">
            <div className="mb-10">
               <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
               {mode === 'login' ? 'Entrar' : 'Criar Conta'}
               </h1>
               <p className="text-slate-500 text-lg">
               {mode === 'login' 
                  ? 'Insira os seus dados para continuar.' 
                  : 'Preencha o formulário para começar.'}
               </p>
            </div>

            {mode === 'register' && (
               <div className="flex p-1 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
               <button 
                  onClick={() => setRole('organizer')}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all shadow-sm ${role === 'organizer' ? 'bg-white text-slate-900 shadow-md ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600 shadow-none'}`}
               >
                  Organizador
               </button>
               <button 
                  onClick={() => setRole('provider')}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all shadow-sm ${role === 'provider' ? 'bg-white text-slate-900 shadow-md ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600 shadow-none'}`}
               >
                  Fornecedor
               </button>
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
               {mode === 'register' && (
               <div className="space-y-5">
                  <div className="group">
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Nome Completo</label>
                     <div className="relative">
                        <UserIcon className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input 
                           type="text" 
                           className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                           required 
                           value={formData.name}
                           onChange={e => setFormData({...formData, name: e.target.value})}
                           placeholder="Ex: João da Silva"
                        />
                     </div>
                  </div>
                  {role === 'provider' && (
                     <div className="group">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Cidade Base</label>
                        <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <select className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer">
                           <option>Selecione a cidade...</option>
                           <option>Maputo</option>
                           <option>Matola</option>
                           <option>Beira</option>
                        </select>
                        </div>
                     </div>
                  )}
               </div>
               )}

               <div className="group">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email</label>
                  <div className="relative">
                     <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                     <input 
                        type="email" 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                        required 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="nome@exemplo.com"
                     />
                  </div>
               </div>

               <div className="group">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Senha</label>
                  <div className="relative">
                     <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                     <input 
                        type="password" 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                        required 
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        placeholder="••••••••"
                     />
                  </div>
               </div>

               <Button 
                  type="submit" 
                  className="w-full mt-8 py-4 text-lg rounded-2xl" 
                  disabled={loading}
               >
                  {loading ? (
                  <span className="flex items-center gap-2">
                     <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                     A verificar...
                  </span>
                  ) : (
                  <span className="flex items-center gap-2">
                     {mode === 'login' ? 'Entrar na Conta' : 'Criar Conta'} <ArrowRight size={20} />
                  </span>
                  )}
               </Button>
            </form>

            <div className="mt-10 text-center border-t border-slate-50 pt-8">
               <p className="text-slate-500 font-medium">
               {mode === 'login' ? 'Novo por aqui?' : 'Já tem uma conta?'}
               <button 
                  onClick={() => onNavigate(mode === 'login' ? '/register' : '/login')}
                  className="ml-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
               >
                  {mode === 'login' ? 'Criar conta gratuita' : 'Fazer login'}
               </button>
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};
