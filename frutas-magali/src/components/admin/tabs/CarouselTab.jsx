import { Image, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { CloudinaryUpload } from '../../CloudinaryUpload';

export default function CarouselTab({ images, onAdd, onDelete }) {
  // Función para confirmar eliminación de imagen
  const confirmDelete = (imageId) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[80px]">
        <div className="flex items-center gap-2">
          <div className="bg-red-100 p-1.5 rounded-full">
            <Trash2 size={18} className="text-red-600" />
          </div>
          <p className="text-sm font-medium text-gray-800">¿Eliminar esta imagen del carrusel?</p>
        </div>
        <p className="text-xs text-gray-500">La imagen se eliminará permanentemente.</p>
        <div className="flex gap-2 justify-end mt-1">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onDelete(imageId);
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
        background: '#fffff',
        color: '#1f2937',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
      },
      icon: '⚠️',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Gestión del Carrusel</h2>
        <CloudinaryUpload 
          onUploadComplete={onAdd} 
          buttonText="Subir imagen al carrusel" 
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group">
            <img src={img.url} alt="Carrusel" className="h-40 w-full object-cover rounded-lg shadow" />
            <button
              onClick={() => confirmDelete(img.id)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      
      {images.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <Image className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No hay imágenes en el carrusel</p>
          <CloudinaryUpload onUploadComplete={onAdd} buttonText="Subir primera imagen" />
        </div>
      )}
    </div>
  );
}