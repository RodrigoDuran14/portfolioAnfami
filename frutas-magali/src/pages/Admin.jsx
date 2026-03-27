import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
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
  markContactAsRead
} from '../services/ContentService';
import { CloudinaryUpload } from '../components/CloudinaryUpload';
import ProductCard from '../components/ProductCard';
import { 
  Package, 
  Image, 
  MessageSquare, 
  FileText, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  CheckCircle,
  User,
  Mail,
  Phone,
  Calendar,
  X,
  Upload,
  Loader2
} from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  
  // Estados para datos
  const [products, setProducts] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [sections, setSections] = useState({
    mission: '',
    vision: '',
    heroTitle: 'Frutas Mágali',
    heroSubtitle: 'Productores y empaquetadores de frutas premium desde el corazón de Argentina'
  });
  
  // Estados para modales
  const [editingProduct, setEditingProduct] = useState(null);
  const [creatingProduct, setCreatingProduct] = useState(false); // NUEVO: estado para modal de creación
  const [editingSection, setEditingSection] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Estado para el formulario del producto (crear y editar)
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const navigate = useNavigate();

  // Cargar datos cuando se autentica
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = async () => {
    setLoading(true);
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
      setSections(prev => ({
        ...prev,
        mission: missionData?.content || 'Somos una empresa agroexportadora, dedicada al cultivo, industrialización y exportación de frutas premium. Transmitimos nuestra cultura de trabajo y experiencia de más de 40 años, comprometidos con la satisfacción de nuestros clientes y el bienestar de nuestros colaboradores.',
        vision: visionData?.content || 'Ser empresa referente a nivel internacional en el mundo de las frutas frescas, ofreciendo productos innovadores que superen las expectativas de nuestros clientes, con un modo de producción responsable y sostenible.'
      }));
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar los datos');
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error de login:', error);
      alert('Credenciales incorrectas. Usuario: admin@magali.com');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // ============ PRODUCTOS ============
  
  // Abrir modal para crear producto
  const openCreateModal = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      image: ''
    });
    setFormErrors({});
    setCreatingProduct(true);
  };

  // Abrir modal para editar producto
  const openEditModal = (product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image
    });
    setFormErrors({});
    setEditingProduct(product);
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!productForm.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (productForm.name.length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!productForm.description.trim()) {
      errors.description = 'La descripción es requerida';
    } else if (productForm.description.length < 10) {
      errors.description = 'La descripción debe tener al menos 10 caracteres';
    }
    
    if (!productForm.price.trim()) {
      errors.price = 'El precio es requerido';
    }
    
    if (!productForm.image.trim()) {
      errors.image = 'La imagen es requerida';
    } else if (!productForm.image.match(/^https?:\/\/.+\..+/)) {
      errors.image = 'Ingresa una URL válida de imagen';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Guardar producto (crear o editar)
  const handleSaveProduct = async () => {
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      if (editingProduct) {
        // Actualizar producto existente
        await updateProduct(editingProduct.id, productForm);
      } else {
        // Crear nuevo producto
        await addProduct(productForm);
      }
      await loadAllData();
      setEditingProduct(null);
      setCreatingProduct(false);
      setProductForm({ name: '', description: '', price: '', image: '' });
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar el producto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('¿Eliminar este producto permanentemente?')) {
      try {
        await deleteProduct(id);
        await loadAllData();
      } catch (error) {
        alert('Error al eliminar producto');
      }
    }
  };

  // ============ CARRUSEL ============
  const handleAddCarouselImage = async (imageUrl) => {
    try {
      await addCarouselImage(imageUrl);
      await loadAllData();
      alert('Imagen agregada al carrusel');
    } catch (error) {
      alert('Error al agregar imagen');
    }
  };

  const handleDeleteCarouselImage = async (id) => {
    if (confirm('¿Eliminar esta imagen del carrusel?')) {
      try {
        await deleteCarouselImage(id);
        await loadAllData();
      } catch (error) {
        alert('Error al eliminar imagen');
      }
    }
  };

  // ============ SECCIONES ============
  const handleUpdateSection = async (sectionName, content) => {
    try {
      await updateSectionContent(sectionName, { content });
      await loadAllData();
      setEditingSection(null);
      alert('Sección actualizada correctamente');
    } catch (error) {
      alert('Error al actualizar sección');
    }
  };

  // ============ CONTACTOS ============
  const handleMarkAsRead = async (contactId) => {
    try {
      await markContactAsRead(contactId);
      await loadAllData();
    } catch (error) {
      alert('Error al marcar como leído');
    }
  };

  // ============ RENDER LOGIN ============
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Package className="h-8 w-8 text-green-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
            <p className="text-gray-500 mt-2">Ingresa con tus credenciales</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="admin@magali.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Ingresar al Dashboard'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full text-gray-500 hover:text-gray-700 text-sm py-2"
            >
              ← Volver al sitio web
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading && products.length === 0) {
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Frutas Mágali - Dashboard</h1>
              <p className="text-sm text-gray-500">Administración de contenido</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Productos</p>
              <p className="text-2xl font-bold text-gray-800">{products.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Image className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Imágenes Carrusel</p>
              <p className="text-2xl font-bold text-gray-800">{carouselImages.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-yellow-700" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Mensajes</p>
              <p className="text-2xl font-bold text-gray-800">{contacts.length}</p>
              {unreadCount > 0 && (
                <p className="text-xs text-red-500">{unreadCount} sin leer</p>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Secciones</p>
              <p className="text-2xl font-bold text-gray-800">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'products', label: 'Productos', icon: Package },
              { id: 'carousel', label: 'Carrusel', icon: Image },
              { id: 'contacts', label: 'Mensajes', icon: MessageSquare, badge: unreadCount },
              { id: 'sections', label: 'Contenido', icon: FileText }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === tab.id
                    ? 'border-green-700 text-green-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
                {tab.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PRODUCTOS TAB */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Gestión de Productos</h2>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition"
              >
                <Plus size={18} />
                Nuevo Producto
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img src={product.image} alt={product.name} className="h-48 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <p className="text-green-700 font-semibold mb-3">{product.price}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="flex-1 bg-white-600 hover:bg-gray-400 text-black hover:text-white py-2 rounded-lg transition flex items-center justify-center gap-1 border border-solid border-black hover:border-none"
                      >
                        <Edit size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 bg-white-600 hover:bg-red-600 text-black hover:text-white py-2 rounded-lg transition flex items-center justify-center gap-1 border border-solid border-black hover:border-none"
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
                <button onClick={openCreateModal} className="mt-3 text-green-700 hover:underline">
                  Crear primer producto
                </button>
              </div>
            )}
          </div>
        )}

        {/* CARRUSEL TAB (mantener igual) */}
        {activeTab === 'carousel' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Gestión del Carrusel</h2>
              <CloudinaryUpload 
                onUploadComplete={handleAddCarouselImage} 
                buttonText="Subir imagen al carrusel" 
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {carouselImages.map((img) => (
                <div key={img.id} className="relative group">
                  <img src={img.url} alt="Carrusel" className="h-40 w-full object-cover rounded-lg shadow" />
                  <button
                    onClick={() => handleDeleteCarouselImage(img.id)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            
            {carouselImages.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <Image className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No hay imágenes en el carrusel</p>
                <CloudinaryUpload onUploadComplete={handleAddCarouselImage} buttonText="Subir primera imagen" />
              </div>
            )}
          </div>
        )}

        {/* MENSAJES TAB (mantener igual) */}
        {activeTab === 'contacts' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Mensajes de Contacto</h2>
            
            <div className="space-y-4">
              {contacts.map(contact => (
                <div 
                  key={contact.id} 
                  className={`bg-white rounded-lg shadow p-5 transition ${!contact.leido ? 'border-l-4 border-yellow-500' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-4 mb-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <User size={16} />
                          <span className="font-medium">{contact.nombre}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Mail size={14} />
                          <a href={`mailto:${contact.email}`} className="hover:text-green-700">{contact.email}</a>
                        </div>
                        {contact.telefono && (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Phone size={14} />
                            <a href={`tel:${contact.telefono}`} className="hover:text-green-700">{contact.telefono}</a>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Calendar size={14} />
                          {new Date(contact.fecha).toLocaleString()}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{contact.mensaje}</p>
                    </div>
                    
                    <div className="ml-4 flex flex-col items-end gap-2">
                      {!contact.leido && (
                        <button
                          onClick={() => handleMarkAsRead(contact.id)}
                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition"
                        >
                          <CheckCircle size={14} />
                          Marcar leído
                        </button>
                      )}
                      {contact.leido && (
                        <span className="flex items-center gap-1 text-gray-400 text-sm">
                          <CheckCircle size={14} />
                          Leído
                        </span>
                      )}
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        <Eye size={14} />
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {contacts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No hay mensajes de contacto aún</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTENIDO TAB (mantener igual) */}
        {activeTab === 'sections' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Editar Contenido del Sitio</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Misión */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Misión</h3>
                {editingSection === 'mission' ? (
                  <div>
                    <textarea
                      value={sections.mission}
                      onChange={(e) => setSections({...sections, mission: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      rows="6"
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleUpdateSection('mission', sections.mission)}
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
                      onClick={() => setEditingSection('mission')}
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
                      value={sections.vision}
                      onChange={(e) => setSections({...sections, vision: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      rows="6"
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleUpdateSection('vision', sections.vision)}
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
                      onClick={() => setEditingSection('vision')}
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
        )}
      </div>

      {/* MODAL CREAR/EDITAR PRODUCTO */}
      {(creatingProduct || editingProduct) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => {
            setCreatingProduct(false);
            setEditingProduct(null);
          }} />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingProduct 
                      ? 'Modifica los campos del producto' 
                      : 'Completa los campos para agregar un nuevo producto'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCreatingProduct(false);
                    setEditingProduct(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  disabled={submitting}
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              
              {/* Form */}
              <div className="p-6 space-y-5">
                {/* Nombre */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Nombre del producto *
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => {
                      setProductForm({...productForm, name: e.target.value});
                      if (formErrors.name) setFormErrors({...formErrors, name: ''});
                    }}
                    placeholder="Ej: Limón Sutil Premium"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                      formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={submitting}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                
                {/* Descripción */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => {
                      setProductForm({...productForm, description: e.target.value});
                      if (formErrors.description) setFormErrors({...formErrors, description: ''});
                    }}
                    placeholder="Describe el producto, sus características y beneficios..."
                    rows="4"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                      formErrors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={submitting}
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                  )}
                </div>
                
                {/* Precio */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Precio *
                  </label>
                  <input
                    type="text"
                    value={productForm.price}
                    onChange={(e) => {
                      setProductForm({...productForm, price: e.target.value});
                      if (formErrors.price) setFormErrors({...formErrors, price: ''});
                    }}
                    placeholder="Ej: $5.000/kg o Consultar"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      formErrors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={submitting}
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                  )}
                </div>
                
                {/* Imagen */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Imagen del producto *
                  </label>
                  
                  {/* Preview de imagen */}
                  {productForm.image && (
                    <div className="mb-3 relative">
                      <img 
                        src={productForm.image} 
                        alt="Vista previa" 
                        className="h-32 w-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setProductForm({...productForm, image: ''})}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={productForm.image}
                      onChange={(e) => {
                        setProductForm({...productForm, image: e.target.value});
                        if (formErrors.image) setFormErrors({...formErrors, image: ''});
                      }}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        formErrors.image ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={submitting}
                    />
                    <CloudinaryUpload 
                      onUploadComplete={(url) => {
                        setProductForm({...productForm, image: url});
                        if (formErrors.image) setFormErrors({...formErrors, image: ''});
                      }}
                      buttonText="Subir"
                    />
                  </div>
                  {formErrors.image && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>
                  )}
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={handleSaveProduct}
                  disabled={submitting}
                  className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setCreatingProduct(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalles Contacto */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Detalles del Mensaje</h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={18} />
                  <span className="font-medium">{selectedContact.nombre}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} />
                  <a href={`mailto:${selectedContact.email}`} className="text-blue-600">{selectedContact.email}</a>
                </div>
                {selectedContact.telefono && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <a href={`tel:${selectedContact.telefono}`} className="text-blue-600">{selectedContact.telefono}</a>
                  </div>
                )}
                <div className="text-gray-400 text-sm">
                  {new Date(selectedContact.fecha).toLocaleString()}
                </div>
                <div className="border-t pt-3 mt-3">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedContact.mensaje}</p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                {!selectedContact.leido && (
                  <button
                    onClick={() => {
                      handleMarkAsRead(selectedContact.id);
                      setSelectedContact(null);
                    }}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg transition"
                  >
                    Marcar como leído
                  </button>
                )}
                <button
                  onClick={() => window.location.href = `mailto:${selectedContact.email}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                  Responder por email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}