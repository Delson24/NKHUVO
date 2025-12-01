


import React, { useState, useMemo } from 'react';
import { User, EventItem, Task, Booking, Service } from '../types';
import { Plus, Calendar, CheckCircle, Clock, DollarSign, Wand2, Loader2, Trash2, Check, Receipt, ChevronDown, ChevronUp, Edit2, X } from 'lucide-react';
import { generateEventPlan, AIPlanResponse } from '../services/geminiService';
import { Button } from '../components/UI';

interface DashboardProps {
  user: User;
  onNavigate: (path: string) => void;
  events: EventItem[];
  bookings: Booking[];
  services: Service[];
  onUpdateEvent: (event: EventItem) => void;
  onRemoveBooking: (bookingId: string) => void;
}

export const OrganizerDashboard: React.FC<DashboardProps> = ({ user, onNavigate, events, bookings, services, onUpdateEvent, onRemoveBooking }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'ai-planner'>('overview');
  const [expandedFinancials, setExpandedFinancials] = useState<string | null>(null);

  // Task Editing State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');

  // AI Planner State
  const [aiForm, setAiForm] = useState({ type: '', guests: 50, location: '', vibe: '' });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIPlanResponse | null>(null);

  // REAL-TIME STATS CALCULATION
  const stats = useMemo(() => {
    const activeEvents = events;
    const allTasks = activeEvents.flatMap(e => e.tasks);
    
    const pendingTasks = allTasks.filter(t => !t.completed).length;
    const completedTasks = allTasks.filter(t => t.completed).length;
    
    // Sum of PLANNED budgets
    const totalPlannedBudget = activeEvents.reduce((acc, curr) => acc + (curr.budget || 0), 0);

    // Sum of ACTUAL bookings for these events
    const userEventIds = activeEvents.map(e => e.id);
    const userBookings = bookings.filter(b => userEventIds.includes(b.eventId) || b.eventId === 'temp-event');
    const totalSpent = userBookings.reduce((acc, b) => acc + b.amount, 0);

    return {
        activeCount: activeEvents.length,
        pendingTasks,
        completedTasks,
        totalPlannedBudget,
        totalSpent
    };
  }, [events, bookings]);

  // Helper to get bookings for a specific event (including temp ones for the demo)
  const getEventFinancials = (eventId: string) => {
     // In a real app, strict filtering by eventId. For demo, we associate 'temp-event' bookings with the first event
     const isFirstEvent = events.length > 0 && events[0].id === eventId;
     const eventBookings = bookings.filter(b => b.eventId === eventId || (isFirstEvent && b.eventId === 'temp-event'));
     
     const total = eventBookings.reduce((sum, b) => sum + b.amount, 0);
     
     const items = eventBookings.map(b => {
         const svc = services.find(s => s.id === b.serviceId);
         return {
             id: b.id, // Booking ID
             name: svc?.name || 'Serviço Removido',
             price: b.amount,
             status: b.status,
             date: b.date
         };
     });

     return { total, items };
  };

  const handleAIPlan = async () => {
    if (!aiForm.type || !aiForm.location) return;
    setAiLoading(true);
    const result = await generateEventPlan(aiForm.type, aiForm.guests, aiForm.location, aiForm.vibe);
    setAiResult(result);
    setAiLoading(false);
  };

  // --- TASK MANAGEMENT HANDLERS ---
  const handleAddTask = (event: EventItem) => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = { id: `t-${Date.now()}`, title: newTaskTitle, completed: false };
    const updatedEvent = { ...event, tasks: [...event.tasks, newTask] };
    onUpdateEvent(updatedEvent);
    setNewTaskTitle('');
  };

  const handleToggleTask = (event: EventItem, taskId: string) => {
    const updatedTasks = event.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    onUpdateEvent({ ...event, tasks: updatedTasks });
  };

  const handleDeleteTask = (event: EventItem, taskId: string) => {
    if(!window.confirm("Remover esta tarefa?")) return;
    const updatedTasks = event.tasks.filter(t => t.id !== taskId);
    onUpdateEvent({ ...event, tasks: updatedTasks });
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  const saveEditedTask = (event: EventItem) => {
    if (!editingTaskId || !editingTaskTitle.trim()) {
        setEditingTaskId(null);
        return;
    }
    const updatedTasks = event.tasks.map(t => t.id === editingTaskId ? { ...t, title: editingTaskTitle } : t);
    onUpdateEvent({ ...event, tasks: updatedTasks });
    setEditingTaskId(null);
    setEditingTaskTitle('');
  };

  const StatCard = ({ label, value, icon: Icon, color, subValue }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
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
            <h1 className="text-3xl font-bold text-slate-900">Olá, {user.name} 👋</h1>
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

        {/* Stats Row - DYNAMIC VALUES */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard 
                label="Eventos Ativos" 
                value={stats.activeCount.toString()} 
                icon={Calendar} 
                color="bg-indigo-500" 
              />
              <StatCard 
                label="Tarefas Pendentes" 
                value={stats.pendingTasks.toString()} 
                icon={Clock} 
                color="bg-amber-500" 
              />
              <StatCard 
                label="Tarefas Concluídas" 
                value={stats.completedTasks.toString()} 
                icon={CheckCircle} 
                color="bg-emerald-500" 
              />
              <StatCard 
                label="Total Gasto" 
                value={new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN', maximumSignificantDigits: 3 }).format(stats.totalSpent)}
                subValue={`de ${new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN', maximumSignificantDigits: 3 }).format(stats.totalPlannedBudget)} planeados`} 
                icon={Receipt} 
                color="bg-rose-500" 
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Event List */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Os teus eventos</h2>
                {events.length > 0 ? events.map(event => {
                  const financials = getEventFinancials(event.id);
                  const progress = Math.min((financials.total / (event.budget || 1)) * 100, 100);
                  const isExpanded = expandedFinancials === event.id;

                  return (
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
                         <div className="text-sm text-slate-400">Orçamento Planeado</div>
                         <div className="font-bold text-slate-900">
                           {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN', maximumSignificantDigits: 3 }).format(event.budget)}
                         </div>
                      </div>
                    </div>
                    
                    {/* Financial Summary Bar */}
                    <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Serviços Solicitados</div>
                                <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(financials.total)}
                                    <span className="text-xs font-medium text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                        {financials.items.length} serviços
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs font-bold ${progress > 90 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {progress.toFixed(0)}% do orçamento
                                </span>
                            </div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full transition-all duration-1000 ${progress > 100 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Expandable Financial Details (With Remove) */}
                    <div className="mb-6">
                        <button 
                            onClick={() => setExpandedFinancials(isExpanded ? null : event.id)}
                            className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors w-full"
                        >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            {isExpanded ? 'Ocultar Detalhes Financeiros' : 'Ver Lista de Serviços e Preços'}
                        </button>
                        
                        {isExpanded && (
                            <div className="mt-4 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 animate-fade-in-up">
                                {financials.items.length > 0 ? (
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-100 text-slate-500 font-semibold uppercase text-xs">
                                            <tr>
                                                <th className="px-4 py-3">Serviço</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3 text-right">Preço</th>
                                                <th className="px-4 py-3 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {financials.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-3 font-medium text-slate-700">{item.name}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                                            item.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                                            item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                                                            'bg-slate-100 text-slate-500'
                                                        }`}>
                                                            {item.status === 'pending' ? 'Pendente' : item.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                                                        {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(item.price)}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <button 
                                                            onClick={() => onRemoveBooking(item.id)}
                                                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                            title="Remover Serviço"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="bg-slate-100 font-bold">
                                                <td className="px-4 py-3 text-slate-900">Total</td>
                                                <td></td>
                                                <td className="px-4 py-3 text-right text-indigo-600">
                                                    {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(financials.total)}
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-4 text-center text-slate-500 text-sm italic">
                                        Nenhum serviço solicitado para este evento ainda.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {/* Tasks Section with CRUD */}
                    <div className="mt-6 pt-6 border-t border-slate-50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-slate-700 text-sm">Progresso de Tarefas</h4>
                        <span className="text-xs text-slate-400">
                           {event.tasks.filter(t => t.completed).length} / {event.tasks.length}
                        </span>
                      </div>
                      
                      {/* Task Progress Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" 
                          style={{ width: event.tasks.length > 0 ? `${(event.tasks.filter(t => t.completed).length / event.tasks.length) * 100}%` : '0%' }}
                        ></div>
                      </div>

                      {/* Expanded Task List for CRUD */}
                      <div className="space-y-3 mb-4">
                        {event.tasks.map(task => (
                            <div key={task.id} className="flex items-center justify-between group p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="flex items-center flex-1 gap-3">
                                    <button 
                                        onClick={() => handleToggleTask(event, task.id)}
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                            task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-indigo-500'
                                        }`}
                                    >
                                        {task.completed && <Check size={12} className="text-white" />}
                                    </button>
                                    
                                    {editingTaskId === task.id ? (
                                        <div className="flex items-center gap-2 flex-1">
                                            <input 
                                                autoFocus
                                                value={editingTaskTitle}
                                                onChange={(e) => setEditingTaskTitle(e.target.value)}
                                                className="flex-1 bg-white border border-indigo-300 rounded px-2 py-1 text-sm outline-none"
                                                onKeyDown={(e) => e.key === 'Enter' && saveEditedTask(event)}
                                            />
                                            <button onClick={() => saveEditedTask(event)} className="text-green-600"><Check size={16}/></button>
                                            <button onClick={() => setEditingTaskId(null)} className="text-red-500"><X size={16}/></button>
                                        </div>
                                    ) : (
                                        <span className={`text-sm flex-1 ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                            {task.title}
                                        </span>
                                    )}
                                </div>
                                
                                {editingTaskId !== task.id && (
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEditingTask(task)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDeleteTask(event, task.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                      </div>

                      {/* Add New Task */}
                      <div className="flex gap-2">
                         <input 
                            placeholder="Adicionar nova tarefa..." 
                            className="flex-1 px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTask(event)}
                         />
                         <Button variant="secondary" onClick={() => handleAddTask(event)} disabled={!newTaskTitle.trim()}>
                            <Plus size={18} />
                         </Button>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                        <Button variant="outline" className="flex-1 py-2 text-sm" onClick={() => onNavigate('/explore')}>Adicionar Mais Serviços</Button>
                      </div>
                    </div>
                  </div>
                )}) : (
                  <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="text-slate-300" size={32} />
                     </div>
                     <h3 className="text-lg font-bold text-slate-900 mb-1">Nenhum evento ativo</h3>
                     <p className="text-slate-500 mb-6 text-sm">Crie o seu primeiro evento para ver as estatísticas.</p>
                     <Button onClick={() => onNavigate('/create-event')}>Começar Agora</Button>
                  </div>
                )}
              </div>

              {/* Quick Tasks (Sidebar Version) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Tarefas Prioritárias</h2>
                <ul className="space-y-3">
                  {events.length > 0 && events[0]?.tasks.slice(0, 5).map(task => (
                    <li key={task.id} className="flex items-center group cursor-pointer">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                        {task.completed && <Check size={12} className="text-white" />}
                      </div>
                      <span className={`text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {task.title}
                      </span>
                    </li>
                  ))}
                  {(!events.length || !events[0] || events[0].tasks.length === 0) && (
                     <li className="text-slate-400 text-sm italic py-4 text-center">
                       Sem tarefas pendentes.<br/>Gerencie no cartão do evento.
                     </li>
                  )}
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
