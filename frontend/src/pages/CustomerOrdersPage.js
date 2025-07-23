import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view orders.');
      setLoading(false);
      return;
    }
    axios.get('http://localhost:5000/orders/customer', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        // Sort orders by most recent (highest id first)
        const sorted = [...res.data].sort((a, b) => b.id - a.id);
        setOrders(sorted);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch orders');
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div>Loading your orders...</div>;
  if (error) return <div style={{color:'red'}}>Error: {error}</div>;

  return (
    <div style={{maxWidth:900,margin:'2rem auto',padding:'2rem',background:'#fff',borderRadius:16,boxShadow:'0 4px 24px #eee'}}>
      <h2 style={{textAlign:'center',color:'#FFA500',marginBottom:'2rem',fontWeight:'bold',fontSize:'2rem',letterSpacing:'1px'}}>My Orders</h2>
      {orders.length === 0 ? (
        <p style={{textAlign:'center',color:'#888',fontSize:'1.2rem'}}>You have not placed any orders yet.</p>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(340px, 1fr))',gap:'2rem'}}>
          {orders.map(order => (
            <div key={order.id} style={{background:'#f9f9f9',borderRadius:'12px',boxShadow:'0 2px 12px #eee',padding:'2rem',display:'flex',flexDirection:'column',alignItems:'flex-start',minHeight:'220px',position:'relative'}}>
              <div style={{position:'absolute',top:'1.2rem',right:'1.2rem',background:order.is_delivered?'#28a745':'#FFA500',color:'#fff',padding:'0.4rem 1rem',borderRadius:'8px',fontWeight:'bold',fontSize:'0.95rem'}}>
                {order.is_delivered ? 'Delivered' : 'Pending'}
              </div>
              <h3 style={{color:'#FFA500',marginBottom:'0.7rem',fontWeight:'bold',fontSize:'1.3rem'}}>Order #{order.id}</h3>
              {order.image_url && (
                <img src={order.image_url} alt={order.meal} style={{width:'180px',height:'120px',objectFit:'cover',borderRadius:'10px',marginBottom:'1rem',boxShadow:'0 2px 8px #ddd'}} />
              )}
              <div style={{marginBottom:'0.5rem',fontSize:'1.1rem',color:'#333'}}><b>Meal:</b> {order.meal}</div>
              <div style={{marginBottom:'0.5rem',fontSize:'1.1rem',color:'#555'}}><b>Order Placed:</b> {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</div>
              <div style={{marginBottom:'0.5rem',fontSize:'1.1rem',color:'#555'}}><b>Delivery Date:</b> {order.delivery_date}</div>
              <div style={{marginBottom:'0.5rem',fontSize:'1.1rem',color:'#555'}}><b>Address:</b> {order.delivery_address}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrdersPage;
