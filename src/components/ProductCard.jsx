import { ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onOpenDetail, index = 0 }) {
  const image = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://placehold.co/300x400/D1C4E9/4A4A4A?text=Sin+Imagen';

  const delayClass = `delay-${(index % 12) + 1}`;

  return (
    <div className={`glass-panel animate-fade-in ${delayClass}`} style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative', 
      overflow: 'hidden',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      opacity: product.sold_at ? 0.9 : 1,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    }}
    onClick={() => onOpenDetail(product)}
    >
      <div className="img-zoom-wrapper" style={{ position: 'relative', height: '190px' }}>
        <img 
          src={image} 
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        {/* Badge de Talla Premium */}
        {product.size && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            color: 'var(--color-text-heading)',
            padding: '2px 8px',
            borderRadius: '8px',
            fontSize: '0.7rem',
            fontWeight: '800',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            zIndex: 1,
            border: '1px solid rgba(103, 58, 183, 0.1)'
          }}>
            Talla: {product.size}
          </div>
        )}

        {product.sold_at && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <span className="sold-badge" style={{ fontSize: '0.8rem' }}>VENDIDO</span>
          </div>
        )}
      </div>

      <div style={{ padding: '0.8rem', display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.1rem', fontWeight: '700', color: 'var(--color-text-heading)' }}>{product.name}</h3>
        
        <p style={{ color: 'var(--color-primary-dark)', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>
          {product.brand || 'Colección Carmen'}
        </p>

        {product.description && (
          <p style={{ 
            color: 'var(--color-text-light)', 
            fontSize: '0.75rem', 
            marginBottom: '0.8rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.3'
          }}>
            {product.description}
          </p>
        )}

        <div style={{ color: 'var(--color-text-light)', fontSize: '0.7rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
          <span style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>{product.condition || 'Excelente'}</span>
        </div>
        
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--color-text-heading)' }}>
            C${parseFloat(product.price).toLocaleString()}
          </span>
          {!product.sold_at && (
            <button 
              className="btn-primary" 
              style={{ 
                width: '38px', 
                height: '38px', 
                padding: 0, 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'var(--gradient-btn)',
                border: 'none',
                boxShadow: 'var(--shadow-glow)'
              }}
              onClick={(e) => {
                e.stopPropagation(); // Evita abrir el modal al clickear el botón
                onAddToCart(product, e);
              }}
              title="Añadir al carrito"
            >
              <ShoppingBag size={18} color="white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

