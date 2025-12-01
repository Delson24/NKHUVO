
import React, { useRef, useEffect, useState } from 'react';
import { X, Send, Paperclip, MoreVertical, CheckCheck } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  providerName: string;
  providerAvatar?: string;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ 
  isOpen, 
  onClose, 
  serviceName, 
  providerName, 
  providerAvatar,
  messages,
  onSendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;

    onSendMessage(newMessage);
    setNewMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Window */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col h-[600px] overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={providerAvatar || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop"} 
                alt={providerName} 
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">{providerName}</h3>
              <p className="text-xs text-slate-500">Normalmente responde em 1h</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
              <MoreVertical size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
          <div className="text-center text-xs text-slate-400 my-4">
            <span>Início da Conversa</span>
          </div>
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed relative ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                }`}
              >
                {msg.text}
                <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.sender === 'user' && <CheckCheck size={12} />}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="flex items-end gap-2 bg-slate-50 p-2 rounded-[1.5rem] border border-slate-200 focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
            <button 
              type="button"
              className="p-3 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-white"
            >
              <Paperclip size={20} />
            </button>
            <textarea 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Escreva sua mensagem..."
              className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 resize-none py-3 max-h-24 text-sm"
              rows={1}
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
