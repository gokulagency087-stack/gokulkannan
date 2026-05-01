import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, addToCart, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-agri-green text-white px-6 py-2 rounded-md hover:bg-green-800 transition"
        >
          Go Back to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate('/')} className="text-agri-green hover:underline mr-4">
            &larr; Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-agri-gold pb-1 inline-block">
            Cart Review / கூடை
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border-t-4 border-agri-green">
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 w-1/2">
                  <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded shadow-sm bg-gray-100" />
                  <div>
                    <h3 className="font-bold text-sm md:text-base leading-tight">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">₹{item.price} each</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end w-1/2">
                  <div className="flex items-center border rounded-md overflow-hidden bg-gray-50 mb-2">
                    <button onClick={() => removeFromCart(item.id)} className="px-3 py-1 bg-white hover:bg-gray-100 font-bold text-gray-600">-</button>
                    <span className="px-3 font-semibold text-sm w-8 text-center">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="px-3 py-1 bg-white hover:bg-gray-100 font-bold text-gray-600">+</button>
                  </div>
                  <p className="font-bold text-agri-gold text-lg">₹{item.price * item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
            <span className="text-lg font-bold text-gray-600">Total / மொத்தம்:</span>
            <span className="text-2xl font-bold text-agri-green">₹{cartTotal}</span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/checkout')}
          className="w-full bg-agri-gold hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02] text-xl flex justify-center items-center gap-2"
        >
          Next Step / அடுத்த படி
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default Cart;
