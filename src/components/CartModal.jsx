import { X, Trash2, Send, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export default function CartModal({ cart, isCartOpen, toggleCart, removeFromCart, totalAmount, onCheckout }) {
  if (!isCartOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1000,
      display: 'flex', justifyContent: 'flex-end',

      animation: 'fadeIn 0.3s ease'
    }}>
      <div className="glass-panel" style={{
        width: '100%', maxWidth: '420px', height: '100%',
        borderRadius: '24px 0 0 24px',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
        borderRight: 'none',
        transform: 'translateX(0)',
        animation: 'fadeIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: 'var(--color-text-heading)' }}>Tu Selección</h2>
          <button onClick={toggleCart} style={{ background: 'none', color: 'var(--color-text-main)', transition: 'transform 0.2s ease' }} onMouseOver={e=>e.currentTarget.style.transform='rotate(90deg)'} onMouseOut={e=>e.currentTarget.style.transform='rotate(0deg)'}>
            <X size={24} />
          </button>
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--color-text-light)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>Tu carrito está vacío.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>¡Agrega algunos tesoros!</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={item.id} className={`animate-fade-in delay-${(index % 6) + 1}`} style={{ display: 'flex', marginBottom: '1.2rem', alignItems: 'center', gap: '1rem', padding: '0.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.8)' }}>
                <img src={item.images?.[0] || 'https://placehold.co/100x100'} alt={item.name} style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ margin: '0 0 0.1rem 0', fontSize: '1rem', color: 'var(--color-text-heading)' }}>{item.name}</h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '0.3rem' }}>
                    {item.brand && <span>{item.brand} • </span>}
                    {item.size && <span style={{ fontWeight: '600' }}>Talla: {item.size}</span>}
                  </div>
                  <span style={{ color: 'var(--color-primary-dark)', fontWeight: 'bold' }}>C${item.price}</span>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  style={{ background: '#FEE2E2', color: '#EF4444', borderRadius: '10px', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#FCA5A5'}
                  onMouseOut={e => e.currentTarget.style.background = '#FEE2E2'}
                >
                  <Trash2 size={18}/>
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.95)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--color-text-heading)' }}>
              <span>Total:</span>
              <span>C${totalAmount.toFixed(2)}</span>
            </div>
            
            <div style={{ marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', marginBottom: '1rem', lineHeight: '1.5', background: 'rgba(209, 196, 233, 0.2)', padding: '0.8rem', borderRadius: '8px' }}>
                📍 <strong>Santo Tomás, Chontales.</strong><br/>
                🚚 Envíos por cargotrans y buses locales.<br/>
                💵 Transferencias o pago en efectivo.
              </p>
              <button 
                className="btn-primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}
                onClick={() => onCheckout()}
              >
                <Send size={18} /> Solicitar Cotización por WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

