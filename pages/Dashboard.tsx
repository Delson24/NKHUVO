import React, { useState } from 'react';
import { User, EventItem, Task } from '../types';
import { Plus, Calendar, CheckCircle, Clock, DollarSign, Wand2, Loader2, Trash2, Check } from 'lucide-react';
import { generateEventPlan, AIPlanResponse } from '../services/geminiService';
import { Button } from '../components/UI';

interface DashboardProps {
  user: User;
  onNavigate: (path: string) => void;
  events: EventItem[];
}

export const OrganizerDashboard: React.FC<DashboardProps> = ({ user, onNavigate, events }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'ai-planner'>('overview');

  // AI Planner State
  const [aiForm, setAiForm] = useState({ type: '', guests: 50, location: '', vibe: '' });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIPlanResponse | null>(null);

  const handleAIPlan = async () => {
    if (!aiForm.type || !aiForm.location) return;
    setAiLoading(true);
    const result = await generateEventPlan(aiForm.type, aiForm.guests, aiForm.location, aiForm.vibe);
    setAiResult(result);
    setAiLoading(false);
  };

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Olá, {user.name.split(' ')[0]} 👋</h1>
            <p className="text-slate-500">Aqui está o resumo dos seus eventos.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="secondary" onClick={() => setActiveTab('ai-planner')}>
               <Wand2 size={18} className="mr-2" />
               Assistente IA
             </Button>
             <Button onClick={() => onNavigate('/create-event')}>
               <Plus size={18} className="mr-2" />
               Novo Evento
             </Button>
          </div>
        </div>

        {/* Stats Row */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard label="Eventos Ativos" value={events.length.toString()} icon={Calendar} color="bg-indigo-500" />
              <StatCard label="Tarefas Pendentes" value="2" icon={Clock} color="bg-amber-500" />
              <StatCard label="Tarefas Concluídas" value="8" icon={CheckCircle} color="bg-emerald-500" />
              <StatCard label="Orçamento Gasto" value="350k MZN" icon={DollarSign} color="bg-rose-500" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Event List */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Os teus eventos</h2>
                {events.length > 0 ? events.map(event => (
                  <div key={event.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
                          {event.status === 'planning' ? 'Em Planeamento' : 'Ativo'}
                        </span>
                        <h3 className="text-xl font-bold text-slate-800">{event.name}</h3>
                        <p className="text-slate-500 text-sm flex items-center mt-1">
                          <Calendar size={14} className="mr-1" />
                          {new Date(event.date).toLocaleDateString('pt-MZ')} • {event.location}
                        </p>
                      </div>
                      <div className="text-right">
                         <div className="text-sm text-slate-400">Orçamento</div>
                         <div className="font-bold text-slate-900">
                           {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN', maximumSignificantDigits: 3 }).format(event.budget)}
                         </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-slate-50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-slate-700 text-sm">Progresso de Tarefas</h4>
                        <span className="text-xs text-slate-400">
                           {event.tasks.filter(t => t.completed).length} / {event.tasks.length}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" 
                          style={{ width: event.tasks.length > 0 ? `${(event.tasks.filter(t => t.completed).length / event.tasks.length) * 100}%` : '0%' }}
                        ></div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 py-2 text-sm" onClick={() => {}}>Gerir Detalhes</Button>
                        <Button variant="outline" className="flex-1 py-2 text-sm" onClick={() => onNavigate('/explore')}>Adicionar Serviços</Button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
                     <p className="text-slate-500 mb-4">Ainda não criou nenhum evento.</p>
                     <Button onClick={() => onNavigate('/create-event')}>Começar Agora</Button>
                  </div>
                )}
              </div>

              {/* Quick Tasks */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Tarefas Rápidas</h2>
                <ul className="space-y-3">
                  {events[0]?.tasks.slice(0, 5).map(task => (
                    <li key={task.id} className="flex items-center group cursor-pointer">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-indigo-500'}`}>
                        {task.completed && <Check size={12} className="text-white" />}
                      </div>
                      <span className={`text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {task.title}
                      </span>
                    </li>
                  ))}
                  {(!events[0] || events[0].tasks.length === 0) && (
                     <li className="text-slate-400 text-sm italic">Sem tarefas pendentes.</li>
                  )}
                  <li className="flex items-center text-indigo-600 cursor-pointer pt-2">
                    <Plus size={16} className="mr-2" />
                    <span className="text-sm font-medium">Adicionar Tarefa</span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}

        {/* AI Planner Tab */}
        {activeTab === 'ai-planner' && (
          <div className="grid lg:grid-cols-2 gap-10 animate-fade-in-up">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
              <div className="flex items-center gap-2 mb-6 text-indigo-600">
                <Wand2 size={24} />
                <h2 className="text-2xl font-bold text-slate-900">Assistente NKHUVO AI</h2>
              </div>
              <p className="text-slate-500 mb-8">
                Descreva o seu evento e a nossa Inteligência Artificial criará um plano inicial, orçamento e checklist personalizado para a realidade de Moçambique.
              </p>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Evento</label>
                  <input 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Ex: Casamento, Aniversário, Conferência..."
                    value={aiForm.type}
                    onChange={e => setAiForm({...aiForm, type: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Convidados</label>
                    <input 
                      type="number"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                      value={aiForm.guests}
                      onChange={e => setAiForm({...aiForm, guests: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                    <select 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                      value={aiForm.location}
                      onChange={e => setAiForm({...aiForm, location: e.target.value})}
                    >
                      <option value="">Selecione...</option>
                      <option value="Maputo">Maputo</option>
                      <option value="Matola">Matola</option>
                      <option value="Beira">Beira</option>
                      <option value="Inhambane">Inhambane</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vibe / Estilo</label>
                  <textarea 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 h-24 resize-none"
                    placeholder="Ex: Romântico, ao ar livre, moderno, tradicional..."
                    value={aiForm.vibe}
                    onChange={e => setAiForm({...aiForm, vibe: e.target.value})}
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleAIPlan} 
                  disabled={aiLoading || !aiForm.type || !aiForm.location}
                >
                  {aiLoading ? <><Loader2 className="animate-spin mr-2"/> A Pensar...</> : 'Gerar Plano com IA'}
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {!aiResult && !aiLoading && (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 p-10 border-2 border-dashed border-slate-200 rounded-3xl">
                  <Wand2 size={48} className="mb-4 opacity-50" />
                  <p>O resultado aparecerá aqui</p>
                </div>
              )}

              {aiResult && (
                <>
                  <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-xl">
                    <h3 className="font-bold text-lg mb-2 opacity-90">Orçamento Estimado</h3>
                    <div className="text-3xl font-bold mb-4">
                      {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN', maximumSignificantDigits: 3 }).format(aiResult.estimatedBudgetMZN.low)} 
                      <span className="text-indigo-200 text-lg mx-2">-</span>
                      {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN', maximumSignificantDigits: 3 }).format(aiResult.estimatedBudgetMZN.high)}
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <h4 className="font-medium mb-2 text-sm uppercase tracking-wide opacity-70">Distribuição Sugerida</h4>
                      {Object.entries(aiResult.estimatedBudgetMZN.breakdown).map(([key, val]) => (
                        <div key={key} className="flex justify-between text-sm py-1 border-b border-white/10 last:border-0">
                           <span>{key}</span>
                           <span>{val}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4">Ideias de Temas</h3>
                    <div className="flex flex-wrap gap-2">
                      {aiResult.themeSuggestions.map((theme, i) => (
                        <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-100">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4">Checklist Inicial</h3>
                    <ul className="space-y-3">
                      {aiResult.checklist.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-1 min-w-[1.25rem] h-5 rounded border border-slate-300"></div>
                          <span className="text-slate-600 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 text-amber-800 text-sm">
                    <strong>💡 Dica Pro:</strong> {aiResult.tips}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};