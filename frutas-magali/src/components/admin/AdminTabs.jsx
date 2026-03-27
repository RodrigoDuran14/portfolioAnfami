import { Package, Image, MessageSquare, FileText } from 'lucide-react';

export default function AdminTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'carousel', label: 'Carrusel', icon: Image },
    { id: 'contacts', label: 'Mensajes', icon: MessageSquare },
    { id: 'sections', label: 'Contenido', icon: FileText }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Contenedor con scroll horizontal en móvil */}
      <div className="relative">
        {/* Indicador de scroll (opcional) - solo visible en móvil con scroll */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-100 to-transparent pointer-events-none md:hidden z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none md:hidden z-10"></div>
        
        {/* Tabs con scroll horizontal en móvil */}
        <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
          <nav className="flex space-x-6 md:space-x-8 min-w-max md:min-w-0 border-b border-gray-200">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    group relative flex items-center gap-2 py-3 md:py-4 px-1 
                    border-b-2 font-medium text-sm transition-all duration-200
                    whitespace-nowrap
                    ${isActive
                      ? 'border-green-700 text-green-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon 
                    size={18} 
                    className={`transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-green-700' : 'text-gray-400'
                    }`}
                  />
                  <span className="hidden xs:inline-block">{tab.label}</span>
                  <span className="xs:hidden">
                    {tab.label === 'Productos' && 'Prod'}
                    {tab.label === 'Carrusel' && 'Car'}
                    {tab.label === 'Mensajes' && 'Msg'}
                    {tab.label === 'Contenido' && 'Cont'}
                  </span>
                  
                  {/* Indicador de active animado */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-700 rounded-full scale-x-100 transition-transform duration-300" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Indicador de cantidad de pestañas (opcional) */}
      <div className="mt-2 text-xs text-gray-400 text-center md:hidden">
        Desliza para ver más opciones →
      </div>
    </div>
  );
}