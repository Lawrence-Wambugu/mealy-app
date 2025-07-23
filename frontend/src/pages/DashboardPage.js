import React, { useEffect, useState, useRef } from 'react';
import CustomNavbar from '../components/CustomNavbar';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../store/authSlice';
import Modal from 'react-modal';
import axios from 'axios';
import { useSelector } from 'react-redux';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8'; // Inserted a sample API key, replace with your actual key if needed

const DashboardPage = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutSuccess());
    window.location.href = '/login';
  };
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderState, setOrderState] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const [addressFields, setAddressFields] = useState({});

  useEffect(() => {
    // Removed Google Maps Places Autocomplete integration
  }, []);
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/meals');
        setMeals(response.data);
      } catch (err) {
        setError('Failed to fetch meals');
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const handleOrderChange = (mealId, field, value) => {
    setOrderState(prev => ({
      ...prev,
      [mealId]: {
        ...prev[mealId],
        [field]: value,
      },
    }));
  };

  const handleOrder = async (mealId) => {
    const order = orderState[mealId];
    const address = addressFields[mealId];
    if (!order || !order.phone || !address || !address.place || !address.road || !address.house || !order.delivery_date) {
      alert('Please fill all order details.');
      return;
    }
    // Force date to YYYY-MM-DD string
    let deliveryDate = order.delivery_date;
    if (deliveryDate) {
      const d = new Date(deliveryDate);
      if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        deliveryDate = `${yyyy}-${mm}-${dd}`;
      }
    }
    const delivery_address = `${address.place}, ${address.road}, House No. ${address.house}`;
    const payload = {
      meal_id: mealId,
      phone: order.phone,
      delivery_address,
      delivery_date: deliveryDate,
    };
    console.log('Order payload:', payload);
    try {
      await axios.post('http://localhost:5000/orders', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrderSuccess('Order placed successfully!');
      setOrderState(prev => ({ ...prev, [mealId]: {} }));
    } catch (err) {
      setOrderSuccess('Failed to place order.');
      console.error('Order error:', err);
    }
  };

  if (loading) return <div>Loading meals...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{background:'#f8f8f8', minHeight:'100vh'}}>
      <CustomNavbar type="customer" onLogout={handleLogout} />
      <h1 style={{textAlign:'center', color:'#FFA500', margin:'2rem 0 1rem'}}>Customer Dashboard</h1>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',margin:'2rem 0'}}>
        <img src="https://i.pinimg.com/736x/cd/46/dd/cd46dda11eec042b2cfc2ec6c497f5ce.jpg" alt="Mealy Logo" style={{height:'56px',marginRight:'18px',borderRadius:'8px'}} />
        <span style={{fontSize:'2.8rem',fontWeight:'bold',color:'#FFA500',letterSpacing:'2px'}}>Mealy</span>
      </div>
      <h2 style={{textAlign:'center', color:'#333'}}>Available Meals</h2>
      {orderSuccess && <div style={{textAlign:'center', color:'#28a745', fontWeight:'bold'}}>{orderSuccess}</div>}
      {meals.length === 0 ? (
        <p style={{textAlign:'center'}}>No meals available.</p>
      ) : (
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))',
          gap:'2rem',
          padding:'2rem',
          maxWidth:'1200px',
          margin:'2rem auto'
        }}>
          {meals.map(meal => (
            <div key={meal.id} style={{background:'#fff', borderRadius:'12px', boxShadow:'0 2px 12px #eee', padding:'2rem', display:'flex', flexDirection:'column', alignItems:'center', minHeight:'420px'}}>
              <h2 style={{color:'#FFA500', marginBottom:'0.5rem'}}>{meal.name}</h2>
              {meal.image_url && <img src={meal.name === 'Vegetarian Pasta Primavera' ? `${meal.image_url}?cachebust=${Date.now()}` : meal.image_url} alt={meal.name} style={{width:'220px', height:'160px', objectFit:'cover', borderRadius:'12px', marginBottom:'1rem', boxShadow:'0 2px 8px #ddd'}} />}
              <p style={{fontSize:'1.1rem', color:'#555', marginBottom:'0.5rem'}}>{meal.description}</p>
              <p style={{fontWeight:'bold', color:'#333', marginBottom:'0.5rem'}}>Price: <span style={{color:'#FFA500'}}>Kes {meal.price}</span></p>
              {meal.sides && <p style={{color:'#888', marginBottom:'1rem'}}>Sides: {Array.isArray(meal.sides) ? meal.sides.join(', ') : meal.sides}</p>}
              <button
                style={{
                  backgroundColor: '#FFA500',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 32px',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  marginTop: 'auto',
                  fontWeight:'bold',
                  boxShadow:'0 2px 8px #eee',
                  transition: 'background 0.3s',
                  letterSpacing:'0.5px'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#e69500'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#FFA500'}
                onClick={() => { setSelectedMeal(meal.id); setModalOpen(true); }}
              >Order</button>
            </div>
          ))}
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={{
          overlay: { backgroundColor: 'rgba(0,0,0,0.4)' },
          content: {
            maxWidth: '420px',
            margin: 'auto',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          }
        }}
        ariaHideApp={false}
      >
        <h2 style={{color:'#FFA500', textAlign:'center', marginBottom:'1.5rem'}}>Place Your Order</h2>
        <form onSubmit={e => {e.preventDefault(); handleOrder(selectedMeal); setModalOpen(false);}}>
          <input
            type="text"
            placeholder="Phone Number"
            value={orderState[selectedMeal]?.phone || ''}
            onChange={e => handleOrderChange(selectedMeal, 'phone', e.target.value)}
            required
            style={{ width: '100%', padding: '1rem', marginBottom: '1.2rem', borderRadius: '8px', border: '1px solid #ccc', fontSize:'1rem' }}
          />
          <input
            type="text"
            placeholder="Place (e.g. Westlands, CBD)"
            value={addressFields[selectedMeal]?.place || ''}
            onChange={e => setAddressFields(prev => ({ ...prev, [selectedMeal]: { ...prev[selectedMeal], place: e.target.value } }))}
            style={{width:'100%',padding:'0.8rem',marginBottom:'0.5rem',borderRadius:'6px',border:'1px solid #ccc'}}
          />
          <input
            type="text"
            placeholder="Road Name or Apartment"
            value={addressFields[selectedMeal]?.road || ''}
            onChange={e => setAddressFields(prev => ({ ...prev, [selectedMeal]: { ...prev[selectedMeal], road: e.target.value } }))}
            style={{width:'100%',padding:'0.8rem',marginBottom:'0.5rem',borderRadius:'6px',border:'1px solid #ccc'}}
          />
          <input
            type="text"
            placeholder="House Number"
            value={addressFields[selectedMeal]?.house || ''}
            onChange={e => setAddressFields(prev => ({ ...prev, [selectedMeal]: { ...prev[selectedMeal], house: e.target.value } }))}
            style={{width:'100%',padding:'0.8rem',marginBottom:'1rem',borderRadius:'6px',border:'1px solid #ccc'}}
          />
          <input
            type="date"
            placeholder="Delivery Date"
            value={orderState[selectedMeal]?.delivery_date || ''}
            onChange={e => handleOrderChange(selectedMeal, 'delivery_date', e.target.value)}
            required
            style={{ width: '100%', padding: '1rem', marginBottom: '1.2rem', borderRadius: '8px', border: '1px solid #ccc', fontSize:'1rem' }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#FFA500',
              color: '#fff',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              width: '100%',
              marginTop: '1rem',
              fontWeight:'bold',
              boxShadow:'0 2px 8px #eee',
              transition: 'background 0.3s',
              letterSpacing:'0.5px'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#e69500'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#FFA500'}
          >Place Order</button>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;

