import { Plus, Edit, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductsTab({ 
  products, 
  onAdd, 
  onEdit, 
  onDelete,
  loading 
}) {
  // Función para confirmar eliminación
  const confirmDelete = (productId, productName) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[280px]">
        <div className="flex items-center gap-2">
          <div className="bg-red-100 p-1.5 rounded-full">
            <Trash2 size={18} className="text-red-600" />
          </div>
          <p className="text-sm font-medium text-gray-800">¿Eliminar "{productName}"?</p>
        </div>
        <p className="text-xs text-gray-500">Esta acción no se puede deshacer.</p>
        <div className="flex gap-2 justify-end mt-1">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onDelete(productId);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Gestión de Productos</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} />
          Nuevo Producto
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden group">
            <img src={product.image} alt={product.name} className="h-48 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
              <p className="text-green-700 font-semibold mb-3">{product.price}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(product)}
                  className="flex-1 bg-gray-100 hover:bg-gray-400 text-black hover:text-white py-2 rounded-lg transition flex items-center justify-center gap-1 border border-solid border-black hover:border-none"
                >
                  <Edit size={16} />
                  Editar
                </button>
                <button
                  onClick={() => confirmDelete(product.id, product.name)}
                  className="flex-1 bg-gray-100 hover:bg-red-600 text-black hover:text-white py-2 rounded-lg transition flex items-center justify-center gap-1 border border-solid border-black hover:border-none"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No hay productos aún</p>
          <button onClick={onAdd} className="mt-3 text-green-700 hover:underline">
            Crear primer producto
          </button>
        </div>
      )}
    </div>
  );
}