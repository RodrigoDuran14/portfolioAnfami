import { Package, Image, MessageSquare, FileText, Info } from 'lucide-react';
import { useState } from 'react';

export default function AdminStats({ stats }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const statItems = [
    { 
      label: 'Productos', 
      value: stats.products, 
      icon: Package, 
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
    { 
      label: 'Imágenes Carrusel', 
      value: stats.carousel, 
      icon: Image, 
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    { 
      label: 'Mensajes', 
      value: stats.contacts, 
      icon: MessageSquare, 
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      badge: stats.unreadCount > 0 ? `${stats.unreadCount} sin leer` : null,
      badgeCount: stats.unreadCount
    },
    { 
      label: 'Secciones', 
      value: stats.sections, 
      icon: FileText, 
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Grid responsive con breakpoints claros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index} 
              className={`
                bg-white rounded-xl shadow-sm p-5 
                flex items-center gap-4 
                hover:shadow-md transition-all duration-200
                border border-gray-100
              `}
            >
              {/* Icono con fondo de color */}
              <div className={`${item.bgColor} p-3 rounded-xl flex-shrink-0`}>
                <Icon className={`h-6 w-6 ${item.textColor}`} />
              </div>
              
              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-500 text-sm font-medium truncate">{item.label}</p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                  {item.badge && (
                    <span className={`
                      inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${item.bgColor} ${item.textColor}
                    `}>
                      {item.badge}
                    </span>
                  )}
                </div>
                {/* Indicador visual para mensajes no leídos */}
                {item.badgeCount > 0 && (
                  <div className="mt-1 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-red-500 truncate">
                      {item.badgeCount} mensaje{item.badgeCount !== 1 ? 's' : ''} sin leer
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}