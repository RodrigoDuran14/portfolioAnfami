import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function Contacto() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [sectionContent] = useState({
    titulo: 'Contáctanos',
    subtitulo: 'Estamos aquí para ayudarte'
  });

  return (
    <div className="relative">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-700 to-green-600 pt-32 pb-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{sectionContent.titulo}</h1>
          <p className="text-xl md:text-2xl">{sectionContent.subtitulo}</p>
        </div>
      </div>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Información de contacto */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Información de Contacto</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Phone className="text-green-700 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800">Teléfono</h3>
                    <p className="text-gray-600">+54 9 381 123-4567</p>
                    <p className="text-gray-600">+54 9 381 765-4321</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail className="text-green-700 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">info@frutasmagali.com</p>
                    <p className="text-gray-600">ventas@frutasmagali.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <MapPin className="text-green-700 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800">Dirección</h3>
                    <p className="text-gray-600">ANFAMI SRL</p>
                    <p className="text-gray-600">Tafí Viejo, Tucumán, Argentina</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Clock className="text-green-700 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800">Horario de Atención</h3>
                    <p className="text-gray-600">Lunes a Viernes: 7:00 - 19:00</p>
                    <p className="text-gray-600">Sábados: 8:00 - 13:00</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Síguenos</h3>
                <div className="flex gap-3">
                  <a href="#" className="bg-green-100 p-2 rounded-full hover:bg-green-200 transition">
                    <MessageCircle className="text-green-700" size={20} />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Formulario de contacto */}
            <ContactForm />
          </div>
        </div>
      </section>
      
      {/* Mapa */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Ubicación</h2>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              title="Ubicación ANFAMI SRL"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3575.809780260066!2d-65.2646065!3d-26.7319405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x942267795b295df1%3A0x887f4cae946cd5ab!2sANFAMI%20SRL!5e0!3m2!1ses!2sar!4v1712000000000!5m2!1ses!2sar"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}