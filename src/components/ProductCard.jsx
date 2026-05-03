import { ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, index = 0 }) {
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
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }}>
      <div className="img-zoom-wrapper" style={{ position: 'relative', height: '180px' }}>
        <img 
          src={image} 
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {product.sold_at && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{
              background: 'white',
              color: 'var(--color-primary-dark)',
              padding: '0.4rem 0.8rem',
              borderRadius: '30px',
              fontWeight: '800',
              fontSize: '0.65rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>VENDIDO</span>
          </div>
        )}
      </div>
      <div style={{ padding: '0.8rem', display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
        <h3 style={{ fontSize: '0.9rem', marginBottom: '0.2rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
        <p style={{ color: 'var(--color-text-light)', fontSize: '0.75rem', marginBottom: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.brand && <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>{product.brand} • </span>}
          {product.condition || 'Usado'}
        </p>
        
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
            C${parseFloat(product.price).toLocaleString()}
          </span>
          {!product.sold_at && (
            <button 
              className="btn-primary" 
              style={{ 
                width: '34px', 
                height: '34px', 
                padding: 0, 
                borderRadius: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #E2C799, #C08261)', 
                border: 'none'
              }}
              onClick={() => onAddToCart(product)}
              title="Añadir al carrito"
            >
              <ShoppingBag size={15} color="white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

