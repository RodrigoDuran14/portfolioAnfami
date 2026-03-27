import { User, Mail, Phone, Calendar, X } from 'lucide-react';

export default function ContactModal({ contact, onClose, onMarkAsRead }) {
  if (!contact) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">Detalles del Mensaje</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <User size={18} />
              <span className="font-medium">{contact.nombre}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={16} />
              <a href={`mailto:${contact.email}`} className="text-blue-600">{contact.email}</a>
            </div>
            {contact.telefono && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} />
                <a href={`tel:${contact.telefono}`} className="text-blue-600">{contact.telefono}</a>
              </div>
            )}
            <div className="text-gray-400 text-sm">
              <Calendar size={14} className="inline mr-1" />
              {new Date(contact.fecha).toLocaleString()}
            </div>
            <div className="border-t pt-3 mt-3">
              <p className="text-gray-800 whitespace-pre-wrap">{contact.mensaje}</p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            {!contact.leido && (
              <button
                onClick={() => {
                  onMarkAsRead(contact.id);
                  onClose();
                }}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg transition"
              >
                Marcar como leído
              </button>
            )}
            <button
              onClick={() => window.location.href = `mailto:${contact.email}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
            >
              Responder por email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}