import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const { cartCount, getQuantity, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error && data) {
      setProducts(data);
    } else {
      console.error(error);
      setProducts([
        { id: '1', name: 'Annapoorna Rice (26kg)', label: 'அன்னபூர்ணா அரிசி', price: 1500, mrp: null, special_offer: null, image_url: '/rice_bag.png' },
        { id: '2', name: 'Arokiya Thivanam (50kg)', label: 'ஆரோக்கியா தீவனம்', price: 1700, mrp: null, special_offer: null, image_url: '/cattle_feed.png' }
      ]);
    }
    setLoading(false);
  };
  // Price display helper
  const PriceBlock = ({ product, size = 'normal' }) => {
    const hasSpecialOffer = product.special_offer && product.special_offer < product.price;
    const hasMrp = product.mrp && product.mrp > product.price;
    const textSize = size === 'small' ? 'text-xs' : 'text-sm';
    const priceSize = size === 'small' ? 'text-base' : 'text-lg';
    return (
      <div>
        {hasMrp && (
          <p className={`${textSize} text-gray-400`}>
            MRP: <span className="line-through">Rs.{product.mrp}</span>
          </p>
        )}
        {hasSpecialOffer ? (
          <>
            <p className={`${textSize} text-gray-400`}>
              Price: <span className="line-through">Rs.{product.price}</span>
            </p>
            <p className={`${priceSize} font-bold text-red-600`}>
              Special Offer: Rs.{product.special_offer}
              <span className="ml-1 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-semibold">OFFER</span>
            </p>
          </>
        ) : (
          <p className={`${priceSize} font-bold text-agri-gold`}>Rs.{product.price}</p>
        )}
      </div>
    );
  };
  // Quantity controls reused in both views
  const QtyControls = ({ product }) => {
    const qty = getQuantity(product.id);
    return (
      <div className="flex items-center border rounded-lg overflow-hidden">
        <button
          onClick={() => removeFromCart(product.id)}
          disabled={qty === 0}
          className="bg-red-500 hover:bg-red-600 disabled:bg-red-200 disabled:opacity-60 text-white px-3 py-2 text-xl font-bold w-1/3 transition-colors"
        >−</button>
        <span className="font-bold text-base w-1/3 text-center">{qty}</span>
        <button
          onClick={() => addToCart(product)}
          className="bg-agri-green text-white px-3 py-2 hover:bg-green-800 text-xl font-bold w-1/3 transition-colors"
        >+</button>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-24">
      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 w-full bg-agri-green text-white z-40 shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Gokulakannan Agency Logo" className="w-12 h-12 rounded-full border-2 border-agri-gold bg-white object-cover flex-shrink-0" />
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-wide">Gokulakannan Agency</h1>
              <p className="text-xs text-agri-gold font-medium">கோகுலகண்ணன் ஏஜென்சி</p>
            </div>
          </div>
          {cartCount > 0 && (
            <button onClick={() => navigate('/cart')} className="relative bg-agri-gold text-white rounded-full p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 8h11M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/>
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>
            </button>
          )}
        </div>
      </header>
      <div className="h-[72px]"></div>
      {/* CONTACT INFO - scrolls away */}
      <div className="bg-green-800 text-white py-3 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <a href="tel:9786801360" className="flex items-center gap-2 font-semibold text-sm">
            <svg className="w-4 h-4 text-agri-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            9786801360
          </a>
          <span className="hidden sm:inline text-green-500">|</span>
          <a href="mailto:gokulagency087@gmail.com" className="flex items-center gap-2 text-xs font-medium text-agri-gold">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            gokulagency087@gmail.com
          </a>
          <span className="hidden sm:inline text-green-500">|</span>
          <p className="text-xs opacity-80">5/96A, Erkolpatti, Dharmapuri - 636810</p>
        </div>
      </div>
      <main className="container mx-auto px-3 py-6">
        {/* Section header with view toggle */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-agri-green border-b-2 border-agri-gold pb-1 inline-block">
            Our Goods / எங்கள் பொருட்கள்
          </h2>
          {/* View toggle buttons */}
          <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-agri-green text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
              title="Grid View"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-agri-green text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
              title="List View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading goods...</div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col relative">
                {product.special_offer && product.special_offer < product.price && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">OFFER</div>
                )}
                <img src={product.image_url} alt={product.name} className="w-full aspect-square object-cover bg-gray-100" />
                <div className="p-3 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 leading-tight">{product.name}</h3>
                    <p className="text-agri-green text-xs font-medium mt-0.5 mb-2">{product.label}</p>
                    <div className="mb-3">
                      <PriceBlock product={product} size="small" />
                    </div>
                  </div>
                  <QtyControls product={product} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="flex flex-col gap-3">
            {products.map((product) => {
              const qty = getQuantity(product.id);
              return (
                <div key={product.id} className="bg-white rounded-xl shadow-md border border-gray-100 flex overflow-hidden relative">
                  {product.special_offer && product.special_offer < product.price && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">OFFER</div>
                  )}
                  <img src={product.image_url} alt={product.name} className="w-28 h-28 object-cover bg-gray-100 flex-shrink-0" />
                  <div className="p-3 flex-grow flex justify-between items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-800 leading-tight">{product.name}</h3>
                      <p className="text-agri-green text-xs font-medium mt-0.5">{product.label}</p>
                      <div className="mt-1">
                        <PriceBlock product={product} size="small" />
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-28">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button onClick={() => removeFromCart(product.id)} disabled={qty === 0} className="bg-red-500 hover:bg-red-600 disabled:bg-red-200 disabled:opacity-60 text-white px-2 py-2 text-lg font-bold flex-1 transition-colors">−</button>
                        <span className="font-bold text-sm flex-1 text-center">{qty}</span>
                        <button onClick={() => addToCart(product)} className="bg-agri-green text-white px-2 py-2 hover:bg-green-800 text-lg font-bold flex-1 transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      {/* FLOATING BUY BUTTON */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-3 z-40">
          <div className="container mx-auto px-4 max-w-2xl flex justify-between items-center">
            <div className="text-gray-800 font-bold">
              <span className="text-xs text-gray-500 block">{cartCount} item{cartCount > 1 ? 's' : ''} selected</span>
              <span className="text-base">Ready to Order</span>
            </div>
            <button onClick={() => navigate('/cart')} className="bg-agri-gold hover:bg-yellow-500 text-white font-bold py-2.5 px-6 rounded-full shadow-md transition-transform active:scale-95 text-base flex items-center gap-2">
              Buy Now / வாங்க
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Home;
