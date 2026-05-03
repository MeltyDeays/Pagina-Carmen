import { ShoppingBag } from 'lucide-react';
import { useCatalogController } from '../controllers/useCatalogController';
import { useCartController } from '../controllers/useCartController';
import ProductCard from '../components/ProductCard';
import CartModal from '../components/CartModal';
import { TelegramService } from '../services/TelegramService';

export default function CatalogView() {
  const { products, categories, loading, error, selectedCategory, setSelectedCategory } = useCatalogController();
  const cartController = useCartController();

  const handleCheckout = async (whatsapp) => {
    const success = await TelegramService.sendOrder(cartController.cart, cartController.totalAmount, whatsapp);
    if (success) {
      alert('¡Pedido enviado exitosamente! Nos contactaremos contigo por WhatsApp pronto.');
      cartController.setCart([]);
      cartController.setIsCartOpen(false);
    } else {
      alert('Hubo un error enviando tu pedido. Por favor intenta de nuevo.');
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
            onClick={cartController.toggleCart}
            style={{ position: 'relative', background: 'none', color: 'var(--color-text-main)', transition: 'transform 0.2s ease' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
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

      {/* Hero / Categories */}
      <main className="container" style={{ flexGrow: 1, padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }} className="animate-fade-in delay-1">
          <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--color-text-heading)', textShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            Descubre tu estilo
          </h2>
          <p style={{ color: 'var(--color-text-main)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', opacity: 0.8 }}>
            Ropa de segunda mano seleccionada con amor. Encuentra piezas únicas a precios increíbles.
          </p>
        </div>

        {/* Categories Filter (Pills) */}
        <div className="animate-fade-in delay-2" style={{ display: 'flex', gap: '0.75rem', paddingBottom: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className={`btn-outline ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            Todo
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              className={`btn-outline ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
            gap: '2.5rem' 
          }}>
            {products.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={cartController.addToCart} 
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

      <CartModal 
        {...cartController}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

