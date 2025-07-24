import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useSelector } from 'react-redux';

const OrdersContainer = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
`;

const Th = styled.th`
  border-bottom: 2px solid #ccc;
  padding: 1rem;
  text-align: left;
`;

const Td = styled.td`
  border-bottom: 1px solid #ccc;
  padding: 1rem;
`;

const ViewPlacedOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'https://mealy-app-ajxu.onrender.com';
        const response = await axios.get(`${API_URL}/orders/customer`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <OrdersContainer>
      <h1>Your Placed Orders</h1>
      <Table>
        <thead>
          <tr>
            <Th>Order ID</Th>
            <Th>Meal</Th>
            <Th>Delivery Date</Th>
            <Th>Delivery Address</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <Td>{order.id}</Td>
              <Td>{order.meal}</Td>
              <Td>{new Date(order.delivery_date).toLocaleDateString()}</Td>
              <Td>{order.delivery_address}</Td>
              <Td>{order.is_delivered ? 'Delivered' : 'Pending'}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </OrdersContainer>
  );
};

export default ViewPlacedOrdersPage;
