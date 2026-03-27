import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth } from '../config/firebase';
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  getCarouselImages,
  addCarouselImage,
  deleteCarouselImage,
  getSectionContent,
  updateSectionContent,
  getContacts,
  markContactAsRead,
  deleteContact 
} from '../services/ContentService';

// Componentes
import AdminLayout from '../components/admin/AdminLayout';
import AdminLogin from '../components/admin/AdminLogin';
import ProductModal from '../components/admin/ProductModal';
import ContactModal from '../components/admin/ContactModal';
import ProductsTab from '../components/admin/tabs/ProductsTab';
import CarouselTab from '../components/admin/tabs/CarouselTab';
import ContactsTab from '../components/admin/tabs/ContactsTab';
import SectionsTab from '../components/admin/tabs/SectionsTab';

export default function Admin() {
  const navigate = useNavigate();
  
  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  
  // Estados de datos
  const [products, setProducts] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [sections, setSections] = useState({
    mission: '',
    vision: ''
  });
  
  // Estados de UI
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estados de modales
  const [editingProduct, setEditingProduct] = useState(null);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  
  // Cargar datos
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = async () => {
    setLoading(true);
    const loadingToast = toast.loading('Cargando datos...');
    
    try {
      const [productsData, carouselData, contactsData, missionData, visionData] = await Promise.all([
        getProducts(),
        getCarouselImages(),
        getContacts(),
        getSectionContent('mission'),
        getSectionContent('vision')
      ]);
      
      setProducts(productsData);
      setCarouselImages(carouselData);
      setContacts(contactsData);
      setSections({
        mission: missionData?.content || 'Somos una empresa agroexportadora...',
        vision: visionData?.content || 'Ser empresa referente a nivel internacional...'
      });
      
      toast.dismiss(loadingToast);
      toast.success('Datos cargados correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.dismiss(loadingToast);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Autenticación
  const handleLogin = async (email, password) => {
    setAuthLoading(true);
    const loginToast = toast.loading('Iniciando sesión...');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.dismiss(loginToast);
      toast.success('¡Bienvenido al Dashboard!');
      setIsAuthenticated(true);
    } catch (error) {
      toast.dismiss(loginToast);
      toast.error('Credenciales incorrectas');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Sesión cerrada correctamente');
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  // Productos
  const handleAddProduct = async (productData) => {
    setSaving(true);
    const savingToast = toast.loading('Creando producto...');
    
    try {
      await addProduct(productData);
      await loadAllData();
      toast.dismiss(savingToast);
      toast.success('Producto creado correctamente');
      setCreatingProduct(false);
    } catch (error) {
      toast.dismiss(savingToast);
      toast.error('Error al crear producto');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProduct = async (productData) => {
    setSaving(true);
    const savingToast = toast.loading('Actualizando producto...');
    
    try {
      await updateProduct(editingProduct.id, productData);
      await loadAllData();
      toast.dismiss(savingToast);
      toast.success('Producto actualizado correctamente');
      setEditingProduct(null);
    } catch (error) {
      toast.dismiss(savingToast);
      toast.error('Error al actualizar producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    const deletingToast = toast.loading('Eliminando producto...');
    
    try {
      await deleteProduct(id);
      await loadAllData();
      toast.dismiss(deletingToast);
      toast.success('Producto eliminado');
    } catch (error) {
      toast.dismiss(deletingToast);
      toast.error('Error al eliminar producto');
    }
  };

  // Carrusel
  const handleAddCarouselImage = async (imageUrl) => {
    const uploadToast = toast.loading('Subiendo imagen...');
    
    try {
      await addCarouselImage(imageUrl);
      await loadAllData();
      toast.dismiss(uploadToast);
      toast.success('Imagen agregada al carrusel');
    } catch (error) {
      toast.dismiss(uploadToast);
      toast.error('Error al subir imagen');
    }
  };

  const handleDeleteCarouselImage = async (id) => {
    const deletingToast = toast.loading('Eliminando imagen...');
    
    try {
      await deleteCarouselImage(id);
      await loadAllData();
      toast.dismiss(deletingToast);
      toast.success('Imagen eliminada');
    } catch (error) {
      toast.dismiss(deletingToast);
      toast.error('Error al eliminar imagen');
    }
  };

  // Secciones
  const handleUpdateSection = async (section, content) => {
    const savingToast = toast.loading(`Guardando ${section}...`);
    
    try {
      await updateSectionContent(section, { content });
      await loadAllData();
      toast.dismiss(savingToast);
      toast.success(`${section === 'mission' ? 'Misión' : 'Visión'} actualizada`);
    } catch (error) {
      toast.dismiss(savingToast);
      toast.error('Error al actualizar');
    }
  };

  // Contactos
  const handleMarkAsRead = async (contactId) => {
    const markingToast = toast.loading('Marcando como leído...');
    
    try {
      await markContactAsRead(contactId);
      await loadAllData();
      toast.dismiss(markingToast);
      toast.success('Mensaje marcado como leído');
    } catch (error) {
      toast.dismiss(markingToast);
      toast.error('Error al marcar');
    }
  };

const handleDeleteContact = async (contactId) => {
  const deletingToast = toast.loading('Eliminando mensaje...');
  
  try {
    await deleteContact(contactId);
    await loadAllData();
    toast.dismiss(deletingToast);
    toast.success('Mensaje eliminado correctamente');
  } catch (error) {
    toast.dismiss(deletingToast);
    toast.error('Error al eliminar mensaje');
  }
};

  // Renderizado condicional
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} loading={authLoading} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const unreadCount = contacts.filter(c => !c.leido).length;

  return (
    <>
      <AdminLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        stats={{
          products: products.length,
          carousel: carouselImages.length,
          contacts: contacts.length,
          sections: 2,
          unreadCount
        }}
      >
        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            onAdd={() => setCreatingProduct(true)}
            onEdit={setEditingProduct}
            onDelete={handleDeleteProduct}
          />
        )}
        
        {activeTab === 'carousel' && (
          <CarouselTab
            images={carouselImages}
            onAdd={handleAddCarouselImage}
            onDelete={handleDeleteCarouselImage}
          />
        )}
        
        {activeTab === 'contacts' && (
          <ContactsTab
            contacts={contacts}
            onView={setSelectedContact}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteContact}
          />
        )}
        
        {activeTab === 'sections' && (
          <SectionsTab
            sections={sections}
            onUpdate={handleUpdateSection}
          />
        )}
      </AdminLayout>
      
      {/* Modales */}
      <ProductModal
        isOpen={creatingProduct}
        onClose={() => setCreatingProduct(false)}
        onSave={handleAddProduct}
        saving={saving}
      />
      
      <ProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleUpdateProduct}
        product={editingProduct}
        saving={saving}
      />
      
      <ContactModal
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        onMarkAsRead={handleMarkAsRead}
      />
    </>
  );
}