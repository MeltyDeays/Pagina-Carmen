import { useState, useRef } from 'react';
import { Package, Tag, LogOut, Plus, Search, DollarSign, LayoutDashboard, ShoppingBag, Eye, Trash2, CheckCircle } from 'lucide-react';
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
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

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
    if (phone === '58438412') { 
      setIsAuthenticated(true);
    } else {
      alert('Número no autorizado');
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
        
        {activeTab === 'dashboard' && (
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
                { id: 'categories', label: 'Categorías', icon: Tag }
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
        )}
      </div>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header Superior */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {activeTab !== 'dashboard' && (
              <button onClick={() => setActiveTab('dashboard')} className="btn-outline show-mobile-only" style={{ padding: '0.5rem', borderRadius: '50%', background: 'white' }}>
                <LayoutDashboard size={18} />
              </button>
            )}
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--color-primary-dark)', cursor: 'pointer' }} onClick={() => {
                  if(activeTab === 'products') {
                    admin.setEditingId(null);
                    admin.setProductForm({ name: '', description: '', price: '', brand: '', category_id: '', materials: '', condition: '', size: '', images: [], is_published: false });
                    admin.setShowProductForm(!admin.showProductForm);
                  }
                  if(activeTab === 'categories') {
                    admin.setEditingCatId(null);
                    admin.setCategoryForm({ name: '', description: '' });
                    admin.setShowCategoryForm(!admin.showCategoryForm);
                  }
                }}>
                {activeTab === 'dashboard' && "Panel de Inteligencia"}
                {activeTab === 'products' && "Inventario"}
                {activeTab === 'categories' && "Categorías"}
              </h1>
              <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem' }}>Carmen Boutique • Chontales</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="btn-outline"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                padding: '0.5rem 0.8rem', 
                color: '#dc3545', 
                border: '1px solid #ffccd5', 
                background: 'white',
                fontSize: '0.85rem'
              }}
            >
              <LogOut size={16} /> <span className="hide-mobile">Salir</span>
            </button>
          </div>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
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
                    <span style={{ fontSize: '0.65rem', fontWeight: '700' }}>Categorías</span>
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* Inventory View */}
        {activeTab === 'products' && (
          <div className="animate-fade-in">
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
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.2rem', display: 'block', color: 'var(--color-text-light)' }}>Condición</label>
                    <input className="input-field" style={{ padding: '0.6rem 0.8rem' }} placeholder="Como nueva, usada..." value={admin.productForm.condition} onChange={e => admin.setProductForm({ ...admin.productForm, condition: e.target.value })} />
                  </div>

                  {/* Fila 4: Fotos */}
                  <div style={{ gridColumn: 'span 6' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.2rem', display: 'block', color: 'var(--color-text-light)' }}>Fotos</label>
                    <div style={{ border: '2px dashed var(--color-primary)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center', backgroundColor: 'rgba(209, 196, 233, 0.05)', position: 'relative' }}>
                      <input type="file" multiple accept="image/*" onChange={(e) => admin.setSelectedFiles(Array.from(e.target.files))} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Plus size={16} color="var(--color-primary-dark)" />
                        <span style={{ fontSize: '0.85rem' }}>Seleccionar fotos</span>
                      </div>
                    </div>

                    {admin.selectedFiles.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', overflowX: 'auto' }}>
                        {admin.selectedFiles.map((file, i) => (
                          <div key={i} style={{ position: 'relative', minWidth: '50px', height: '50px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #ddd' }}>
                            <img src={URL.createObjectURL(file)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>
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


            <div className="glass-panel" style={{ overflow: 'hidden' }}>
              <div className="admin-table-header">
                <span>VISTA</span>
                <span>PRODUCTO</span>
                <span>PRECIO</span>
                <span style={{ textAlign: 'right' }}>ACCIONES</span>
              </div>
              
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {admin.products.length === 0 ? (
                  <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-light)' }}>No hay productos registrados.</div>
                ) : (
                  admin.products.map(p => (
                    <div key={p.id} className="admin-product-row">
                      <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', background: '#eee' }}>
                        <img src={p.images?.[0] || 'https://placehold.co/50x50'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ paddingLeft: '1rem' }}>
                        <div style={{ fontWeight: '600', color: 'var(--color-text-heading)' }}>{p.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>{p.brand} • Talla {p.size || 'N/A'}</div>
                        {p.sold_at && <span className="badge badge-danger" style={{ marginTop: '0.3rem', display: 'inline-block' }}>Vendido</span>}
                        {!p.sold_at && !p.is_published && <span className="badge badge-warning" style={{ marginTop: '0.3rem', display: 'inline-block' }}>Borrador</span>}
                        {!p.sold_at && p.is_published && <span className="badge badge-success" style={{ marginTop: '0.3rem', display: 'inline-block' }}>En Tienda</span>}
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>C${p.price}</div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {!p.sold_at && !p.is_published && (
                          <button 
                            className="btn-outline" 
                            style={{ padding: '0.5rem', borderRadius: '8px', color: 'var(--color-primary-dark)' }}
                            title="Subir al Catálogo"
                            onClick={() => admin.togglePublished(p.id, false)}
                          >
                            <ShoppingBag size={18} />
                          </button>
                        )}
                        {!p.sold_at && p.is_published && (
                          <button 
                            className="btn-outline" 
                            style={{ padding: '0.5rem', borderRadius: '8px', color: '#2E7D32' }}
                            title="Marcar como Vendido"
                            onClick={() => admin.handleMarkAsSold(p.id)}
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button className="btn-outline" style={{ padding: '0.5rem', borderRadius: '8px' }} title="Editar" onClick={() => admin.startEditProduct(p)}><Eye size={18} /></button>
                        <button className="btn-outline" style={{ padding: '0.5rem', borderRadius: '8px', color: '#C62828' }} title="Eliminar" onClick={() => admin.handleDeleteProduct(p.id)}><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Categories View */}
        {activeTab === 'categories' && (
          <div className="animate-fade-in">
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
                    const count = admin.products.filter(p => p.category_id === c.id).length;
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
                             <span className="badge badge-success" style={{ fontSize: '0.9rem', padding: '0.2rem 0.8rem' }}>{count}</span>
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

      </main>
    </div>
  );
}
