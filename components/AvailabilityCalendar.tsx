

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, AlertCircle, Calendar as CalendarIcon, ArrowRight, Truck } from 'lucide-react';
import { BusinessHours, Booking, BookingType } from '../types';

interface Props {
  unavailableDates: string[]; // ISO 'YYYY-MM-DD' (Full blocked days)
  bookedSlots?: Booking[]; // Array of bookings to check overlap
  onSelect: (date: Date, startTime: string, endTime: string) => void;
  businessHours?: BusinessHours;
  bookingType?: BookingType; // 'time_bound' (Start-End) or 'delivery_bound' (Single time)
}

const DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export const AvailabilityCalendar: React.FC<Props> = ({ 
    unavailableDates, 
    bookedSlots = [], 
    onSelect, 
    businessHours, 
    bookingType = 'time_bound' 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [availableEndTimes, setAvailableEndTimes] = useState<string[]>([]);

  // 1. Generate Base Time Slots based on Business Hours
  useEffect(() => {
    const slots = [];
    let startHour = 8; // Default 8 AM
    let endHour = 20; // Default 8 PM

    if (businessHours && businessHours.type === 'custom' && businessHours.start && businessHours.end) {
        startHour = parseInt(businessHours.start.split(':')[0]);
        endHour = parseInt(businessHours.end.split(':')[0]);
    } else if (businessHours && businessHours.type === '24h') {
        startHour = 0;
        endHour = 23;
    }

    for (let i = startHour; i <= endHour; i++) {
        const hour = i % 24;
        const time = `${hour.toString().padStart(2, '0')}:00`;
        slots.push(time);
        if (i === endHour && endHour !== 23 && businessHours?.type !== '24h') break;
    }
    
    // For 24h, we still show all hours for granular selection in interval mode
    if (businessHours?.type === '24h') {
        const allHours = [];
        for(let j=0; j<24; j++) allHours.push(`${j.toString().padStart(2,'0')}:00`);
        setTimeSlots(allHours);
    } else {
        setTimeSlots(slots);
    }

  }, [businessHours]);

  // 2. Update Available End Times when Start Time changes (ONLY FOR TIME_BOUND)
  useEffect(() => {
    if (bookingType === 'delivery_bound') return; // Skip logic for delivery

    if (!selectedStartTime || !selectedDate) {
        setAvailableEndTimes([]);
        return;
    }

    const startHour = parseInt(selectedStartTime.split(':')[0]);
    const potentialEnds = [];
    let limitHour = 24;
    
    // Find business close hour
    if (businessHours?.type === 'custom' && businessHours.end) {
        limitHour = parseInt(businessHours.end.split(':')[0]);
    }

    // Check for next booking on the same day to set a ceiling
    if (selectedDate) {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const bookingsToday = bookedSlots.filter(b => b.date.startsWith(dateStr));
        const nextBooking = bookingsToday
            .map(b => parseInt(b.date.split('T')[1].split(':')[0]))
            .filter(h => h > startHour)
            .sort((a,b) => a - b)[0];

        if (nextBooking) {
            limitHour = Math.min(limitHour, nextBooking);
        }
    }

    for (let i = startHour + 1; i <= limitHour; i++) {
         const h = i % 24;
         const time = `${h.toString().padStart(2, '0')}:00`;
         potentialEnds.push(time);
         if (i === limitHour) break; 
    }

    setAvailableEndTimes(potentialEnds);
    setSelectedEndTime('');

  }, [selectedStartTime, selectedDate, businessHours, bookedSlots, bookingType]);


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

  const isDayUnavailable = (day: number) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = checkDate.toISOString().split('T')[0];
    
    const today = new Date();
    today.setHours(0,0,0,0);
    if (checkDate < today) return true;

    return unavailableDates.includes(dateString);
  };

  const isTimeSlotBooked = (time: string) => {
     if (!selectedDate) return false;
     
     const dateStr = selectedDate.toISOString().split('T')[0];
     const slotHour = parseInt(time.split(':')[0]);

     return bookedSlots.some(booking => {
        if (!booking.date.startsWith(dateStr)) return false;
        
        const startH = parseInt(booking.date.split('T')[1].split(':')[0]);
        // For delivery bound, we might check if a specific time is TAKEN, but usually they can handle multiple.
        // For simplicity, we assume strictly time-bound resources block the slot.
        // If bookingType is delivery, we might be looser, but let's check basic overlap.
        
        let endH = startH + 1; 
        if (booking.endDate) {
            endH = parseInt(booking.endDate.split('T')[1].split(':')[0]);
        }
        
        // If the booking is delivery (no end time usually), it occupies just that slot
        if (!booking.endDate) return slotHour === startH;

        return slotHour >= startH && slotHour < endH;
     });
  };

  const handleDateClick = (day: number) => {
    if (isDayUnavailable(day)) return;
    const newSelected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelected);
    setSelectedStartTime('');
    setSelectedEndTime('');
  };

  const handleStartTimeSelect = (time: string) => {
    setSelectedStartTime(time);
    
    // If delivery bound, selecting start time IS the action, no end time needed
    if (bookingType === 'delivery_bound' && selectedDate) {
        // We pass the same time as end time for API consistency, or handle it upstream
        onSelect(selectedDate, time, time); 
    }
  };

  const handleEndTimeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
     const time = e.target.value;
     setSelectedEndTime(time);
     if (selectedDate && selectedStartTime && time) {
         onSelect(selectedDate, selectedStartTime, time);
     }
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const unavailable = isDayUnavailable(day);
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
         <h3 className="font-bold text-slate-900 text-lg">
             {bookingType === 'delivery_bound' ? 'Data de Entrega' : 'Verificar Disponibilidade'}
         </h3>
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

      <div className={`transition-all duration-500 overflow-hidden ${selectedDate ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
         <div className="border-t border-slate-100 pt-4 space-y-4">
            
            {/* Start Time Grid (Or Delivery Time) */}
            <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center">
                    {bookingType === 'delivery_bound' ? (
                        <><Truck size={14} className="mr-2 text-indigo-500" /> Hora Prevista de Entrega</>
                    ) : (
                        <><Clock size={14} className="mr-2 text-indigo-500" /> Hora de Início</>
                    )}
                </h4>
                
                <div className="grid grid-cols-3 gap-2">
                {timeSlots.map(time => {
                    const isBooked = isTimeSlotBooked(time);
                    return (
                    <button
                        key={time}
                        onClick={() => !isBooked && handleStartTimeSelect(time)}
                        disabled={isBooked}
                        className={`
                            py-2 rounded-xl text-sm font-medium transition-all border
                            ${isBooked 
                            ? 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed line-through' 
                            : selectedStartTime === time 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                            }
                        `}
                    >
                        {time}
                    </button>
                    );
                })}
                </div>
                {timeSlots.length === 0 && <p className="text-xs text-slate-400 mt-2">Nenhum horário disponível.</p>}
            </div>

            {/* End Time Selector (ONLY FOR TIME_BOUND) */}
            {bookingType === 'time_bound' && selectedStartTime && (
                <div className="animate-fade-in-up bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-2 text-sm font-bold text-slate-800">
                        <span>Das {selectedStartTime}</span>
                        <ArrowRight size={14} className="text-slate-400" />
                        <span>Até...</span>
                    </div>
                    
                    <select 
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500 font-medium text-slate-700 cursor-pointer"
                        value={selectedEndTime}
                        onChange={handleEndTimeSelect}
                    >
                        <option value="">Selecione hora de fim</option>
                        {availableEndTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
            )}

            {bookingType === 'delivery_bound' && selectedStartTime && (
                <div className="animate-fade-in-up p-3 bg-green-50 rounded-xl border border-green-100 text-green-700 text-xs font-medium text-center">
                    Entrega/Recolha agendada para as {selectedStartTime}.
                </div>
            )}

         </div>
      </div>
      
      {!selectedDate && (
         <div className="flex items-center justify-center p-3 bg-slate-50 rounded-xl text-xs text-slate-500 gap-2 border border-slate-100 border-dashed">
            <AlertCircle size={14} /> Selecione uma data
         </div>
      )}
    </div>
  );
};