import { ShoppingBag, Search } from 'lucide-react';
import { useCatalogController } from '../controllers/useCatalogController';
import { useCartController } from '../controllers/useCartController';
import ProductCard from '../components/ProductCard';
import CartModal from '../components/CartModal';
import { TelegramService } from '../services/TelegramService';

export default function CatalogView() {
  const { products, categories, loading, error, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useCatalogController();
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

