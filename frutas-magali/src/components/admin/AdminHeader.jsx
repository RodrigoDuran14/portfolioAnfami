import { LogOut, Package } from 'lucide-react';

export default function AdminHeader({ onLogout }) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Frutas Mágali - Dashboard</h1>
            <p className="text-sm text-gray-500">Administración de contenido</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}