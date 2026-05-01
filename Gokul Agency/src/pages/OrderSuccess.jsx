import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-agri-green flex flex-col items-center justify-center p-4 text-center font-sans text-white">
      <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border-4 border-agri-gold">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Congratulations!</h1>
        <h2 className="text-xl text-agri-green font-semibold mb-6">Your order is placed.</h2>
        <p className="text-gray-600 mb-8">We have successfully received your order and will contact you shortly regarding delivery.</p>
        
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-agri-gold hover:bg-yellow-500 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-transform hover:scale-105"
        >
          Return to Shop
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
