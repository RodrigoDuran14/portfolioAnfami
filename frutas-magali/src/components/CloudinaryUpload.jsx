import { useState, useEffect } from 'react';

export const CloudinaryUpload = ({ onUploadComplete, buttonText = "Subir imagen" }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Cargar el script del widget de Cloudinary
    if (!loaded && !window.cloudinary) {
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      script.onload = () => setLoaded(true);
      document.body.appendChild(script);
    } else if (window.cloudinary) {
      setLoaded(true);
    }
  }, [loaded]);

  const openWidget = () => {
    if (!loaded || !window.cloudinary) {
      alert("Cargando widget, por favor intenta nuevamente");
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        sources: ["local", "camera", "url"],
        multiple: false,
        cropping: true,
        showSkipCropButton: false,
        croppingAspectRatio: 16 / 9,
        maxImageFileSize: 5000000, // 5MB
        styles: {
          palette: {
            window: "#FFFFFF",
            sourceBg: "#F5F5F5",
            windowBorder: "#CCCCCC",
            tabIcon: "#4CAF50",
            inactiveTabIcon: "#CCCCCC",
            menuIcons: "#4CAF50",
            link: "#4CAF50",
            action: "#FF6200",
            inProgress: "#4CAF50",
            complete: "#4CAF50",
            error: "#F44336"
          }
        }
      },
      (error, result) => {
        if (error) {
          console.error("Error en upload widget:", error);
          alert("Error al subir la imagen");
          return;
        }
        
        if (result && result.event === "success") {
          console.log("Imagen subida exitosamente:", result.info.secure_url);
          onUploadComplete(result.info.secure_url);
        }
      }
    );
    
    widget.open();
  };

  return (
    <button
      onClick={openWidget}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      type="button"
    >
      {buttonText}
    </button>
  );
};