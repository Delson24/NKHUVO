
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Filter, Search, X, SlidersHorizontal, ChevronRight, ChevronLeft } from 'lucide-react';
import { CATEGORIES } from '../services/mockData';
import { ServiceCard } from '../components/UI';
import { Service } from '../types';

interface ExploreProps {
  onNavigate: (path: string, params?: any) => void;
  initialSearch?: string;
  initialLocation?: string;
  services?: Service[];
}

export const Explore: React.FC<ExploreProps> = ({ onNavigate, initialSearch = '', initialLocation = '', services = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Todos');
  const [searchText, setSearchText] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(true);

  // Scroll ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const activeCategoryData = useMemo(() => {
    return CATEGORIES.find(c => c.id === selectedCategory);
  }, [selectedCategory]);

  const filteredServices = useMemo(() => {
    // Filter services based on all criteria
    return services.filter(service => {
      // 1. Text Search
      if (searchText) {
         const matchName = service.name.toLowerCase().includes(searchText.toLowerCase());
         const matchDesc = service.description.toLowerCase().includes(searchText.toLowerCase());
         if (!matchName && !matchDesc) return false;
      }
      
      // 2. Location (from props if not cleared)
      if (initialLocation && !service.location.includes(initialLocation)) return false;

      // 3. Category
      if (selectedCategory !== 'Todos' && service.category !== selectedCategory) {
        return false;
      }

      // 4. Subcategory
      if (selectedSubcategory !== 'Todos' && service.subcategory !== selectedSubcategory) {
        return false;
      }

      // 5. Price
      const price = service.price;
      if (minPrice && price < parseFloat(minPrice)) return false;
      if (maxPrice && price > parseFloat(maxPrice)) return false;

      // 6. Rating
      if (minRating > 0 && service.rating < minRating) return false;

      return true;
    });
  }, [selectedCategory, selectedSubcategory, minPrice, maxPrice, minRating, services, searchText, initialLocation]);

  const activeFiltersCount = (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (minRating > 0 ? 1 : 0);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategory('Todos');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Controls */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Explorar Serviços</h1>
              <p className="text-slate-500 mt-1">
                 {filteredServices.length} resultados encontrados
                 {initialLocation && ` em ${initialLocation}`}
              </p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                      type="text" 
                      placeholder="Pesquisar..." 
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                   />
                </div>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    showFilters || activeFiltersCount > 0
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
                  }`}
                >
                  <SlidersHorizontal size={18} />
                  <span className="hidden sm:inline">Filtros</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ml-1">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
            </div>
          </div>

          {/* Filters Area */}
          <div className={`space-y-4 transition-all duration-300 ease-in-out ${showFilters ? 'opacity-100 translate-y-0' : 'hidden opacity-0 -translate-y-4'}`}>
            
            {/* Category Pills */}
            <div className="relative group">
              <button 
                onClick={() => scrollCategories('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow-md border border-slate-100 text-slate-600 hover:text-indigo-600"
              >
                <ChevronLeft size={18} />
              </button>

              <div 
                ref={scrollContainerRef}
                className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1 scroll-smooth"
              >
                <button 
                  onClick={() => handleCategoryChange('Todos')}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap shadow-sm transition-all flex-shrink-0 ${
                    selectedCategory === 'Todos' 
                      ? 'bg-indigo-600 text-white shadow-indigo-200' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  Todos
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap shadow-sm transition-all flex items-center gap-2 flex-shrink-0 ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white shadow-indigo-200' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => scrollCategories('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow-md border border-slate-100 text-slate-600 hover:text-indigo-600"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Subcategories */}
            {activeCategoryData && activeCategoryData.subcategories && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide animate-fade-in-down">
                <div className="flex items-center text-slate-400 mr-2 text-sm font-medium flex-shrink-0">
                  <ChevronRight size={16} />
                  <span className="ml-1 uppercase text-xs tracking-wider">Subcategorias:</span>
                </div>
                <button 
                  onClick={() => setSelectedSubcategory('Todos')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                    selectedSubcategory === 'Todos'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  Todas
                </button>
                {activeCategoryData.subcategories.map(sub => (
                  <button 
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                      selectedSubcategory === sub
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}

            {/* Advanced Filters */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-2">
              <div className="md:col-span-1 flex items-center gap-2 text-slate-400 text-sm font-medium uppercase tracking-wide">
                <Filter size={14} /> Filtros
              </div>
              <div className="md:col-span-5 flex items-center gap-4">
                <input 
                    type="number" 
                    placeholder="Min MZN" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="text-slate-300 font-medium">-</span>
                <input 
                    type="number" 
                    placeholder="Max MZN" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              <div className="md:col-span-3">
                 <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                 >
                    <option value="0">Qualquer avaliação</option>
                    <option value="4.5">⭐ 4.5+</option>
                    <option value="4.0">⭐ 4.0+</option>
                 </select>
              </div>

              <div className="md:col-span-2 flex justify-end">
                {(minPrice || maxPrice || minRating > 0 || selectedCategory !== 'Todos' || searchText) && (
                  <button 
                    onClick={() => { setMinPrice(''); setMaxPrice(''); setMinRating(0); setSelectedCategory('Todos'); setSearchText(''); }}
                    className="text-sm text-red-500 hover:text-red-600 font-semibold flex items-center gap-1"
                  >
                    <X size={16} /> Limpar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
                <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onClick={() => onNavigate('/service-detail', { id: service.id })} 
                />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <Search size={48} className="text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum serviço encontrado</h3>
              <p className="text-slate-500">Tente ajustar os filtros ou a pesquisa.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
