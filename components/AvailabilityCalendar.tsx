
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';

interface Props {
  unavailableDates: string[]; // ISO 'YYYY-MM-DD'
  onSelect: (date: Date, time: string) => void;
}

const DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export const AvailabilityCalendar: React.FC<Props> = ({ unavailableDates, onSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Time slots (could be dynamic)
  const timeSlots = ['09:00', '10:00', '13:00', '15:00', '18:00', '20:00'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  const isUnavailable = (day: number) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = checkDate.toISOString().split('T')[0];
    
    // Check if passed
    const today = new Date();
    today.setHours(0,0,0,0);
    if (checkDate < today) return true;

    return unavailableDates.includes(dateString);
  };

  const handleDateClick = (day: number) => {
    if (isUnavailable(day)) return;
    const newSelected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelected);
    setSelectedTime(''); // Reset time on date change
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSelect(selectedDate, time);
    }
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const unavailable = isUnavailable(day);
      const isSelected = selectedDate?.getDate() === day && 
                         selectedDate?.getMonth() === currentDate.getMonth() &&
                         selectedDate?.getFullYear() === currentDate.getFullYear();
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={unavailable}
          className={`
            h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium transition-all relative group
            ${isSelected 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
              : unavailable 
                ? 'text-slate-300 cursor-not-allowed decoration-slate-300' 
                : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
            }
          `}
        >
          {day}
          {unavailable && (
             <span className="absolute hidden group-hover:block bottom-full mb-1 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10">
               Indisponível
             </span>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
         <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <CalendarIcon size={20} />
         </div>
         <h3 className="font-bold text-slate-900 text-lg">Verificar Disponibilidade</h3>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 rounded-full text-slate-500 hover:text-indigo-600 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="font-bold text-slate-800 capitalize">
          {MONTHS[currentDate.getMonth()]} <span className="text-slate-400 font-normal">{currentDate.getFullYear()}</span>
        </div>
        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 rounded-full text-slate-500 hover:text-indigo-600 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-bold text-slate-400 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2 justify-items-center mb-6">
        {renderDays()}
      </div>

      <div className={`transition-all duration-500 overflow-hidden ${selectedDate ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
         <div className="border-t border-slate-100 pt-4">
            <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center">
              <Clock size={14} className="mr-2 text-indigo-500" /> 
              Horários disponíveis para {selectedDate?.getDate()} de {MONTHS[selectedDate?.getMonth() || 0]}
            </h4>
            
            <div className="grid grid-cols-3 gap-2">
               {timeSlots.map(time => (
                 <button
                   key={time}
                   onClick={() => handleTimeSelect(time)}
                   className={`
                      py-2 rounded-xl text-sm font-medium transition-all border
                      ${selectedTime === time 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                      }
                   `}
                 >
                   {time}
                 </button>
               ))}
            </div>
         </div>
      </div>
      
      {!selectedDate && (
         <div className="flex items-center justify-center p-3 bg-slate-50 rounded-xl text-xs text-slate-500 gap-2 border border-slate-100 border-dashed">
            <AlertCircle size={14} /> Selecione uma data para ver horários
         </div>
      )}
    </div>
  );
};
