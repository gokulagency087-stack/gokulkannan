import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cartCount, getQuantity, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (!error && data) {
      setProducts(data);
    } else {
      console.error(error);
      setProducts([
        { id: '1', name: 'Annapoorna Rice (26kg)', label: 'அன்னபூர்ணா அரிசி', price: 1500, image_url: '/rice_bag.png' },
        { id: '2', name: 'Arokiya Thivanam (50kg)', label: 'ஆரோக்கியா தீவனம் (மாட்டு தீவனம்)', price: 1700, image_url: '/cattle_feed.png' }
      ]);
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-24">
      {/* ✅ FIXED HEADER - stays at top while scrolling */}
      <header className="fixed top-0 left-0 w-full bg-agri-green text-white z-40 shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Gokulakannan Agency Logo"
              className="w-12 h-12 rounded-full border-2 border-agri-gold bg-white object-cover flex-shrink-0"
            />
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-wide">Gokulakannan Agency</h1>
              <p className="text-xs text-agri-gold font-medium">கோகுலகண்ணன் ஏஜென்சி</p>
            </div>
          </div>
          {/* Cart count badge in header */}
          {cartCount > 0 && (
            <button
              onClick={() => navigate('/cart')}
              className="relative bg-agri-gold text-white rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 8h11M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/>
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </button>
          )}
        </div>
      </header>
      {/* Spacer to push content below fixed header */}
      <div className="h-[72px]"></div>
      {/* ✅ CONTACT INFO - scrolls with page, visible at top above products */}
      <div className="bg-green-800 text-white py-3 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-center sm:text-left">
          <a href="tel:9786801860" className="flex items-center gap-2 font-semibold text-sm">
            <svg className="w-4 h-4 text-agri-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            9786801860
          </a>
          <span className="hidden sm:inline text-green-500">|</span>
          <p className="text-xs opacity-80">5/96A, Erkolpatti, Dharmapuri - 636810</p>
        </div>
      </div>
      <main className="container mx-auto px-3 py-6">
        <h2 className="text-lg font-bold text-agri-green mb-4 border-b-2 border-agri-gold pb-1 inline-block">
          Our Products / எங்கள் தயாரிப்புகள்
        </h2>
        
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading products...</div>
        ) : (
          // ✅ 2 COLUMNS on mobile, 3 on large screens
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {products.map((product) => {
              const qty = getQuantity(product.id);
              return (
                <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
                  {/* Auto-cropped 1:1 image */}
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full aspect-square object-cover bg-gray-100"
                  />
                  <div className="p-3 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 leading-tight">{product.name}</h3>
                      <p className="text-agri-green text-xs font-medium mt-0.5 mb-2">{product.label}</p>
                      <div className="mb-3">
                        {product.mrp && product.mrp > product.price && (
                          <p className="text-xs text-gray-400">
                            MRP: <span className="line-through">₹{product.mrp}</span>
                          </p>
                        )}
                        <p className="text-base font-bold text-agri-gold">₹{product.price}</p>
                      </div>
                    </div>
                    
                    {/* ✅ ADD TO CART CONTROLS with RED minus button */}
                    <div className="flex items-center justify-between border rounded-lg overflow-hidden">
                      <button 
                        onClick={() => removeFromCart(product.id)}
                        disabled={qty === 0}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-red-200 disabled:opacity-60 text-white px-3 py-2 text-xl font-bold w-1/3 transition-colors"
                      >
                        −
                      </button>
                      <span className="font-bold text-base w-1/3 text-center">{qty}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-agri-green text-white px-3 py-2 hover:bg-green-800 text-xl font-bold w-1/3 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      {/* ✅ FLOATING BUY BUTTON */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-3 z-40">
          <div className="container mx-auto px-4 max-w-2xl flex justify-between items-center">
            <div className="text-gray-800 font-bold">
              <span className="text-xs text-gray-500 block">{cartCount} item{cartCount > 1 ? 's' : ''} selected</span>
              <span className="text-base">Ready to Order</span>
            </div>
            <button 
              onClick={() => navigate('/cart')}
              className="bg-agri-gold hover:bg-yellow-500 text-white font-bold py-2.5 px-6 rounded-full shadow-md transition-transform active:scale-95 text-base flex items-center gap-2"
            >
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
