import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Frutas Mágali</h3>
            <p className="text-gray-400">Más de 40 años produciendo y exportando frutas premium desde Argentina al mundo.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><Phone size={18} /> +54 9 381 123-4567</div>
              <div className="flex items-center gap-2"><Mail size={18} /> info@frutasmagali.com</div>
              <div className="flex items-center gap-2"><MapPin size={18} /> Tucumán, Argentina</div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li><a href="#productos" className="text-gray-400 hover:text-white transition">Productos</a></li>
              <li><a href="#nosotros" className="text-gray-400 hover:text-white transition">Nosotros</a></li>
              <li><a href="#contacto" className="text-gray-400 hover:text-white transition">Contacto</a></li>
              <li><Link to="/admin" className="text-gray-400 hover:text-white transition">Admin Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contáctanos</h3>
            <Link 
              to="/contacto"
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition"
            >
              <MessageCircle size={18} />
              Enviar mensaje
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Frutas Mágali. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}