import { useState } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { addContact } from '../services/ContentService';
import { 
  Send, 
  Loader2,
  User,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  CheckCircle
} from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    setFocused({ ...focused, [field]: false });
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      toast.error('Por favor ingresa tu nombre');
      return false;
    }
    
    if (!formData.email.trim()) {
      toast.error('Por favor ingresa tu email');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Por favor ingresa un email válido');
      return false;
    }
    
    if (!formData.mensaje.trim()) {
      toast.error('Por favor escribe tu mensaje');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    const sendingToast = toast.loading('Enviando mensaje...');

    try {
      // 1. Guardar en Firebase
      const contactData = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        mensaje: formData.mensaje.trim()
      };
      
      await addContact(contactData);

      // 2. Enviar email con EmailJS
      const emailParams = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono || 'No especificado',
        mensaje: formData.mensaje,
        to_email: import.meta.env.VITE_EMAILJS_RECEIVER_EMAIL,
        reply_to: formData.email
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast.dismiss(sendingToast);
      toast.success('¡Mensaje enviado con éxito! Te contactaremos en las próximas 24 horas.', {
        duration: 5000,
        icon: '🎉',
      });
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
      });

      // Limpiar estados de focus
      setFocused({});

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      toast.dismiss(sendingToast);
      toast.error('Error al enviar el mensaje. Por favor intenta de nuevo o contáctanos por teléfono.', {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (fieldName) => {
    const baseClasses = "w-full px-4 py-3 border rounded-lg transition-all duration-200 outline-none";
    const focusClasses = "focus:ring-2 focus:ring-green-500 focus:border-transparent";
    const errorClasses = "border-gray-300";
    const floatingClasses = focused[fieldName] || formData[fieldName] 
      ? "border-green-500 shadow-sm" 
      : "";
    
    return `${baseClasses} ${focusClasses} ${errorClasses} ${floatingClasses}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header decorativo */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="h-8 w-8" />
          <h3 className="text-2xl font-bold">Envíanos un mensaje</h3>
        </div>
        <p className="text-green-100">
          Completa el formulario y te responderemos a la brevedad
        </p>
      </div>
      
      {/* Formulario */}
      <div className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Nombre */}
          <div className="relative">
            <label htmlFor="nombre" className="block text-gray-700 font-medium mb-2">
              Nombre completo *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                onFocus={() => handleFocus('nombre')}
                onBlur={() => handleBlur('nombre')}
                disabled={loading}
                className={`${inputClasses('nombre')} pl-10`}
                placeholder="Juan Pérez"
              />
            </div>
          </div>

          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                disabled={loading}
                className={`${inputClasses('email')} pl-10`}
                placeholder="juan@ejemplo.com"
              />
            </div>
          </div>

          {/* Campo Teléfono */}
          <div>
            <label htmlFor="telefono" className="block text-gray-700 font-medium mb-2">
              Teléfono
              <span className="text-gray-400 text-sm ml-1">(opcional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                onFocus={() => handleFocus('telefono')}
                onBlur={() => handleBlur('telefono')}
                disabled={loading}
                className={`${inputClasses('telefono')} pl-10`}
                placeholder="+54 9 381 123-4567"
              />
            </div>
          </div>

          {/* Campo Mensaje */}
          <div>
            <label htmlFor="mensaje" className="block text-gray-700 font-medium mb-2">
              Mensaje *
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-4 text-gray-400 h-5 w-5" />
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                onFocus={() => handleFocus('mensaje')}
                onBlur={() => handleBlur('mensaje')}
                disabled={loading}
                rows="5"
                className={`${inputClasses('mensaje')} pl-10 resize-none`}
                placeholder="¿En qué podemos ayudarte? Cuéntanos sobre tu proyecto o consulta..."
              />
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Te responderemos en menos de 24 horas
            </p>
            <p className="flex items-center gap-2 mt-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Tus datos están seguros con nosotros
            </p>
          </div>

          {/* Botón enviar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Enviando mensaje...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Enviar Mensaje
              </>
            )}
          </button>

          {/* Campos requeridos nota */}
          <p className="text-center text-xs text-gray-400 mt-4">
            * Campos obligatorios
          </p>
        </form>
      </div>
    </div>
  );
}