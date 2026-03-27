import AdminHeader from './AdminHeader';
import AdminStats from './AdminStats';
import AdminTabs from './AdminTabs';

export default function AdminLayout({ 
  children, 
  activeTab, 
  onTabChange, 
  onLogout,
  stats 
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader onLogout={onLogout} />
      <AdminStats stats={stats} />
      <AdminTabs activeTab={activeTab} onTabChange={onTabChange} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}