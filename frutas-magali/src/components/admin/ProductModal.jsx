import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { CloudinaryUpload } from '../CloudinaryUpload';

export default function ProductModal({ 
  isOpen, 
  onClose, 
  onSave, 
  product = null, 
  saving = false 
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });
  const [errors, setErrors] = useState({});

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        image: product.image || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        image: ''
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.price.trim()) newErrors.price = 'El precio es requerido';
    if (!formData.image.trim()) newErrors.image = 'La imagen es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isEditing ? 'Modifica los campos del producto' : 'Completa los campos para agregar un nuevo producto'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nombre *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Descripción *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Precio *</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Imagen *</label>
              {formData.image && (
                <img src={formData.image} alt="Preview" className="h-32 w-full object-cover rounded-lg mb-3" />
              )}
              <div className="flex gap-3">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className={`flex-1 px-4 py-2 border rounded-lg ${
                    errors.image ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <CloudinaryUpload 
                  onUploadComplete={(url) => setFormData({...formData, image: url})}
                  buttonText="Subir"
                />
              </div>
              {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Guardando...
                  </>
                ) : (
                  isEditing ? 'Actualizar Producto' : 'Crear Producto'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}