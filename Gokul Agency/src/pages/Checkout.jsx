import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    customer_name: '',
    mobile_no: '',
    address_door: '',
    address_street: '',
    address_village: '',
    address_taluk: '',
    address_district: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p>No items to checkout.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-agri-green underline">Go Home</button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Prepare JSON items array
    const items = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    const { error } = await supabase
      .from('orders')
      .insert([{ 
        ...formData, 
        items,
        total_amount: cartTotal,
        status: 'pending'
      }]);

    setLoading(false);
    if (error) {
      console.error(error);
      setErrorMsg('Error placing order. Please check database schema or try again.');
    } else {
      clearCart();
      navigate('/success');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate('/cart')} className="text-agri-green hover:underline mr-4">
            &larr; Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-agri-gold pb-1 inline-block">
            Delivery Details / முகவரி
          </h1>
        </div>

        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-agri-green">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name / பெயர் *</label>
              <input required type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-agri-green focus:border-agri-green" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number / மொபைல் எண் *</label>
              <input required type="tel" name="mobile_no" value={formData.mobile_no} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-agri-green focus:border-agri-green" />
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Door No / கதவு எண் *</label>
                  <input required type="text" name="address_door" value={formData.address_door} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-agri-green" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Street / தெரு *</label>
                  <input required type="text" name="address_street" value={formData.address_street} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-agri-green" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Village / கிராமம் *</label>
                  <input required type="text" name="address_village" value={formData.address_village} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-agri-green" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Taluk / தாலுகா *</label>
                  <input required type="text" name="address_taluk" value={formData.address_taluk} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-agri-green" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">District / மாவட்டம் *</label>
                  <input required type="text" name="address_district" value={formData.address_district} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-agri-green" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-agri-green hover:bg-green-800 text-white font-bold py-4 rounded-xl shadow-md transition-colors disabled:opacity-50 text-xl"
            >
              {loading ? 'Processing...' : `Confirm Order (₹${cartTotal})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
