import { useState, useRef } from 'react';
import { Package, Tag, LogOut, Plus, Search, DollarSign, LayoutDashboard, ShoppingBag, Eye, Trash2, CheckCircle, X } from 'lucide-react';
import { useAdminController } from '../controllers/useAdminController';

export default function AdminView() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phone, setPhone] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // Restaurado
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fabPos, setFabPos] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const admin = useAdminController();

  // Métrica avanzadas
  const pendingProducts = admin.products.filter(p => !p.is_published && !p.sold_at);
  const inCatalogProducts = admin.products.filter(p => p.is_published && !p.sold_at);
  const soldProducts = admin.products.filter(p => p.sold_at);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(now);
  // Ajuste para que la semana empiece el Lunes (si es Domingo (0), restamos 6 días)
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const totalEarnings = soldProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  const earningsMonth = soldProducts
    .filter(p => new Date(p.sold_at) >= startOfMonth)
    .reduce((sum, p) => sum + (p.price || 0), 0);
  const earningsWeek = soldProducts
    .filter(p => new Date(p.sold_at) >= startOfWeek)
    .reduce((sum, p) => sum + (p.price || 0), 0);

  const handlePointerDown = (e) => {
    setIsDragging(false);
    dragStart.current = {
      x: e.clientX - fabPos.x,
      y: e.clientY - fabPos.y
    };
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (e.buttons !== 1) return;
    
    // Límites de la pantalla para que no se pierda
    const padding = 10;
    const newX = Math.max(padding, Math.min(window.innerWidth - 60, e.clientX - dragStart.current.x));
    const newY = Math.max(padding, Math.min(window.innerHeight - 60, e.clientY - dragStart.current.y));
    
    if (Math.abs(newX - fabPos.x) > 5 || Math.abs(newY - fabPos.y) > 5) {
      setIsDragging(true);
      setFabPos({ x: newX, y: newY });
    }
  };

  const toggleMenu = (e) => {
    if (!isDragging) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const authorizedNumbers = ['84012444', '85427414', '58438412'];
    if (authorizedNumbers.includes(phone)) { 
      setIsAuthenticated(true);
    } else {
      alert('Acceso Denegado: Número no registrado en el sistema.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--color-background)', padding: '1rem' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '3.5rem 2.5rem', width: '100%', maxWidth: '450px', textAlign: 'center' }}>
          <div style={{ background: 'var(--color-primary)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
             <LayoutDashboard size={40} color="var(--color-text-heading)" />
          </div>
          <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>El Armario</h2>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '2.5rem' }}>Panel de Control Exclusivo</p>
          
          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Teléfono de Acceso</label>
            <input
              type="tel"
              className="input-field"
              placeholder="Ej: 88888888"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ marginBottom: '2rem' }}
              required
            />
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.2rem' }}>
              Entrar al Sistema
            </button>
          </form>
          <a href="/" style={{ display: 'inline-block', marginTop: '2rem', color: 'var(--color-primary-dark)', fontWeight: '600', textDecoration: 'underline' }}>
            Volver a la tienda pública
          </a>
        </div>
      </div>
    );
  }

  const soldCount = admin.products.filter(p => p.sold_at).length;
  const availableCount = admin.products.length - soldCount;

  return (
    <div className="admin-layout" style={{ backgroundColor: '#F0F2F5' }}>
      {/* Sidebar - Ahora solo visible en Escritorio */}
      <aside className="admin-sidebar glass-panel hide-mobile" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
        <div style={{ padding: '0.5rem 0 2.5rem' }}>
          <h2 style={{ color: 'var(--color-primary-dark)', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={24} /> El Armario
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>ADMINISTRACIÓN</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
          <button className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className={`sidebar-link ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <Package size={20} /> Inventario
          </button>
          <button className={`sidebar-link ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
            <Tag size={20} /> Categorías
          </button>
          <button className={`sidebar-link ${activeTab === 'sold' ? 'active' : ''}`} onClick={() => setActiveTab('sold')}>
            <CheckCircle size={20} /> Historial Ventas
          </button>
        </nav>
      </aside>

      {/* Menú Flotante Móvil (FAB) - SOLO EN DASHBOARD */}
      <div className="show-mobile-only">
        {isMenuOpen && (
          <div 
            onClick={() => setIsMenuOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', zIndex: 1001 }} 
          />
        )}
        
        <>
          <div style={{ 
            position: 'fixed', 
            left: fabPos.x + 25, 
            top: fabPos.y, 
            display: 'flex', 
            flexDirection: 'column-reverse', 
            gap: '0.75rem', 
            zIndex: 1002,
            transition: 'all 0.3s ease',
            transform: isMenuOpen ? 'translate(-100%, -100%) translateY(-15px)' : 'translate(-100%, 0)',
            opacity: isMenuOpen ? 1 : 0,
            pointerEvents: isMenuOpen ? 'all' : 'none'
          }}>
            {[
              { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
              { id: 'products', label: 'Inventario', icon: Package },
              { id: 'categories', label: 'Categorías', icon: Tag },
              { id: 'sold', label: 'Ventas', icon: CheckCircle }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMenuOpen(false); }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  padding: '0.6rem 1rem', 
                  borderRadius: 'var(--radius-pill)', 
                  background: activeTab === item.id ? 'var(--color-primary)' : 'white',
                  color: 'var(--color-text-heading)',
                  border: 'none',
                  boxShadow: 'var(--shadow-md)',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  fontSize: '0.85rem'
                }}
              >
                <item.icon size={16} /> {item.label}
              </button>
            ))}
          </div>

          <button 
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onClick={toggleMenu}
            style={{ 
              position: 'fixed', 
              left: `${fabPos.x}px`,
              top: `${fabPos.y}px`,
              width: '50px', 
              height: '50px', 
              borderRadius: '50%', 
              background: 'var(--color-primary-dark)', 
              color: 'white', 
              border: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 8px 24px rgba(103, 58, 183, 0.3)', 
              zIndex: 1003,
              touchAction: 'none',
              cursor: isDragging ? 'grabbing' : 'grab',
              transition: isDragging ? 'none' : 'transform 0.3s ease, left 0.3s ease, top 0.3s ease'
            }}
          >
            {isMenuOpen ? <Plus size={24} style={{ transform: 'rotate(45deg)' }} /> : <LayoutDashboard size={24} />}
          </button>
        </>
      </div>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header Superior Premium */}
        <div className="glass-panel" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.5rem',
          padding: '1rem 1.25rem',
          border: 'none',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(209, 196, 233, 0.1))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div 
              onClick={() => setActiveTab('dashboard')}
              style={{ 
                background: 'var(--color-primary)', 
                width: '40px', 
                height: '40px', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
               <LayoutDashboard size={20} color="var(--color-text-heading)" />
            </div>
            <div 
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if(activeTab === 'products') {
                  admin.setEditingId(null);
                  admin.setProductForm({ name: '', description: '', price: '', brand: '', category_id: '', materials: '', condition: '', size: '', images: [], is_published: false });
                  if (!admin.showProductForm) setActiveTab('dashboard');
                } else if(activeTab === 'categories') {
                  admin.setEditingCatId(null);
                  admin.setCategoryForm({ name: '', description: '' });
                  if (!admin.showCategoryForm) setActiveTab('dashboard');
                } else {
                  setActiveTab('dashboard');
                }
              }}
            >
              <h1 style={{ 
                margin: 0, 
                fontSize: '1.4rem', 
                color: 'var(--color-text-heading)',
                fontFamily: 'var(--font-heading)',
                lineHeight: 1.2
              }}>
                {activeTab === 'dashboard' && "Panel Maestro"}
                {activeTab === 'products' && "Inventario"}
                {activeTab === 'categories' && "Colecciones"}
                {activeTab === 'sold' && "Historial de Ventas"}
              </h1>
              <p style={{ color: 'var(--color-text-light)', fontSize: '0.75rem', fontWeight: '500', margin: 0 }}>
                Carmen Boutique
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsAuthenticated(false)}
            className="btn-outline"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              padding: '0.5rem 0.8rem', 
              color: '#C62828', 
              borderColor: 'rgba(198, 40, 40, 0.15)',
              background: 'white',
              fontSize: '0.8rem',
              fontWeight: '600',
              borderRadius: '10px'
            }}
          >
            <LogOut size={16} /> <span className="hide-mobile">Salir</span>
          </button>
        </div>

        {/* Dashboard View - BENTO GRID */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Seccion 1: Resumen de Stock Maestras */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
              <div className="glass-panel" style={{ padding: '1rem', borderLeft: '4px solid #FFA000' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-light)', fontSize: '0.7rem', marginBottom: '0.4rem' }}>
                  <Package size={14} /> POR PUBLICAR
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#FFA000' }}>{pendingProducts.length}</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>En borradores</div>
              </div>
              <div className="glass-panel" style={{ padding: '1rem', borderLeft: '4px solid #2E7D32' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-light)', fontSize: '0.7rem', marginBottom: '0.4rem' }}>
                  <ShoppingBag size={14} /> EN CATÁLOGO
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#2E7D32' }}>{inCatalogProducts.length}</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Visibles en tienda</div>
              </div>
              <div className="glass-panel" style={{ padding: '1rem', borderLeft: '4px solid #C62828' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-light)', fontSize: '0.7rem', marginBottom: '0.4rem' }}>
                  <CheckCircle size={14} /> VENDIDAS
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#C62828' }}>{soldProducts.length}</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Ventas totales</div>
              </div>
              <div className="glass-panel" style={{ padding: '1rem', borderLeft: '4px solid var(--color-primary-dark)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-light)', fontSize: '0.7rem', marginBottom: '0.4rem' }}>
                  <LayoutDashboard size={14} /> HISTÓRICO
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800' }}>{admin.products.length}</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Total piezas</div>
              </div>
            </div>

            {/* Seccion 2: Finanzas Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #FFF, #F3E5F5)', position: 'relative', overflow: 'hidden' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
                    <span style={{ fontWeight: '700', color: 'var(--color-primary-dark)', fontSize: '0.9rem' }}>GANANCIAS TOTALES</span>
                    <div style={{ padding: '0.5rem', background: 'var(--color-primary)', borderRadius: '10px' }}><DollarSign size={20} color="white"/></div>
                 </div>
                 <div style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>C$ {totalEarnings.toLocaleString()}</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#2E7D32', position: 'relative', zIndex: 1 }}>
                    <CheckCircle size={14} /> {soldProducts.length} Ventas concretadas
                 </div>
                 <DollarSign size={100} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.05, transform: 'rotate(-15deg)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', fontWeight: '600' }}>ESTE MES</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>C$ {earningsMonth.toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'rgba(103, 58, 183, 0.1)', padding: '0.5rem', borderRadius: '8px' }}><LayoutDashboard size={20} color="var(--color-primary)"/></div>
                </div>
                <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', fontWeight: '600' }}>ESTA SEMANA</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-accent-hover)' }}>C$ {earningsWeek.toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'rgba(255, 171, 0, 0.1)', padding: '0.5rem', borderRadius: '8px' }}><ShoppingBag size={20} color="var(--color-accent-hover)"/></div>
                </div>
              </div>
            </div>

            {/* Seccion 3: Acciones Rápidas (Compacto) */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-text-light)' }}>GESTIÓN RÁPIDA</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                 <button className="btn-outline" onClick={() => setActiveTab('products')} style={{ padding: '0.75rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', background: 'white' }}>
                    <Package size={18} color="var(--color-primary-dark)" />
                    <span style={{ fontSize: '0.65rem', fontWeight: '700' }}>Inventario</span>
                 </button>
                 <button className="btn-outline" onClick={() => { setActiveTab('products'); admin.setShowProductForm(true); }} style={{ padding: '0.75rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', background: 'white' }}>
                    <Plus size={18} color="var(--color-primary-dark)" />
                    <span style={{ fontSize: '0.65rem', fontWeight: '700' }}>Nuevo</span>
                 </button>
                 <button className="btn-outline" onClick={() => setActiveTab('categories')} style={{ padding: '0.75rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', background: 'white' }}>
                    <Tag size={18} color="var(--color-primary-dark)" />
                    <span style={{ fontSize: '0.65rem', fontWeight: '700' }}>Colecciones</span>
                 </button>
                 <button className="btn-outline" onClick={() => setActiveTab('sold')} style={{ padding: '0.75rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', background: 'white' }}>
                    <CheckCircle size={18} color="#2E7D32" />
                    <span style={{ fontSize: '0.65rem', fontWeight: '700' }}>Ventas</span>
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* Inventory View */}
        {activeTab === 'products' && (
          <div className="animate-fade-in">
            {/* Header de sección con botón de añadir */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid rgba(103, 58, 183, 0.08)'
            }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, opacity: 0.8 }}>Stock de Inventario</h2>
              <button 
                className="btn-primary" 
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                  border: 'none',
                  boxShadow: '0 8px 20px rgba(103, 58, 183, 0.25)',
                  fontSize: '0.85rem', 
                  fontWeight: '700',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.6rem',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                onClick={() => {
                  admin.setEditingId(null);
                  admin.setProductForm({ name: '', description: '', price: '', brand: '', category_id: '', materials: '', condition: '', size: '', images: [], is_published: false });
                  admin.setShowProductForm(!admin.showProductForm);
                }}
              >
                <Plus size={18} /> {admin.showProductForm ? 'Cerrar Panel' : 'Añadir Prenda'}
              </button>
            </div>

            {/* Selector de Filtro de Categoría */}
            {!admin.showProductForm && (
              <div style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(103, 58, 183, 0.03)', padding: '0.6rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-light)' }}>Filtrar por:</span>
                <select 
                  className="input-field" 
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: 'auto', background: 'white' }}
                  value={admin.categoryFilter || ''}
                  onChange={(e) => admin.setCategoryFilter(e.target.value || null)}
                >
                  <option value="">Todas las categorías</option>
                  {admin.categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {admin.categoryFilter && (
                  <button 
                    onClick={() => admin.setCategoryFilter(null)}
                    style={{ fontSize: '0.7rem', color: 'var(--color-primary-dark)', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Limpiar
                  </button>
                )}
              </div>
            )}

            {admin.showProductForm && (
              <form className="glass-panel animate-fade-in" style={{ padding: '1.25rem', marginBottom: '2rem', border: '1px solid var(--color-primary)' }} onSubmit={admin.handleProductSubmit}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {admin.editingId ? <Eye size={18} /> : <Plus size={18} />} 
                  {admin.editingId ? 'Editar Prenda' : 'Nueva Prenda'}
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.75rem' }}>
                  {/* Fila 1: Nombre y Precio */}
                  <div style={{ gridColumn: 'span 4' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.2rem', display: 'block', color: 'var(--color-text-light)' }}>Nombre</label>
                    <input required className="input-field" style={{ padding: '0.6rem 0.8rem' }} placeholder="Ej: Blusa de Seda" value={admin.productForm.name} onChange={e => admin.setProductForm({ ...admin.productForm, name: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.2rem', display: 'block', color: 'var(--color-text-light)' }}>Precio</label>
                    <input required type="number" step="0.01" className="input-field" style={{ padding: '0.6rem 0.8rem' }} placeholder="0.00" value={admin.productForm.price} onChange={e => admin.setProductForm({ ...admin.productForm, price: e.target.value })} />
                  </div>

                  {/* Fila 2: Marca y Categoría */}
                  <div style={{ gridColumn: 'span 3' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.2rem', display: 'block', color: 'var(--color-text-light)' }}>Marca</label>
                    <input className="input-field" style={{ padding: '0.6rem 0.8rem' }} placeholder="Zara, Shein..." value={admin.productForm.brand} onChange={e => admin.setProductForm({ ...admin.productForm, brand: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: 'span 3' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.2rem', display: 'block', color: 'var(--color-text-light)' }}>Categoría</label>
                    <select className="input-field" style={{ padding: '0.6rem 0.8rem' }} value={admin.productForm.category_id} onChange={e => admin.setProductForm({ ...admin.productForm, category_id: e.target.value })}>
                      <option value="">Seleccione...</option>
                      {admin.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  {/* Fila 3: Talla y Condición */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.2rem', display: 'block', color: 'var(--color-text-light)' }}>Talla</label>
                    <input className="input-field" style={{ padding: '0.6rem 0.8rem' }} placeholder="S, M, L..." value={admin.productForm.size} onChange={e => admin.setProductForm({ ...admin.productForm, size: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: 'span 4' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.2rem', display: 'block', color: 'var(--color-text-light)' }}>Condición de la Prenda</label>
                    <select 
                      className="input-field" 
                      style={{ padding: '0.6rem 0.8rem' }} 
                      value={admin.productForm.condition} 
                      onChange={e => admin.setProductForm({ ...admin.productForm, condition: e.target.value })}
                      required
                    >
                      <option value="">Seleccione condición...</option>
                      <option value="Nuevo con Etiqueta">Nuevo con Etiqueta ✨</option>
                      <option value="Como Nuevo">Como Nuevo (Semicuero/Seda) 👌</option>
                      <option value="Excelente Estado">Excelente Estado ⭐</option>
                      <option value="Buen Estado">Buen Estado ✅</option>
                    </select>
                  </div>

                  {/* Fila 4: Fotos */}
                  <div style={{ gridColumn: 'span 6' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.2rem', display: 'block', color: 'var(--color-text-light)' }}>
                      Fotos (Mínimo 2 recomendadas para mejor catálogo)
                    </label>
                    <div style={{ border: '2px dashed var(--color-primary)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center', backgroundColor: 'rgba(209, 196, 233, 0.05)', position: 'relative', marginBottom: '0.5rem' }}>
                      <input type="file" multiple accept="image/*" onChange={(e) => admin.setSelectedFiles([...admin.selectedFiles, ...Array.from(e.target.files)])} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Plus size={16} color="var(--color-primary-dark)" />
                        <span style={{ fontSize: '0.85rem' }}>Añadir fotos</span>
                      </div>
                    </div>

                    {/* Previsualización de fotos existentes y nuevas */}
                    <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', padding: '5px 0' }}>
                      {/* Fotos ya subidas (en edición) */}
                      {admin.productForm.images && admin.productForm.images.map((url, i) => (
                        <div key={`old-${i}`} style={{ position: 'relative', minWidth: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd', flexShrink: 0 }}>
                          <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button 
                            type="button"
                            onClick={() => admin.removeImage(i)}
                            style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(255,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px' }}
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}

                      {/* Fotos seleccionadas para subir */}
                      {admin.selectedFiles.map((file, i) => (
                        <div key={`new-${i}`} style={{ position: 'relative', minWidth: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--color-primary)', flexShrink: 0 }}>
                          <img src={URL.createObjectURL(file)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--color-primary)', color: 'var(--color-primary-dark)', fontSize: '8px', textAlign: 'center', fontWeight: '800' }}>NUEVA</div>
                          <button 
                            type="button"
                            onClick={() => admin.removeSelectedFile(i)}
                            style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px' }}
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {(admin.productForm.images.length + admin.selectedFiles.length) < 2 && (
                      <p style={{ fontSize: '0.65rem', color: '#D32F2F', marginTop: '0.4rem', fontWeight: '600' }}>
                        ⚠️ Intenta subir al menos 2 fotos para que el cliente pueda apreciar mejor la prenda.
                      </p>
                    )}
                  </div>

                  {/* Fila 5: Descripción */}
                  <div style={{ gridColumn: 'span 6' }}>
                    <textarea className="input-field" rows="2" style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem' }} placeholder="Descripción corta..." value={admin.productForm.description} onChange={e => admin.setProductForm({ ...admin.productForm, description: e.target.value })} />
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-primary-dark)', marginTop: '0.4rem', fontWeight: '600' }}>
                      ✨ Nota: La prenda se guardará como "Borrador". Deberás subirla al catálogo desde el inventario cuando estés lista.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn-primary" style={{ flexGrow: 1, padding: '0.75rem' }}>
                    {admin.editingId ? 'Guardar Cambios' : 'Publicar'}
                  </button>
                  <button type="button" className="btn-outline" onClick={() => { admin.setShowProductForm(false); admin.setEditingId(null); }} style={{ flexGrow: 1, padding: '0.75rem' }}>Cancelar</button>
                </div>
              </form>
            )}


            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {admin.filteredProducts.filter(p => !p.sold_at).length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                  No hay prendas disponibles en esta sección.
                </div>
              ) : (
                admin.filteredProducts.filter(p => !p.sold_at).map((p, idx) => (
                  <div key={p.id} className="glass-panel animate-fade-in" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', border: '1px solid rgba(103, 58, 183, 0.05)' }}>
                    {/* Imagen Miniatura */}
                    <div style={{ width: '70px', height: '70px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f0f0f0' }}>
                      <img 
                        src={p.images && p.images[0] ? p.images[0] : 'https://placehold.co/100x100?text=Sin+Foto'} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt={p.name}
                      />
                    </div>

                    {/* Información Central */}
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h4>
                        <span style={{ fontWeight: '800', color: 'var(--color-primary-dark)', fontSize: '0.9rem' }}>C${p.price}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>
                        {p.brand} • {p.categories?.name || 'Sin categoría'}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {p.sold_at ? (
                          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Vendido</span>
                        ) : p.is_published ? (
                          <span className="badge badge-success" style={{ fontSize: '0.65rem', background: '#E8F5E9', color: '#2E7D32' }}>En Catálogo</span>
                        ) : (
                          <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Borrador</span>
                        )}
                      </div>
                    </div>

                    {/* Botones de Acción (Vertical en móvil para ahorrar ancho) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderLeft: '1px solid #eee', paddingLeft: '0.8rem' }}>
                      {!p.sold_at && (
                        <>
                          {!p.is_published ? (
                            <button className="btn-outline" style={{ padding: '0.4rem', borderRadius: '8px', color: 'var(--color-primary)' }} onClick={() => admin.togglePublished(p.id, false)} title="Publicar">
                              <ShoppingBag size={16} />
                            </button>
                          ) : (
                            <button className="btn-outline" style={{ padding: '0.4rem', borderRadius: '8px', color: '#2E7D32' }} onClick={() => admin.handleMarkAsSold(p.id)} title="Marcar Vendido">
                              <CheckCircle size={16} />
                            </button>
                          )}
                        </>
                      )}
                      <button className="btn-outline" style={{ padding: '0.4rem', borderRadius: '8px' }} onClick={() => admin.startEditProduct(p)} title="Editar">
                        <Eye size={16} />
                      </button>
                      <button className="btn-outline" style={{ padding: '0.4rem', borderRadius: '8px', color: '#C62828' }} onClick={() => admin.handleDeleteProduct(p.id)} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Categories View */}
        {activeTab === 'categories' && (
          <div className="animate-fade-in">
            {/* Header de sección con botón de añadir */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid rgba(103, 58, 183, 0.08)'
            }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, opacity: 0.8 }}>Gestión de Colecciones</h2>
              <button 
                className="btn-primary" 
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                  border: 'none',
                  boxShadow: '0 8px 20px rgba(103, 58, 183, 0.25)',
                  fontSize: '0.85rem', 
                  fontWeight: '700',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.6rem',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                onClick={() => {
                  admin.setEditingCatId(null);
                  admin.setCategoryForm({ name: '', description: '' });
                  admin.setShowCategoryForm(!admin.showCategoryForm);
                }}
              >
                <Plus size={18} /> {admin.showCategoryForm ? 'Cerrar Panel' : 'Añadir Categoría'}
              </button>
            </div>

             {admin.showCategoryForm && (
              <form className="glass-panel animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--color-primary)' }} onSubmit={admin.handleCategorySubmit}>
                 <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   {admin.editingCatId ? <Tag size={18} /> : <Tag size={18} />} 
                   {admin.editingCatId ? 'Editar Categoría' : 'Nueva Categoría'}
                 </h3>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.2rem', display: 'block', color: 'var(--color-text-light)' }}>Nombre de la Categoría</label>
                      <input required className="input-field" style={{ padding: '0.7rem' }} placeholder="Ej: Vestidos, Calzado, Accesorios..." value={admin.categoryForm.name} onChange={e => admin.setCategoryForm({ ...admin.categoryForm, name: e.target.value })} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.2rem', display: 'block', color: 'var(--color-text-light)' }}>Descripción (Opcional)</label>
                      <textarea className="input-field" rows="2" style={{ padding: '0.7rem' }} placeholder="Breve descripción para organizar mejor..." value={admin.categoryForm.description} onChange={e => admin.setCategoryForm({ ...admin.categoryForm, description: e.target.value })} />
                    </div>
                 </div>
                 <div style={{ marginTop: '1.2rem', display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn-primary" style={{ flexGrow: 1 }}>
                    {admin.editingCatId ? 'Actualizar Categoría' : 'Guardar Categoría'}
                  </button>
                  <button type="button" className="btn-outline" onClick={() => { admin.setShowCategoryForm(false); admin.setEditingCatId(null); }}>Cancelar</button>
                </div>
              </form>
             )}

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {admin.categories.length === 0 ? (
                  <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                    No has creado ninguna categoría todavía.
                  </div>
                ) : (
                  admin.categories.map(c => {
                    const count = admin.products.filter(p => p.category_id === c.id && !p.sold_at).length;
                    return (
                      <div key={c.id} className="glass-panel" style={{ padding: '1.5rem', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                          <div style={{ background: 'var(--color-primary)', width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                             <Package size={22} color="var(--color-text-heading)" />
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-outline" style={{ padding: '0.4rem', borderRadius: '8px' }} title="Editar" onClick={() => admin.startEditCategory(c)}><Eye size={16}/></button>
                            <button className="btn-outline" style={{ padding: '0.4rem', borderRadius: '8px', color: '#C62828' }} title="Eliminar" onClick={() => admin.handleDeleteCategory(c.id)}><Trash2 size={16}/></button>
                          </div>
                        </div>
                        
                        <div style={{ position: 'relative', zIndex: 1 }}>
                          <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{c.name}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '1.5rem', minHeight: '2.5rem' }}>
                            {c.description || "Sin descripción establecida."}
                          </p>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                             <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-text-light)' }}>PRODUCTOS</span>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                {count > 0 && (
                                  <button 
                                    onClick={() => {
                                      admin.setCategoryFilter(c.id);
                                      setActiveTab('products');
                                    }}
                                    style={{ 
                                      background: 'rgba(103, 58, 183, 0.05)', 
                                      border: 'none', 
                                      color: 'var(--color-primary-dark)', 
                                      fontSize: '0.75rem', 
                                      fontWeight: '700', 
                                      padding: '0.3rem 0.6rem', 
                                      borderRadius: '8px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Ver Stock
                                  </button>
                                )}
                                <span className="badge badge-success" style={{ fontSize: '0.9rem', padding: '0.2rem 0.8rem' }}>{count}</span>
                             </div>
                          </div>
                        </div>

                        {/* Decoración de fondo sutil */}
                        <Tag size={80} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.03, transform: 'rotate(-15deg)' }} />
                      </div>
                    );
                  })
                )}
             </div>
          </div>
        )}

        {/* Sold Items View */}
        {activeTab === 'sold' && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, opacity: 0.8 }}>Prendas Vendidas</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>Histórico de todas las ventas realizadas.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {admin.products.filter(p => p.sold_at).length === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                  Aún no tienes ventas registradas. ¡Ánimo!
                </div>
              ) : (
                admin.products
                  .filter(p => p.sold_at)
                  .sort((a, b) => new Date(b.sold_at) - new Date(a.sold_at))
                  .map((p) => (
                    <div key={p.id} className="glass-panel animate-fade-in" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', borderLeft: '4px solid #2E7D32' }}>
                       <div style={{ width: '60px', height: '60px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                        <img 
                          src={p.images && p.images[0] ? p.images[0] : 'https://placehold.co/100x100?text=Sin+Foto'} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          alt={p.name}
                        />
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{p.name}</h4>
                          <span style={{ fontWeight: '800', color: '#2E7D32' }}>C${p.price}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                          Vendido el: {new Date(p.sold_at).toLocaleDateString()}
                        </div>
                      </div>
                      <button className="btn-outline" style={{ padding: '0.5rem', borderRadius: '8px', color: '#C62828' }} onClick={() => admin.handleDeleteProduct(p.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
