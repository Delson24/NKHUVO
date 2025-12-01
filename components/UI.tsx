
import React, { useState, useEffect } from 'react';
import { Star, MapPin, CheckCircle, XCircle, Upload, Image as ImageIcon, X } from 'lucide-react';
import { Service } from '../types';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "relative px-8 py-3.5 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";
  
  const variants = {
    primary: "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/50 hover:-translate-y-0.5",
    secondary: "bg-white text-slate-800 border border-slate-100 shadow-sm hover:bg-slate-50 hover:border-slate-200",
    outline: "bg-transparent border-2 border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
};

export const ServiceCard: React.FC<{ service: Service, onClick: () => void }> = ({ service, onClick }) => {
  const formatter = new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN'
  });

  const priceUnitLabels: Record<string, string> = {
    'hora': 'MZN / hora',
    'evento': 'MZN / evento',
    'pessoa': 'MZN / pessoa',
    'dia': 'MZN / dia',
    'unidade': 'MZN / un.'
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-500 cursor-pointer h-full flex flex-col overflow-hidden relative"
    >
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10" />
        <img 
          src={service.images[0]} 
          alt={service.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-4 right-4 z-20">
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow-lg shadow-black/5">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                {service.rating} <span className="text-slate-400 font-normal">({service.reviews})</span>
            </div>
        </div>
        <div className="absolute bottom-4 left-4 z-20">
            <div className="bg-indigo-600/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg shadow-indigo-900/20 tracking-wide border border-white/10">
                {service.category}
            </div>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">
          {service.name}
        </h3>
        
        <div className="flex items-center text-slate-500 text-sm mb-4 font-medium">
          <MapPin size={16} className="mr-1.5 text-indigo-400" />
          {service.location}
        </div>

        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-6 flex-grow opacity-80">
          {service.description}
        </p>

        <div className="pt-5 border-t border-slate-50 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">A partir de</span>
            <div className="relative group/price w-fit">
              <div className="text-slate-900 font-bold text-xl cursor-help flex items-baseline gap-1">
                {formatter.format(service.price)}
                <span className="text-xs text-slate-400 font-medium lowercase">/{service.priceUnit}</span>
              </div>
              
              <div className="absolute bottom-full left-0 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/price:opacity-100 transition-all transform translate-y-1 group-hover/price:translate-y-0 pointer-events-none whitespace-nowrap z-30">
                {priceUnitLabels[service.priceUnit] || `MZN por ${service.priceUnit}`}
                <div className="absolute top-full left-4 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
              </div>
            </div>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- NEW COMPONENT: TOAST NOTIFICATION ---
export interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all duration-500 animate-fade-in-down border ${
      type === 'success' 
        ? 'bg-white border-green-100 text-slate-800' 
        : 'bg-white border-red-100 text-slate-800'
    }`}>
      <div className={`p-2 rounded-full ${type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      </div>
      <div>
        <h4 className={`font-bold text-sm ${type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
          {type === 'success' ? 'Sucesso!' : 'Erro'}
        </h4>
        <p className="text-sm font-medium text-slate-600">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 text-slate-400 hover:text-slate-600">
        <X size={16} />
      </button>
    </div>
  );
};

// --- NEW COMPONENT: FILE UPLOADER ---
interface FileUploaderProps {
  label: string;
  onFileSelect: (base64: string) => void;
  currentImage?: string;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ label, onFileSelect, currentImage, className = '' }) => {
  const [preview, setPreview] = useState<string>(currentImage || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onFileSelect(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`group ${className}`}>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group-focus-within:ring-4 group-focus-within:ring-indigo-100">
        <input 
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
        
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-10">
            <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
              <Upload size={20} className="text-indigo-500" />
            </div>
            <span className="text-xs font-bold text-slate-500">Clique para carregar imagem</span>
            <span className="text-[10px] text-slate-400 mt-1">PNG, JPG até 5MB</span>
          </div>
        )}

        {preview && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
             <span className="text-white font-bold text-sm flex items-center gap-2">
               <ImageIcon size={16} /> Alterar Imagem
             </span>
          </div>
        )}
      </div>
    </div>
  );
};
