
import React, { useState } from 'react';
import { Calendar, Users, MapPin, DollarSign, PartyPopper, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { LOCATIONS, CATEGORIES } from '../services/mockData';
import { Button } from '../components/UI';
import { EventItem } from '../types';

interface CreateEventProps {
  onNavigate: (path: string) => void;
  onFinish: (event: EventItem) => void;
}

export const CreateEvent: React.FC<CreateEventProps> = ({ onNavigate, onFinish }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    date: '',
    location: '',
    customLocation: '',
    guests: 50,
    budget: 50000,
    services: [] as string[]
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  
  const toggleService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(id) 
        ? prev.services.filter(s => s !== id)
        : [...prev.services, id]
    }));
  };

  const handleCreate = () => {
      // Construct the real event object
      const finalLocation = formData.location === 'Outra' && formData.customLocation 
        ? formData.customLocation 
        : formData.location;

      const newEvent: EventItem = {
          id: `e-${Date.now()}`,
          organizerId: 'u1', // Defaulting to mock user for now as auth is simulated
          name: formData.name,
          date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
          type: formData.type,
          location: finalLocation,
          guests: formData.guests,
          budget: formData.budget, // This is the limit/total available
          status: 'planning',
          services: formData.services,
          tasks: [
              { id: 't1', title: 'Definir lista de convidados', completed: false },
              { id: 't2', title: 'Enviar convites', completed: false },
              { id: 't3', title: 'Confirmar fornecedores', completed: false }
          ]
      };
      
      onFinish(newEvent);
  };

  const StepIndicator = () => (
    <div className="flex justify-between items-center mb-12 relative max-w-xl mx-auto">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10"></div>
      {[1, 2, 3, 4].map(num => (
        <div 
          key={num} 
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
            step >= num ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-2 border-slate-200 text-slate-400'
          }`}
        >
          {step > num ? <Check size={16} /> : num}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Novo Evento</h1>
          <p className="text-slate-500">Vamos planear o seu próximo sucesso.</p>
        </div>

        <StepIndicator />

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 animate-fade-in-up">
          
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Detalhes Principais</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nome do Evento</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Casamento da Ana & João"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Evento</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none appearance-none"
                  >
                    <option value="">Selecione...</option>
                    <option value="Casamento">Casamento</option>
                    <option value="Aniversario">Aniversário</option>
                    <option value="Corporativo">Corporativo</option>
                    <option value="Festa">Festa Privada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Data</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

               {/* Budget Definition */}
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex justify-between">
                    <span>Orçamento Total Disponível (Teto de Investimento)</span>
                    <span className="text-indigo-600 font-bold">{new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(formData.budget)}</span>
                </label>
                <input 
                  type="range" 
                  min="5000" 
                  max="2000000" 
                  step="5000"
                  value={formData.budget}
                  onChange={e => setFormData({...formData, budget: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>5k MZN</span>
                  <span>2M MZN+</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                    * Este valor será usado para calcular quanto ainda tem disponível à medida que contrata serviços.
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location & Guests */}
          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Logística</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Localização</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {LOCATIONS.slice(0, 8).map(loc => (
                    <button
                      key={loc}
                      onClick={() => setFormData({...formData, location: loc})}
                      className={`p-3 rounded-xl border transition-all text-sm font-medium ${
                        formData.location === loc 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                          : 'border-slate-200 hover:border-indigo-300 text-slate-600'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                   <button
                      onClick={() => setFormData({...formData, location: 'Outra'})}
                      className={`p-3 rounded-xl border transition-all text-sm font-medium ${
                        formData.location === 'Outra'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                          : 'border-slate-200 hover:border-indigo-300 text-slate-600'
                      }`}
                    >
                      Outra
                    </button>
                </div>
                
                {formData.location === 'Outra' && (
                    <div className="animate-fade-in-up">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Especifique a Localização</label>
                        <input 
                            type="text" 
                            placeholder="Digite a cidade ou bairro..."
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                            value={formData.customLocation}
                            onChange={(e) => setFormData({...formData, customLocation: e.target.value})}
                        />
                    </div>
                )}
              </div>

              <div>
                <div className="flex justify-between mb-2">
                   <label className="block text-sm font-medium text-slate-700">Número de Convidados</label>
                   <span className="text-indigo-600 font-bold">{formData.guests}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="1000" 
                  step="10"
                  value={formData.guests}
                  onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>10 pessoas</span>
                  <span>1000 pessoas</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Services Needed */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Serviços Desejados</h2>
              <p className="text-slate-500 mb-6">O que precisa contratar? (Seleção múltipla)</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map(cat => (
                  <div 
                    key={cat.id}
                    onClick={() => toggleService(cat.id)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 text-center h-32 ${
                      formData.services.includes(cat.id)
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md'
                        : 'border-slate-100 hover:border-indigo-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-lg">{cat.label.substring(0, 2)}</div>
                    <span className="text-sm font-medium leading-tight">{cat.label}</span>
                    {formData.services.includes(cat.id) && <Check size={16} className="text-indigo-600 absolute top-2 right-2" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
             <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <PartyPopper size={40} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Tudo pronto!</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                   O evento <strong>{formData.name}</strong> está pronto para ser criado em {formData.location === 'Outra' ? formData.customLocation : formData.location}.
                </p>

                <div className="bg-slate-50 rounded-2xl p-6 text-left max-w-sm mx-auto mb-8 space-y-3">
                   <div className="flex justify-between">
                      <span className="text-slate-500">Data</span>
                      <span className="font-semibold text-slate-800">{formData.date || 'A definir'}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-slate-500">Convidados</span>
                      <span className="font-semibold text-slate-800">{formData.guests}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-slate-500">Serviços</span>
                      <span className="font-semibold text-slate-800">{formData.services.length} selecionados</span>
                   </div>
                   <div className="flex justify-between pt-2 border-t border-slate-200">
                      <span className="text-slate-500">Orçamento Disp.</span>
                      <span className="font-bold text-green-600">{new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(formData.budget)}</span>
                   </div>
                </div>
             </div>
          )}

          {/* Footer Actions */}
          <div className="mt-12 flex justify-between pt-6 border-t border-slate-100">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft size={18} className="mr-2" /> Voltar
              </Button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <Button onClick={handleNext} disabled={!formData.name && step === 1}>
                Continuar <ChevronRight size={18} className="ml-2" />
              </Button>
            ) : (
              <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
                Criar Evento
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};