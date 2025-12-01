
import React, { useState } from 'react';
import { User, Service } from '../types';
import { MOCK_SYSTEM_STATS, MOCK_SERVICES, MOCK_USER, MOCK_PROVIDER_USER, APP_LOGO } from '../services/mockData';
import { 
  LayoutDashboard, Users, ShoppingBag, DollarSign, Activity, 
  Search, Shield, AlertTriangle, CheckCircle, XCircle, MoreVertical,
  BarChart3, Settings, LogOut, ArrowUpRight, ArrowDownRight,
  Download, Filter, PieChart, FileText, X, Phone, Mail, MapPin, Calendar
} from 'lucide-react';
import { Button } from '../components/UI';

interface Props {
  user: User;
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'services' | 'finance'>('overview');
  const [services, setServices] = useState(MOCK_SERVICES);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Mock merging users for the table with expanded details capability
  const allUsers = [
    MOCK_USER, 
    MOCK_PROVIDER_USER, 
    ...Array(8).fill(MOCK_USER).map((u, i) => ({
      ...u, 
      id: `u${i+10}`, 
      name: `Utilizador Teste ${i+1}`, 
      role: i % 2 ? 'organizer' : 'provider',
      joinedDate: '2025-02-10',
      email: `user${i+1}@nkhuvo.co.mz`
    }))
  ];

