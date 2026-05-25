import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Leaf, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  const handleContactClick = (e) => {
    // Si estamos en home, vamos a contacto desde arriba
    if (location.pathname === '/') {
      navigate('/contacto');
    }
    // Si ya estamos en contacto, no hacemos nada
  };

  const navLinks = [
    { name: 'Productos', sectionId: 'productos' },
    { name: 'Nosotros', sectionId: 'nosotros' },
    { name: 'Certificaciones', sectionId: 'certificaciones' },
    { name: 'Contacto', isContact: true }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 group">
            <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-700 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg md:text-xl text-gray-800">Frutas Mágali</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              link.isContact ? (
                <Link
                  key={link.name}
                  to="/contacto"
                  onClick={handleContactClick}
                  className="text-gray-600 hover:text-green-700 transition font-medium"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={`/#${link.sectionId}`}
                  onClick={(e) => handleNavClick(e, link.sectionId)}
                  className="text-gray-600 hover:text-green-700 transition cursor-pointer font-medium"
                >
                  {link.name}
                </a>
              )
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                link.isContact ? (
                  <Link
                    key={link.name}
                    to="/contacto"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-600 hover:text-green-700 transition px-2 py-1"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={`/#${link.sectionId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      if (location.pathname !== '/') {
                        navigate('/');
                        setTimeout(() => scrollToSection(link.sectionId), 100);
                      } else {
                        scrollToSection(link.sectionId);
                      }
                    }}
                    className="text-gray-600 hover:text-green-700 transition px-2 py-1 cursor-pointer"
                  >
                    {link.name}
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}