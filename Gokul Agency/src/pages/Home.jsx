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
      // Fallback for demo if table doesn't exist yet
      setProducts([
        { id: '1', name: 'Annapoorna Rice (26kg)', label: 'அன்னபூர்ணா அரிசி', price: 1500, image_url: '/rice_bag.png' },
        { id: '2', name: 'Arokiya Thivanam (50kg)', label: 'ஆரோக்கியா தீவனம் (மாட்டு தீவனம்)', price: 1700, image_url: '/cattle_feed.png' }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-24">
      {/* Header */}
      <header className="bg-agri-green text-white py-6 shadow-md">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Gokulakannan Agency Logo" className="w-16 h-16 rounded-full border-2 border-agri-gold bg-white object-cover" />
            <div>
              <h1 className="text-3xl font-bold tracking-wide">Gokulakannan Agency</h1>
              <p className="text-sm text-agri-gold font-medium">கோகுலகண்ணன் ஏஜென்சி</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="font-semibold flex items-center justify-end gap-2">
              <svg className="w-5 h-5 text-agri-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              9786801860
            </p>
            <p className="text-sm opacity-90 mt-1">5/96A, Erkolpatti, Dharmapuri - 636810</p>
            <p className="text-xs text-agri-gold">தருமபுரி</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-agri-green mb-6 border-b-2 border-agri-gold pb-2 inline-block">
          Our Products / எங்கள் தயாரிப்புகள்
        </h2>
        
        {loading ? (
          <div className="text-center py-10">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const qty = getQuantity(product.id);
              return (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
                  {/* Automatically cropped to 1:1 ratio */}
                  <img src={product.image_url} alt={product.name} className="w-full aspect-square object-cover bg-gray-100" />
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                      <p className="text-agri-green text-sm font-medium mb-3">{product.label}</p>
                      <p className="text-xl font-bold text-agri-gold mb-4">₹{product.price}</p>
                    </div>
                    
                    {/* Add to Cart Controls */}
                    <div className="flex items-center justify-between border rounded-lg overflow-hidden">
                      <button 
                        onClick={() => removeFromCart(product.id)}
                        disabled={qty === 0}
                        className="bg-gray-100 px-4 py-2 hover:bg-gray-200 disabled:opacity-50 text-xl font-bold text-gray-700 w-1/3"
                      >
                        -
                      </button>
                      <span className="font-bold text-lg w-1/3 text-center">{qty}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-agri-green text-white px-4 py-2 hover:bg-green-800 text-xl font-bold w-1/3"
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

      {/* Floating Buy Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50">
          <div className="container mx-auto px-4 max-w-2xl flex justify-between items-center">
            <div className="text-gray-800 font-bold">
              <span className="text-sm text-gray-500 block">Items Selected: {cartCount}</span>
              <span className="text-xl">Checkout</span>
            </div>
            <button 
              onClick={() => navigate('/cart')}
              className="bg-agri-gold hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-full shadow-md transition-transform hover:scale-105 text-lg flex items-center gap-2"
            >
              Buy Now / வாங்க
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