  const handleApproveService = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, status: 'approved' } : s));
  };

  const handleRejectService = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
  };

  const downloadReport = () => {
    alert("A gerar relatório em PDF... (Simulação)");
  };

  // Mock category data aggregation
  const categoryStats = [
    { name: 'Catering', value: 35, color: 'bg-orange-500' },
    { name: 'Música & DJs', value: 25, color: 'bg-indigo-500' },
    { name: 'Venues', value: 20, color: 'bg-emerald-500' },
    { name: 'Fotografia', value: 15, color: 'bg-pink-500' },
    { name: 'Outros', value: 5, color: 'bg-slate-400' },
  ];

  const StatCard = ({ title, value, subtext, icon: Icon, trend, color }: any) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600 group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {trend > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">{value}</h3>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Sidebar - Modern Dark */}
      <aside className="w-72 bg-slate-900 text-white fixed h-full z-30 hidden lg:flex flex-col border-r border-slate-800">
        <div className="p-8">
          <div className="flex items-center gap-3">
             <img 
               src={APP_LOGO} 
               alt="Admin Logo" 
               className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-indigo-500/30"
             />
             <div>
                <h1 className="font-bold text-xl tracking-tight">NKHUVO.</h1>
                <span className="text-[10px] text-indigo-300 uppercase tracking-[0.2em] font-bold">Admin Panel</span>
             </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2">
          {[
            { id: 'overview', label: 'Dashboard Geral', icon: LayoutDashboard },
            { id: 'users', label: 'Utilizadores', icon: Users },
            { id: 'services', label: 'Serviços', icon: ShoppingBag },
            { id: 'finance', label: 'Financeiro', icon: DollarSign },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} className={`transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} />
              <span className="font-medium text-sm">{item.label}</span>
              {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="bg-slate-800/50 rounded-2xl p-4 mb-4 flex items-center gap-3">
              <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-600" alt="Admin" />
              <div className="overflow-hidden">
                 <p className="text-sm font-bold truncate text-white">{user.name}</p>
                 <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
           </div>
           <button onClick={() => onNavigate('/')} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm font-medium">
             <LogOut size={18} />
             <span>Sair</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-8 lg:p-12 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {activeTab === 'overview' && 'Visão Geral'}
              {activeTab === 'users' && 'Gestão de Base de Dados'}
              {activeTab === 'services' && 'Moderação de Catálogo'}
              {activeTab === 'finance' && 'Relatórios Financeiros'}
            </h2>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
               <Calendar size={14} />
               {new Date().toLocaleDateString('pt-MZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <Button variant="outline" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 h-10" onClick={downloadReport}>
                <Download size={18} className="mr-2" />
                Baixar Relatório
             </Button>
             <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-200 cursor-pointer hover:bg-indigo-700 transition-colors">
                <Settings size={20} />
             </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in-up">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Utilizadores" 
                value={MOCK_SYSTEM_STATS.totalUsers.toLocaleString()} 
                subtext="+120 esta semana"
                icon={Users}
                trend={12.5}
                color="bg-indigo-500"
              />
              <StatCard 
                title="Eventos Criados" 
                value={MOCK_SYSTEM_STATS.totalEvents} 
                subtext="+45 hoje"
                icon={Activity}
                trend={8.2}
                color="bg-pink-500"
              />
              <StatCard 
                title="Fornecedores" 
                value={MOCK_SYSTEM_STATS.totalProviders} 
                subtext="5 pendentes"
                icon={ShoppingBag}
                trend={5.1}
                color="bg-amber-500"
              />
              <StatCard 
                title="Receita Total" 
                value={`${(MOCK_SYSTEM_STATS.totalRevenue / 1000000).toFixed(2)}M`} 
                subtext="Meticais (MZN)"
                icon={DollarSign}
                trend={22.4}
                color="bg-emerald-500"
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Chart Section */}
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                   <div>
                      <h3 className="font-bold text-xl text-slate-800">Crescimento da Plataforma</h3>
                      <p className="text-slate-400 text-sm">Eventos vs Novos Registos</p>
                   </div>
                   <div className="flex gap-2">
                      <span className="flex items-center text-xs font-bold text-slate-500"><div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>Eventos</span>
                      <span className="flex items-center text-xs font-bold text-slate-500"><div className="w-2 h-2 rounded-full bg-indigo-200 mr-2"></div>Registos</span>
                   </div>
                </div>
                
                {/* Enhanced CSS Chart */}
                <div className="h-64 flex items-end justify-between gap-3 px-2">
                   {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'].map((m, i) => {
                     const height1 = Math.floor(Math.random() * 60) + 20;
                     const height2 = Math.floor(Math.random() * 40) + 10;
                     return (
                       <div key={i} className="w-full flex flex-col justify-end gap-1 group cursor-pointer relative">
                          {/* Tooltip */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                             {m}: {height1 + height2} Ativos
                          </div>
                          
                          <div 
                            className="w-full bg-indigo-500 rounded-t-sm opacity-90 hover:opacity-100 transition-all" 
                            style={{ height: `${height1}%` }}
                          ></div>
                          <div 
                            className="w-full bg-indigo-200 rounded-b-sm opacity-90 hover:opacity-100 transition-all" 
                            style={{ height: `${height2}%` }}
                          ></div>
                          <span className="text-[10px] text-center text-slate-400 font-medium mt-2">{m}</span>
                       </div>
                     );
                   })}
                </div>
              </div>

              {/* Popular Categories & Activity */}
              <div className="space-y-6">
                 {/* Categories Widget */}
                 <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                       <PieChart size={18} className="text-slate-400" /> Categorias Populares
                    </h3>
                    <div className="space-y-4">
                       {categoryStats.map((cat, i) => (
                          <div key={i}>
                             <div className="flex justify-between text-sm mb-1.5">
                                <span className="font-medium text-slate-700">{cat.name}</span>
                                <span className="text-slate-500">{cat.value}%</span>
                             </div>
                             <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.value}%` }}></div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Recent Activity Mini */}
                 <div className="bg-indigo-900 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                     <h3 className="font-bold mb-4 relative z-10">Alertas de Sistema</h3>
                     <div className="space-y-4 relative z-10">
                        {MOCK_SYSTEM_STATS.recentActivity.slice(0, 2).map(act => (
                           <div key={act.id} className="flex gap-3 items-start bg-white/5 p-3 rounded-xl border border-white/5">
                              <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                act.type === 'success' ? 'bg-green-400' : 'bg-amber-400'
                              }`}></div>
                              <div>
                                 <p className="text-xs font-medium leading-relaxed opacity-90">{act.action}</p>
                                 <span className="text-[10px] opacity-50">{act.time}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Services / Moderation Tab */}
        {activeTab === 'services' && (
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in-up">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex gap-4">
                    <div className="relative">
                       <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input placeholder="Procurar serviço..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 w-64" />
                    </div>
                    <Button variant="outline" className="h-9 text-xs px-3 bg-white border-slate-200">
                       <Filter size={14} className="mr-2" /> Filtros
                    </Button>
                 </div>
                 <div className="flex gap-2">
                    <Button variant="secondary" className="h-9 text-xs px-3">Exportar CSV</Button>
                 </div>
              </div>
              <table className="w-full text-left">
                 <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                    <tr>
                       <th className="px-6 py-4">Serviço</th>
                       <th className="px-6 py-4">Categoria</th>
                       <th className="px-6 py-4">Preço</th>
                       <th className="px-6 py-4">Avaliação</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4 text-right">Moderação</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {services.map(service => (
                       <tr key={service.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-4">
                                <img src={service.images[0]} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                                <div>
                                   <div className="font-bold text-slate-900 text-sm">{service.name}</div>
                                   <div className="text-xs text-slate-400">ID: {service.id}</div>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                             <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium">{service.category}</span>
                             <div className="text-xs text-slate-400 mt-1">{service.subcategory}</div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-700">{service.price.toLocaleString()} MZN</td>
                          <td className="px-6 py-4 text-sm font-medium flex items-center gap-1">
                             <span className="text-amber-500">★</span> {service.rating}
                          </td>
                          <td className="px-6 py-4">
                             <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                                service.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' :
                                service.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                'bg-amber-100 text-amber-700 border border-amber-200'
                             }`}>
                                {service.status || 'pending'}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => handleApproveService(service.id)}
                                  className="p-2 bg-white border border-slate-200 text-green-600 hover:bg-green-50 hover:border-green-200 rounded-lg transition-all shadow-sm" 
                                  title="Aprovar"
                                >
                                   <CheckCircle size={16} />
                                </button>
                                <button 
                                  onClick={() => handleRejectService(service.id)}
                                  className="p-2 bg-white border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all shadow-sm" 
                                  title="Rejeitar"
                                >
                                   <XCircle size={16} />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        )}

        {/* Users Tab with Detail View */}
        {activeTab === 'users' && (
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in-up">
              <div className="p-6">
                 <h3 className="font-bold text-xl text-slate-900 mb-4">Base de Utilizadores</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                          <tr>
                             <th className="px-6 py-4">Utilizador</th>
                             <th className="px-6 py-4">Tipo</th>
                             <th className="px-6 py-4">Email</th>
                             <th className="px-6 py-4">Localização</th>
                             <th className="px-6 py-4">Data Registo</th>
                             <th className="px-6 py-4 text-right">Detalhes</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {allUsers.map((u, i) => (
                             <tr key={i} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => setSelectedUser(u)}>
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                   <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                                      <img src={u.avatar} className="w-full h-full object-cover" alt="" />
                                   </div>
                                   {u.name}
                                </td>
                                <td className="px-6 py-4">
                                   <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider ${
                                      u.role === 'organizer' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                   }`}>
                                      {u.role}
                                   </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{u.location || 'Maputo'}</td>
                                <td className="px-6 py-4 text-sm text-slate-400 font-mono">{u.joinedDate || '2025-01-01'}</td>
                                <td className="px-6 py-4 text-right">
                                   <button className="text-slate-400 hover:text-indigo-600 p-2 rounded-full hover:bg-slate-100 transition-all">
                                      <MoreVertical size={16} />
                                   </button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        )}

        {/* Finance Tab (Enhanced Placeholder) */}
        {activeTab === 'finance' && (
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-xl text-slate-900 mb-6">Fluxo de Caixa</h3>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                     <div className="text-center">
                        <BarChart3 size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 font-medium">Gráfico financeiro detalhado indisponível na demo</p>
                        <p className="text-xs text-slate-400 mt-1">Conecte a API real para visualizar dados.</p>
                     </div>
                  </div>
              </div>
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
                 <div>
                    <h3 className="text-sm font-bold opacity-70 uppercase tracking-widest mb-6">Saldo Disponível</h3>
                    <div className="text-4xl font-bold mb-2">2,500,000</div>
                    <div className="text-xl opacity-80 mb-6">Meticais (MZN)</div>
                    
                    <div className="flex gap-2 mb-8">
                       <span className="bg-green-500/20 text-green-300 text-xs font-bold px-2 py-1 rounded flex items-center">
                          <ArrowUpRight size={12} className="mr-1" /> +15.5%
                       </span>
                    </div>
                 </div>
                 <div className="space-y-4 relative z-10">
                    <Button className="w-full bg-white text-slate-900 hover:bg-indigo-50 border-none">
                       Levantar Fundos
                    </Button>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:border-white/40">
                       Ver Transações
                    </Button>
                 </div>
              </div>
           </div>
        )}

      </main>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative">
              <button 
                 onClick={() => setSelectedUser(null)} 
                 className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-slate-100 rounded-full text-slate-500 transition-colors z-10"
              >
                 <X size={20} />
              </button>
              
              <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                 <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full">
                    <img src={selectedUser.avatar} className="w-24 h-24 rounded-full object-cover" alt="" />
                 </div>
              </div>
              
              <div className="pt-16 px-8 pb-8">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <h3 className="text-2xl font-bold text-slate-900">{selectedUser.name}</h3>
                       <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider ${
                                selectedUser.role === 'organizer' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                             }`}>
                             {selectedUser.role}
                          </span>
                          <span className="text-slate-400 text-sm">•</span>
                          <span className="text-slate-500 text-sm flex items-center gap-1"><MapPin size={12} /> {selectedUser.location || 'Maputo'}</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs text-slate-400 font-bold uppercase">Status</p>
                       <span className="text-green-600 font-bold text-sm flex items-center justify-end gap-1"><CheckCircle size={12}/> Ativo</span>
                    </div>
                 </div>
                 
                 <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                       <Mail size={18} className="text-slate-400" />
                       <span className="text-slate-700 text-sm font-medium">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                       <Phone size={18} className="text-slate-400" />
                       <span className="text-slate-700 text-sm font-medium">{selectedUser.phone || 'Sem telefone'}</span>
                    </div>
                    {selectedUser.bio && (
                       <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-600 italic leading-relaxed">
                          "{selectedUser.bio}"
                       </div>
                    )}
                 </div>
                 
                 <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => alert('Reset de senha enviado')}>Reset Senha</Button>
                    <Button className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-100 shadow-none">Bloquear Conta</Button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
