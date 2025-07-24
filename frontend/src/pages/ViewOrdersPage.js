import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useSelector } from 'react-redux';

const OrdersContainer = styled.div`
  padding: 2.5rem 1.5rem;
  max-width: 1100px;
  margin: 2.5rem auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px #eee;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 2rem;
  background: #faf9f6;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px #f3e6d1;
`;

const Th = styled.th`
  background: #FFA500;
  color: #fff;
  padding: 1.1rem 1rem;
  text-align: left;
  font-size: 1.08rem;
  font-weight: 600;
  border-bottom: 2px solid #FFA500;
`;

const Td = styled.td`
  padding: 1rem;
  font-size: 1.05rem;
  background: #fff;
  border-bottom: 1px solid #f3e6d1;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1.1rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.98rem;
  color: #fff;
  background: ${props => props.delivered ? '#28a745' : '#FFA500'};
`;

const ActionButton = styled.button`
  background-color: #FFA500;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: 500;
  &:hover {
    background: #e69500;
  }
`;

const ViewOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'https://mealy-app-ajxu.onrender.com';
        const response = await axios.get(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleMarkDelivered = async (orderId) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://mealy-app-ajxu.onrender.com';
      await axios.put(`${API_URL}/orders/${orderId}/delivered`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders => orders.map(o => o.id === orderId ? { ...o, is_delivered: true } : o));
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <OrdersContainer>
      <h1>Orders Received</h1>
      <Table>
        <thead>
          <tr>
            <Th>Order ID</Th>
            <Th>Customer Username</Th>
            <Th>Customer Name</Th>
            <Th>Phone</Th>
            <Th>Delivery Address</Th>
            <Th>Meal</Th>
            <Th>Delivery Date</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={order.id} style={{background: idx % 2 === 0 ? '#fff' : '#f8f8f8'}}>
              <Td>{order.id}</Td>
              <Td>{order.customer}</Td>
              <Td>{order.customer_name}</Td>
              <Td>{order.customer_phone}</Td>
              <Td>{order.delivery_address}</Td>
              <Td>{order.meal}</Td>
              <Td>{new Date(order.delivery_date).toLocaleDateString()}</Td>
              <Td><StatusBadge delivered={order.is_delivered}>{order.is_delivered ? 'Delivered' : 'Pending'}</StatusBadge></Td>
              <Td>
                {!order.is_delivered && (
                  <ActionButton
                    onClick={() => handleMarkDelivered(order.id)}
                  >Mark Delivered</ActionButton>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </OrdersContainer>
  );
};

export default ViewOrdersPage;

