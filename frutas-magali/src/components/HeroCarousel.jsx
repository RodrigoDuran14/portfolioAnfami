import { useState, useEffect } from 'react'

export default function HeroCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!images || images.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  if (!images || images.length === 0) {
    return (
      <div className="relative h-screen bg-gradient-to-r from-green-700 to-green-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Frutas Mágali</h1>
          <p className="text-xl md:text-2xl">Próximamente más imágenes</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={img}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 z-20 flex items-center justify-center text-center text-white">
        <div className="max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            ANFAMI S.R.L.
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">
            Productores y empaquetadores de frutas premium desde el corazón de Argentina
          </p>
          <a
            href="#productos"
            className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105"
          >
            Descubrir productos
          </a>
        </div>
      </div>
    </div>
  )
}