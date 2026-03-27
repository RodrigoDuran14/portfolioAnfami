import { useState } from 'react';
import { 
  MessageSquare, User, Mail, Phone, Calendar, Eye, CheckCircle, Trash2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactsTab({ contacts, onView, onMarkAsRead, onDelete }) {
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [itemsPerPageOpen, setItemsPerPageOpen] = useState(false);

  // Calcular paginación
  const totalItems = contacts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContacts = contacts.slice(startIndex, endIndex);

  // Función para cambiar de página
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Función para cambiar items por página
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setItemsPerPageOpen(false);
  };

  // Función para confirmar eliminación
  const confirmDelete = (contactId, contactName) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[280px]">
        <div className="flex items-center gap-2">
          <div className="bg-red-100 p-1.5 rounded-full">
            <Trash2 size={18} className="text-red-600" />
          </div>
          <p className="text-sm font-medium text-gray-800">¿Eliminar mensaje de "{contactName}"?</p>
        </div>
        <p className="text-xs text-gray-500">Esta acción no se puede deshacer.</p>
        <div className="flex gap-2 justify-end mt-1">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onDelete(contactId);
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition flex items-center gap-1"
          >
            <Trash2 size={12} />
            Eliminar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded-lg transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      style: {
        background: '#ffffff',
        color: '#1f2937',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
      },
      icon: '⚠️',
    });
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-gray-800">Mensajes de Contacto</h2>
        
        {/* Selector de items por página */}
        <div className="relative">
          <button
            onClick={() => setItemsPerPageOpen(!itemsPerPageOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <span className="text-sm text-gray-600">Mostrar:</span>
            <span className="font-medium text-gray-800">{itemsPerPage}</span>
            <span className="text-gray-400">▼</span>
          </button>
          
          {itemsPerPageOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {[5, 10, 20, 50].map(value => (
                <button
                  key={value}
                  onClick={() => handleItemsPerPageChange(value)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                    itemsPerPage === value ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  {value} por página
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Contador de mensajes */}
      <div className="mb-4 text-sm text-gray-500">
        Mostrando {startIndex + 1} - {Math.min(endIndex, totalItems)} de {totalItems} mensajes
      </div>
      
      {/* Lista de mensajes */}
      <div className="space-y-4">
        {currentContacts.map(contact => (
          <div 
            key={contact.id} 
            className={`bg-white rounded-lg shadow p-5 transition ${!contact.leido ? 'border-l-4 border-yellow-500' : ''}`}
          >
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-4 mb-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User size={16} />
                    <span className="font-medium">{contact.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail size={14} />
                    <a href={`mailto:${contact.email}`} className="hover:text-green-700 truncate">{contact.email}</a>
                  </div>
                  {contact.telefono && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Phone size={14} />
                      <a href={`tel:${contact.telefono}`} className="hover:text-green-700">{contact.telefono}</a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar size={14} />
                    {new Date(contact.fecha).toLocaleString()}
                  </div>
                </div>
                
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg line-clamp-2">{contact.mensaje}</p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                {!contact.leido && (
                  <button
                    onClick={() => onMarkAsRead(contact.id)}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition"
                  >
                    <CheckCircle size={14} />
                    Marcar leído
                  </button>
                )}
                {contact.leido && (
                  <span className="flex items-center gap-1 text-gray-400 text-sm">
                    <CheckCircle size={14} />
                    Leído
                  </span>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(contact)}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <Eye size={14} />
                    Ver detalles
                  </button>
                  <button
                    onClick={() => confirmDelete(contact.id, contact.nombre)}
                    className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {contacts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No hay mensajes de contacto aún</p>
          </div>
        )}
      </div>
      
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="Primera página"
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="Página anterior"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex gap-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && goToPage(page)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-sm transition ${
                  page === currentPage
                    ? 'bg-green-700 text-white'
                    : page === '...'
                    ? 'text-gray-400 cursor-default'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="Página siguiente"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="Última página"
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      )}
      
      {/* Información de paginación */}
      {totalPages > 1 && (
        <div className="text-center mt-4 text-sm text-gray-400">
          Página {currentPage} de {totalPages}
        </div>
      )}
    </div>
  );
}