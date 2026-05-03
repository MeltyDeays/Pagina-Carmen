import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, CheckCircle } from 'lucide-react';
import { useCatalogController } from '../controllers/useCatalogController';
import { useCartController } from '../controllers/useCartController';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import CartModal from '../components/CartModal';
import { TelegramService } from '../services/TelegramService';

export default function CatalogView() {
  const { products, categories, loading, error, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useCatalogController();
  const cartController = useCartController();
  const [isAnimating, setIsAnimating] = useState(false);
  const [flyingItems, setFlyingItems] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cartIconRef = useRef(null);

  // Animación del carrito cuando cambia la cantidad de items
  useEffect(() => {
    if (cartController.cart.length === 0) return;
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 400);
    return () => clearTimeout(timer);
  }, [cartController.cart.length]);

  const handleAddToCartWithAnimation = (product, e) => {
    cartController.addToCart(product);
    
    if (!e) return;

    const id = Date.now();
    const startX = e.clientX - 15; // Centrar un poco el icono
    const startY = e.clientY - 15;
    
    const cartRect = cartIconRef.current.getBoundingClientRect();
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    // Fase 1: Iniciar el vuelo
    setFlyingItems(prev => [...prev, { id, startX, startY, endX, endY }]);

    // Fase 2: Limpiar después de que termine la animación (1.6s)
    setTimeout(() => {
      setFlyingItems(prev => prev.filter(item => item.id !== id));
    }, 1700);
  };

  const handleCheckout = async (whatsapp) => {
    const success = await TelegramService.sendOrder(cartController.cart, cartController.totalAmount, whatsapp);
    if (success) {
      setShowSuccess(true);
      cartController.setCart([]);
      cartController.setIsCartOpen(false);
      // Auto-cerrar notificación después de 5 segundos
      setTimeout(() => setShowSuccess(false), 5000);
    } else {
      alert('Hubo un error enviando tu cotización. Por favor intenta de nuevo.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Premium */}
      <header className="glass-panel" style={{ borderRadius: 0, padding: '1rem 0', position: 'sticky', top: 0, zIndex: 10, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--color-primary-dark)', textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            El Armario
          </h1>
          
          <button 
            ref={cartIconRef}
            onClick={cartController.toggleCart}
            className={isAnimating ? 'cart-bump' : ''}
            style={{ 
              position: 'relative', 
              background: 'none', 
              color: 'var(--color-text-main)', 
              transition: 'transform 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '50%',
              backgroundColor: isAnimating ? 'rgba(209, 196, 233, 0.2)' : 'transparent'
            }}
          >
            <ShoppingBag size={28} />
            {cartController.cart.length > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-6px',
                background: 'linear-gradient(135deg, #FF4B4B, #D32F2F)', color: 'white',
                borderRadius: '50%', width: '22px', height: '22px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(211, 47, 47, 0.4)'
              }}>
                {cartController.cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero / Categories / Search */}
      <main className="container" style={{ flexGrow: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Search Bar Premium */}
        <div className="animate-fade-in delay-1" style={{ position: 'relative', marginTop: '1rem' }}>
          <Search size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
          <input 
            type="text" 
            placeholder="Buscar por prenda, marca o estilo..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1.1rem 1.5rem 1.1rem 3.5rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: 'white',
              fontSize: '1rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
          />
        </div>

        {/* Categories Horizontal Scroll (Non-invasive) */}
        <div className="animate-fade-in delay-2" style={{ 
          display: 'flex', 
          gap: '0.8rem', 
          overflowX: 'auto', 
          padding: '0.5rem 0.2rem 1rem 0.2rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}>
          <button 
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '0.6rem 1.4rem',
              borderRadius: '15px',
              whiteSpace: 'nowrap',
              border: '1px solid var(--color-primary)',
              backgroundColor: !selectedCategory ? 'var(--color-primary)' : 'white',
              color: !selectedCategory ? 'white' : 'var(--color-primary)',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: !selectedCategory ? '0 5px 15px rgba(103, 58, 183, 0.2)' : 'none'
            }}
          >
            Todo
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '0.6rem 1.4rem',
                borderRadius: '15px',
                whiteSpace: 'nowrap',
                border: '1px solid rgba(103, 58, 183, 0.2)',
                backgroundColor: selectedCategory === cat.id ? 'var(--color-primary)' : 'white',
                color: selectedCategory === cat.id ? 'white' : 'var(--color-text-main)',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedCategory === cat.id ? '0 5px 15px rgba(103, 58, 183, 0.2)' : 'none'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="animate-fade-in delay-3" style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>
            Cargando tesoros...
          </div>
        ) : error ? (
           <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'red', border: '1px solid rgba(255,0,0,0.2)' }}>
             {error}
           </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', 
            gap: '1rem' 
          }}>
            {products.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCartWithAnimation} 
                onOpenDetail={(p) => setSelectedProduct(p)}
                index={index}
              />
            ))}
            {products.length === 0 && (
              <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--color-text-light)' }}>
                No hay productos en esta categoría por el momento.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Flying Items Overlay (Parábola Real) */}
      {flyingItems.map(item => (
        <div 
          key={item.id} 
          className="flying-container" 
          style={{
            left: item.startX,
            top: item.startY,
            '--dx': `${item.endX - item.startX}px`,
            '--dy': `${item.endY - item.startY}px`
          }}
        >
          <div className="flying-icon-wrapper">
            {/* Estela punteada animada */}
            <div className="dotted-trail" style={{
              '--trail-width': `${Math.sqrt(Math.pow(item.endX - item.startX, 2) + Math.pow(item.endY - item.startY, 2))}px`,
              transform: `rotate(${Math.atan2(item.endY - item.startY, item.endX - item.startX)}rad)`,
              left: '12px',
              top: '12px',
            }} />
            
            <div style={{ position: 'relative' }}>
              <ShoppingBag size={34} fill="#C08261" color="white" strokeWidth={2.5} />
              {/* Resplandor Boutique */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, boxShadow: '0 0 20px rgba(192, 130, 97, 0.4)', borderRadius: '50%' }} />
            </div>
          </div>
        </div>
      ))}

      <CartModal 
        {...cartController}
        onCheckout={handleCheckout}
      />

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={handleAddToCartWithAnimation}
        />
      )}

      {/* Notificación de Éxito Premium (Telegram / WhatsApp) */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          width: '90%',
          maxWidth: '400px',
          animation: 'fadeIn 0.5s ease'
        }}>
          <div className="glass-panel" style={{
            padding: '1.5rem',
            background: 'white',
            border: '2px solid var(--color-primary)',
            boxShadow: '0 20px 40px rgba(103, 58, 183, 0.15)',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              background: '#E8F5E9', 
              color: '#2E7D32', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <CheckCircle size={32} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-heading)' }}>¡Solicitud Enviada!</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: '1.4' }}>
              Tu selección ha volado a nuestro sistema. Nos pondremos en contacto contigo por WhatsApp muy pronto. ✨
            </p>
            <button 
              onClick={() => setShowSuccess(false)}
              style={{ 
                marginTop: '1.2rem', 
                padding: '0.5rem 1.5rem', 
                background: 'var(--color-primary)', 
                color: 'white',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

