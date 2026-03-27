import { useState } from 'react';
import { Edit } from 'lucide-react';

export default function SectionsTab({ sections, onUpdate }) {
  const [editingSection, setEditingSection] = useState(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (section, value) => {
    setEditingSection(section);
    setEditValue(value);
  };

  const saveEdit = async (section) => {
    await onUpdate(section, editValue);
    setEditingSection(null);
    setEditValue('');
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Editar Contenido del Sitio</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Misión */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Misión</h3>
          {editingSection === 'mission' ? (
            <div>
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                rows="6"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => saveEdit('mission')}
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingSection(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4 leading-relaxed">{sections.mission}</p>
              <button
                onClick={() => startEdit('mission', sections.mission)}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Edit size={14} />
                Editar misión
              </button>
            </div>
          )}
        </div>
        
        {/* Visión */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Visión</h3>
          {editingSection === 'vision' ? (
            <div>
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                rows="6"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => saveEdit('vision')}
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingSection(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4 leading-relaxed">{sections.vision}</p>
              <button
                onClick={() => startEdit('vision', sections.vision)}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Edit size={14} />
                Editar visión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}