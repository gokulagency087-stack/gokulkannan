import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', label: '', mrp: '', price: '', special_offer: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'products') fetchProducts();
    }
  }, [isAuthenticated, activeTab]);
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email === 'gokulagency087@gmail.com' && loginData.password === 'Gokul@67') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid email or password');
    }
  };
  const fetchOrders = async () => {
    setOrdersLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setOrders(data || []);
    setOrdersLoading(false);
  };
  const updateOrderStatus = async (id, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (!error) setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };
  const fetchProducts = async () => {
    setProductsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error) setProducts(data || []);
    setProductsLoading(false);
  };
  // Move product up or down in sort order
  const moveProduct = async (index, direction) => {
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= products.length) return;
    const updated = [...products];
    const a = { ...updated[index] };
    const b = { ...updated[swapIndex] };
    // Swap sort_order values
    const tempOrder = a.sort_order ?? index;
    const swapOrder = b.sort_order ?? swapIndex;
    await supabase.from('products').update({ sort_order: swapOrder }).eq('id', a.id);
    await supabase.from('products').update({ sort_order: tempOrder }).eq('id', b.id);
    fetchProducts();
  };
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert('Please select an image file');
    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      const maxOrder = products.length > 0 ? Math.max(...products.map(p => p.sort_order || 0)) + 1 : 0;
      const { error: dbError } = await supabase.from('products').insert([{
        name: newProduct.name,
        label: newProduct.label,
        price: parseFloat(newProduct.price),
        mrp: newProduct.mrp ? parseFloat(newProduct.mrp) : null,
        special_offer: newProduct.special_offer ? parseFloat(newProduct.special_offer) : null,
        image_url: publicUrl,
        sort_order: maxOrder
      }]);
      if (dbError) throw dbError;
      setNewProduct({ name: '', label: '', mrp: '', price: '', special_offer: '' });
      setImageFile(null);
      e.target.reset();
      fetchProducts();
      alert('Product added successfully!');
    } catch (error) {
      console.error(error);
      alert('Error adding product. Check if product-images bucket exists and is public.');
    } finally {
      setIsUploading(false);
    }
  };
  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };
  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    const { error } = await supabase.from('products').update({
      name: editingProduct.name,
      label: editingProduct.label,
      price: parseFloat(editingProduct.price),
      mrp: editingProduct.mrp ? parseFloat(editingProduct.mrp) : null,
      special_offer: editingProduct.special_offer ? parseFloat(editingProduct.special_offer) : null,
    }).eq('id', editingProduct.id);
    if (!error) {
      setEditingProduct(null);
      fetchProducts();
    } else {
      alert('Failed to update product.');
    }
  };
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border-t-4 border-agri-green">
          <h2 className="text-2xl font-bold text-center mb-6 text-agri-green">Admin Login</h2>
          {loginError && <p className="text-red-500 text-center mb-4 text-sm">{loginError}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-md" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} required />
            <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-md" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} required />
            <button type="submit" className="w-full bg-agri-green text-white py-2 rounded-md hover:bg-green-800 transition">Login</button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-agri-green">Gokulakannan Admin Panel</h1>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200">Logout</button>
        </header>
        <div className="flex space-x-3 mb-6">
          <button onClick={() => setActiveTab('orders')} className={`px-5 py-2 rounded-full font-bold text-sm ${activeTab === 'orders' ? 'bg-agri-green text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            Manage Orders
          </button>
          <button onClick={() => setActiveTab('products')} className={`px-5 py-2 rounded-full font-bold text-sm ${activeTab === 'products' ? 'bg-agri-green text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            Manage Goods
          </button>
        </div>
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            {ordersLoading ? <p>Loading orders...</p> : orders.length === 0 ? <p className="text-gray-500 text-center py-10">No orders yet.</p> : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {orders.map(order => (
                  <div key={order.id} className={`bg-white rounded-lg shadow-md p-5 border-l-4 ${order.status === 'delivered' ? 'border-green-500' : order.status === 'cancelled' ? 'border-red-500' : 'border-yellow-500'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-base">{order.customer_name}</h3>
                        <p className="text-sm text-gray-500">{order.mobile_no}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-bold uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="mb-3 bg-gray-50 p-3 rounded text-sm">
                      <p className="font-semibold text-xs text-gray-400 mb-1">Items Ordered</p>
                      <ul className="mb-2 list-disc pl-4 font-medium text-gray-700">
                        {order.items && order.items.map((item, idx) => (
                          <li key={idx}>{item.quantity}x {item.name}</li>
                        ))}
                      </ul>
                      <p className="mb-2 font-bold text-agri-gold">Total: Rs.{order.total_amount}</p>
                      <p className="font-semibold text-xs text-gray-400 mb-1">Delivery Address</p>
                      <p className="text-xs">{order.address_door}, {order.address_street}</p>
                      <p className="text-xs">{order.address_village} (Village)</p>
                      <p className="text-xs">{order.address_taluk} Tk, {order.address_district} Dt</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => updateOrderStatus(order.id, 'pending')} disabled={order.status === 'pending'} className="flex-1 py-1 text-xs font-semibold rounded border border-yellow-500 text-yellow-600 disabled:opacity-40 hover:bg-yellow-50">Pending</button>
                      <button onClick={() => updateOrderStatus(order.id, 'delivered')} disabled={order.status === 'delivered'} className="flex-1 py-1 text-xs font-semibold rounded border border-green-500 text-green-600 disabled:opacity-40 hover:bg-green-50">Delivered</button>
                      <button onClick={() => updateOrderStatus(order.id, 'cancelled')} disabled={order.status === 'cancelled'} className="flex-1 py-1 text-xs font-semibold rounded border border-red-500 text-red-600 disabled:opacity-40 hover:bg-red-50">Cancelled</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Product Form */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-fit">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">English Name</label>
                  <input required type="text" placeholder="e.g. Annapoorna Rice (26kg)" className="mt-1 w-full border px-3 py-2 rounded text-sm" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tamil Name</label>
                  <input required type="text" placeholder="e.g. அன்னபூர்ணா அரிசி" className="mt-1 w-full border px-3 py-2 rounded text-sm" value={newProduct.label} onChange={e => setNewProduct({...newProduct, label: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">MRP (Rs.) <span className="text-gray-400">(optional)</span></label>
                    <input type="number" placeholder="e.g. 2999" className="mt-1 w-full border px-3 py-2 rounded text-sm" value={newProduct.mrp} onChange={e => setNewProduct({...newProduct, mrp: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Price (Rs.)</label>
                    <input required type="number" placeholder="e.g. 599" className="mt-1 w-full border px-3 py-2 rounded text-sm" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Special Offer Price (Rs.) <span className="text-red-500 text-xs">(optional)</span></label>
                  <input type="number" placeholder="e.g. 499" className="mt-1 w-full border-2 border-red-200 px-3 py-2 rounded text-sm focus:border-red-400" value={newProduct.special_offer} onChange={e => setNewProduct({...newProduct, special_offer: e.target.value})} />
                  <p className="text-xs text-gray-400 mt-1">Sets a 3-tier price: MRP → Price → Special Offer</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Image</label>
                  <input required type="file" accept="image/*" className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" onChange={e => setImageFile(e.target.files[0])} />
                  <p className="text-xs text-gray-400 mt-1">Any size — auto cropped to square.</p>
                </div>
                <button type="submit" disabled={isUploading} className="w-full bg-agri-gold text-white font-bold py-2 rounded-md hover:bg-yellow-500 disabled:opacity-50">
                  {isUploading ? 'Uploading...' : 'Save Product'}
                </button>
              </form>
            </div>
            {/* Product List with reorder */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-lg font-bold text-gray-800">Current Goods</h2>
                <p className="text-xs text-gray-400">Use arrows to reorder</p>
              </div>
              {productsLoading ? <p>Loading...</p> : (
                <div className="flex flex-col gap-3">
                  {products.map((p, index) => (
                    <div key={p.id} className="bg-white rounded-lg shadow border p-3">
                      {editingProduct && editingProduct.id === p.id ? (
                        /* EDIT MODE */
                        <div className="space-y-2">
                          <img src={p.image_url} alt={p.name} className="w-full h-32 object-cover rounded bg-gray-100" />
                          <input type="text" className="w-full border px-2 py-1 rounded text-sm" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} placeholder="English Name" />
                          <input type="text" className="w-full border px-2 py-1 rounded text-sm" value={editingProduct.label} onChange={e => setEditingProduct({...editingProduct, label: e.target.value})} placeholder="Tamil Name" />
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-xs text-gray-500">MRP (Rs.)</label>
                              <input type="number" className="w-full border px-2 py-1 rounded text-sm" value={editingProduct.mrp || ''} onChange={e => setEditingProduct({...editingProduct, mrp: e.target.value})} placeholder="MRP" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">Price (Rs.)</label>
                              <input type="number" className="w-full border px-2 py-1 rounded text-sm" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} placeholder="Price" />
                            </div>
                            <div>
                              <label className="text-xs text-red-500">Special Offer</label>
                              <input type="number" className="w-full border-2 border-red-200 px-2 py-1 rounded text-sm" value={editingProduct.special_offer || ''} onChange={e => setEditingProduct({...editingProduct, special_offer: e.target.value})} placeholder="Offer Rs." />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={handleSaveEdit} className="flex-1 bg-agri-green text-white py-1.5 rounded text-sm font-bold hover:bg-green-800">Save</button>
                            <button onClick={() => setEditingProduct(null)} className="flex-1 bg-gray-200 text-gray-700 py-1.5 rounded text-sm font-bold hover:bg-gray-300">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        /* VIEW MODE */
                        <div className="flex gap-3 items-center">
                          {/* Reorder arrows */}
                          <div className="flex flex-col gap-1 flex-shrink-0">
                            <button onClick={() => moveProduct(index, -1)} disabled={index === 0} className="text-gray-400 hover:text-agri-green disabled:opacity-20 p-0.5">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
                            </button>
                            <span className="text-xs text-gray-300 text-center">{index + 1}</span>
                            <button onClick={() => moveProduct(index, 1)} disabled={index === products.length - 1} className="text-gray-400 hover:text-agri-green disabled:opacity-20 p-0.5">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                            </button>
                          </div>
                          <img src={p.image_url} alt={p.name} className="w-16 h-16 aspect-square object-cover rounded shadow-sm bg-gray-100 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate">{p.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{p.label}</p>
                            <div className="mt-0.5">
                              {p.mrp && <p className="text-xs text-gray-400">MRP: <span className="line-through">Rs.{p.mrp}</span></p>}
                              {p.special_offer && p.special_offer < p.price ? (
                                <>
                                  <p className="text-xs text-gray-400">Price: <span className="line-through">Rs.{p.price}</span></p>
                                  <p className="text-sm font-bold text-red-600">Offer: Rs.{p.special_offer}</p>
                                </>
                              ) : (
                                <p className="text-sm font-bold text-agri-gold">Rs.{p.price}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5 flex-shrink-0">
                            <button onClick={() => setEditingProduct({...p})} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            </button>
                            <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminDashboard;
