
import React, { useState } from 'react';
import { User, Booking, Service } from '../types';
import { LayoutDashboard, Calendar, DollarSign, Edit2, TrendingUp, Plus, User as UserIcon } from 'lucide-react';
import { Button } from '../components/UI';

interface Props {
  user: User;
  onNavigate: (path: string) => void;
  services: Service[];
  bookings: Booking[];
}

export const ProviderDashboard: React.FC<Props> = ({ user, onNavigate, services, bookings }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Filter data for this provider using passed props
  const myServices = services.filter(s => s.providerId === user.id);
  const myBookings = bookings.filter(b => myServices.some(s => s.id === b.serviceId));

  const totalEarnings = myBookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Painel do Fornecedor</h1>
            <p className="text-slate-500">Gerencie seus serviços e pedidos.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="secondary" onClick={() => onNavigate('/provider-profile')}>
               <UserIcon size={18} className="mr-2" /> Meu Perfil
             </Button>
             <Button onClick={() => onNavigate('/provider-profile')}>
               <Plus size={18} className="mr-2" /> Novo Serviço
             </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Receita Total" value={`${totalEarnings.toLocaleString()} MZN`} icon={DollarSign} color="bg-emerald-500" />
          <StatCard title="Pedidos Ativos" value={myBookings.filter(b => b.status === 'pending').length} icon={Calendar} color="bg-indigo-500" />
          <StatCard title="Visualizações" value="1.2k" icon={TrendingUp} color="bg-blue-500" />
          <StatCard title="Meus Serviços" value={myServices.length} icon={LayoutDashboard} color="bg-purple-500" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Bookings */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900">Pedidos Recentes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Serviço</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {myBookings.length > 0 ? myBookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(booking.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {myServices.find(s => s.id === booking.serviceId)?.name || 'Serviço'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold uppercase ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">
                          {booking.amount.toLocaleString()} MZN
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                          Ainda não tem pedidos.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Services List Preview */}
            <div>
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-lg text-slate-900">Meus Serviços Ativos</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {myServices.map(service => (
                  <div key={service.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 cursor-pointer hover:border-indigo-200" onClick={() => onNavigate('/provider-profile')}>
                    <img src={service.images[0]} className="w-20 h-20 rounded-xl object-cover" alt={service.name} />
                    <div className="flex-1">
                       <h4 className="font-bold text-slate-900 line-clamp-1">{service.name}</h4>
                       <div className="flex items-center gap-1 text-sm font-medium text-slate-700 mt-1">
                         {service.price.toLocaleString()} MZN
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-900 rounded-3xl p-6 text-white">
               <h3 className="font-bold text-lg mb-2">Plano Grátis</h3>
               <p className="text-indigo-200 text-sm mb-4">Acesso total liberado.</p>
               <div className="w-full bg-indigo-800 rounded-full h-1.5">
                 <div className="bg-white h-1.5 rounded-full w-full"></div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
