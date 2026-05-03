import { useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingBag, ZoomIn } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const sliderRef = useRef(null);

  if (!product) return null;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://placehold.co/600x800/D1C4E9/4A4A4A?text=Sin+Imagen'];

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleMouseMove = (e) => {
    if (!isZooming) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} style={{ animationDuration: '0.3s' }}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ animationDelay: '0.1s' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Slider Section */}
        <div className="slider-container">
          <div 
            className="slider-track" 
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className="slider-slide inspect-trigger"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
              >
                <img src={img} alt={`${product.name} - ${idx + 1}`} />
                <div 
                  className="zoom-overlay" 
                  style={{ 
                    backgroundImage: `url(${img})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    opacity: isZooming ? 1 : 0
                  }} 
                />
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <>
              <button className="slider-arrow slider-arrow-prev" onClick={prevImage}>
                <ChevronLeft size={24} />
              </button>
              <button className="slider-arrow slider-arrow-next" onClick={nextImage}>
                <ChevronRight size={24} />
              </button>
              <div className="slider-dots">
                {images.map((_, idx) => (
                  <button 
                    key={idx} 
                    className={`slider-dot ${currentImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Ayuda visual para inspección */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.45)', color: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', pointerEvents: 'none' }}>
            <ZoomIn size={12} /> Desliza para inspeccionar
          </div>
        </div>

        {/* Content Section */}
        <div className="modal-body">
          <div className="modal-brand">{product.brand || 'Colección Carmen'}</div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{product.name}</h2>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="modal-price">C${parseFloat(product.price).toLocaleString()}</span>
            {product.size && (
              <span style={{ background: 'var(--color-primary)', padding: '2px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700' }}>
                Talla: {product.size}
              </span>
            )}
          </div>

          <div className="modal-condition-tag">Condición: {product.condition || 'Excelente'}</div>

          {product.description && (
            <p style={{ color: 'var(--color-text-main)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              {product.description}
            </p>
          )}

          {!product.sold_at ? (
            <button 
              className="btn-primary" 
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '1rem' }}
              onClick={(e) => {
                onAddToCart(product, e);
                onClose();
              }}
            >
              <ShoppingBag size={20} /> Añadir al Carrito
            </button>
          ) : (
            <div className="sold-badge" style={{ width: 'fit-content', margin: '0 auto', transform: 'none', position: 'static' }}>
              PRENDA VENDIDA
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
