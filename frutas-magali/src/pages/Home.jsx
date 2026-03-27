import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { getProducts, getCarouselImages, getSectionContent } from '../services/ContentService';
import { 
  Leaf, 
  Globe, 
  Users, 
  Award, 
  Truck, 
  CheckCircle, 
  TrendingUp,
  Apple,
  Citrus,
  Droplet
} from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);
  const [sections, setSections] = useState({
    mission: '',
    vision: '',
    heroTitle: 'Frutas Mágali',
    heroSubtitle: 'Productores y empaquetadores de frutas premium desde el corazón de Argentina'
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { number: '40+', label: 'Años de experiencia', icon: Leaf },
    { number: '100K+', label: 'Toneladas anuales', icon: Truck },
    { number: '25+', label: 'Países de destino', icon: Globe },
    { number: '350+', label: 'Clientes globales', icon: Users }
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, carouselData, missionData, visionData] = await Promise.all([
        getProducts(),
        getCarouselImages(),
        getSectionContent('mission'),
        getSectionContent('vision')
      ]);
      
      setProducts(productsData);
      setCarouselImages(carouselData.map(img => img.url));
      setSections({
        mission: missionData?.content || 'Somos una empresa agroexportadora, dedicada al cultivo, industrialización y exportación de frutas premium. Transmitimos nuestra cultura de trabajo y experiencia de más de 40 años, comprometidos con la satisfacción de nuestros clientes y el bienestar de nuestros colaboradores.',
        vision: visionData?.content || 'Ser empresa referente a nivel internacional en el mundo de las frutas frescas, ofreciendo productos innovadores que superen las expectativas de nuestros clientes, con un modo de producción responsable y sostenible.',
        heroTitle: 'Frutas Mágali',
        heroSubtitle: 'Productores y empaquetadores de frutas premium desde el corazón de Argentina'
      });
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando Frutas Mágali...</p>
          <p className="text-gray-400 text-sm mt-2">La frescura está por llegar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      
      {/* Hero Carousel */}
      <HeroCarousel images={carouselImages} />
      
      {/* Sección de Estadísticas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition">
                    <Icon className="h-8 w-8 text-green-700" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{stat.number}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Sección de Productos */}
      <section id="productos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Nuestros Productos Premium
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cultivamos y seleccionamos las mejores frutas para llevar lo mejor de Argentina al mundo
            </p>
            <div className="w-24 h-1 bg-green-700 mx-auto mt-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {products.length === 0 && (
            <div className="text-center py-12">
              <Apple className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Próximamente nuevos productos</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Sección de Calidad y Sustentabilidad */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Calidad y Sustentabilidad
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                En Frutas Mágali, la calidad y la sustentabilidad van de la mano. Nuestra política 
                de calidad se basa en cuatro pilares fundamentales que nos permiten ofrecer productos 
                de excelencia mientras protegemos el medio ambiente.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Award, text: 'Sostenibilidad' },
                  { icon: TrendingUp, text: 'Innovación' },
                  { icon: Globe, text: 'Tecnología' },
                  { icon: Users, text: 'Compromiso' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-green-700" />
                      </div>
                      <span className="text-gray-700 font-medium">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://imgs.search.brave.com/bPU46PJ9einLgYu_WCVRpDlcv8qO_A_dLhChdwW7_AA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Y2xhcmluLmNvbS9p/bWcvMjAxOC8wMi8y/OC9yeWQxSkhQdWZf/MTI1Nng2MjBfXzEu/anBn"
                alt="Campo de cítricos"
                className="rounded-2xl shadow-xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-green-700 text-white p-4 rounded-xl shadow-lg">
                <Citrus className="h-8 w-8 mb-2" />
                <p className="font-bold">100% Orgánico</p>
                <p className="text-sm">Disponible</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Sección de Certificaciones */}
      <section id="certificaciones" className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Certificaciones Internacionales
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Nuestro compromiso con la calidad está respaldado por las certificaciones más exigentes del mercado
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'Global G.A.P.', icon: CheckCircle, color: 'bg-green-600' },
              { name: 'GRASP', icon: CheckCircle, color: 'bg-blue-600' },
              { name: 'SMETA', icon: CheckCircle, color: 'bg-purple-600' },
              { name: 'Orgánico Argentina', icon: Leaf, color: 'bg-green-700' },
              { name: 'Fair Trade', icon: Award, color: 'bg-yellow-600' }
            ].map((cert, idx) => {
              const Icon = cert.icon;
              return (
                <div key={idx} className="bg-white px-6 py-4 rounded-full shadow-md flex items-center gap-2 hover:shadow-lg transition">
                  <Icon className={`h-5 w-5 text-${cert.color}`} />
                  <span className="text-gray-700 font-medium">{cert.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Sección Misión y Visión */}
      <section id="nosotros" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-700 p-2 rounded-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Misión</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {sections.mission}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-700 p-2 rounded-lg">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Visión</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {sections.vision}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Sección de Exportación */}
      <section className="py-20 bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Desde Tucumán al Mundo
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Exportamos nuestras frutas premium a los mercados más exigentes del mundo, 
            manteniendo la frescura y calidad en cada envío.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {['Unión Europea', 'Estados Unidos', 'Rusia', 'Croacia', 'Brasil', 'Canadá'].map(country => (
              <div key={country} className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full">
                {country}
              </div>
            ))}
          </div>
          <div className="mt-12">
            <a 
              href="/contacto" 
              className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition"
            >
              <Truck size={20} />
              Solicitar cotización
            </a>
          </div>
        </div>
      </section>
      
      {/* Sección de Ventajas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            ¿Por qué elegir Frutas Mágali?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: 'Productores Directos',
                description: 'Control total desde el campo hasta tu mesa, garantizando la más alta calidad.'
              },
              {
                icon: Truck,
                title: 'Logística Especializada',
                description: 'Cadena de frío controlada y trazabilidad completa en toda la cadena.'
              },
              {
                icon: Award,
                title: 'Certificaciones Premium',
                description: 'Respaldo internacional que garantiza nuestros estándares de calidad.'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="text-center group">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 group-hover:bg-green-200 transition">
                    <Icon className="h-10 w-10 text-green-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-700 to-green-800">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Necesitas frutas frescas premium para tu negocio?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Contáctanos y descubre por qué somos el proveedor líder en frutas premium de Argentina.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/contacto"
              className="bg-white text-green-700 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition inline-flex items-center gap-2"
            >
              Contactar ahora
            </a>
            <a 
              href="#productos"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition"
            >
              Ver productos
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}