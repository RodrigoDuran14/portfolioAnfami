export default function ProductCard({ product, isAdmin = false, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
      <div className="relative overflow-hidden h-56">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        <p className="text-green-700 font-semibold mb-4 text-lg">{product.price}</p>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-1"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-1"
            >
              Eliminar
            </button>
          </div>
        )}
        {!isAdmin && (
          <a 
            href="/contacto"
            className="block text-center bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg transition"
          >
            Consultar precio
          </a>
        )}
      </div>
    </div>
  )
}