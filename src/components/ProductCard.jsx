import { ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, index = 0 }) {
  const image = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://placehold.co/300x400/D1C4E9/4A4A4A?text=Sin+Imagen';

  const delayClass = `delay-${(index % 12) + 1}`;

  return (
    <div className={`glass-panel animate-fade-in product-card-hover ${delayClass}`} style={{ display: 'flex', flexDirection: 'column', position: 'relative', opacity: product.sold_at ? 0.85 : 1 }}>
      <div className="img-zoom-wrapper" style={{ position: 'relative' }}>
        <img 
          src={image} 
          alt={product.name} 
          style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
        />
        {product.sold_at && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="sold-badge">VENDIDO</span>
          </div>
        )}
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{product.name}</h3>
        <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          {product.brand && <span>{product.brand} • </span>}
          {product.condition || 'Usado'}
        </p>
        
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--color-text-heading)' }}>
            C${parseFloat(product.price).toFixed(2)}
          </span>
          {!product.sold_at && (
            <button 
              className="btn-primary" 
              style={{ width: '45px', height: '45px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => onAddToCart(product)}
              title="Añadir al carrito"
            >
              <ShoppingBag size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

