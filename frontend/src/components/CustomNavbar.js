import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = ({ type, onLogout }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    onLogout();
    navigate('/');
  };
  return (
    <NavBarContainer caterer={type === 'caterer'}>
      <NavButtons>
        {type === 'customer' && (
          <>
            <NavButton onClick={() => navigate('/')}>Home</NavButton>
            <NavButton onClick={() => navigate('/orders')}>My Orders</NavButton>
            <NavButtonLogout onClick={handleLogout}>Logout</NavButtonLogout>
          </>
        )}
        {type === 'caterer' && (
          <>
            <NavButton onClick={() => navigate('/caterer-dashboard')}>Home</NavButton>
            <NavButton onClick={() => navigate('/orders-received')}>Orders Received</NavButton>
            <NavButtonLogout onClick={handleLogout}>Logout</NavButtonLogout>
          </>
        )}
      </NavButtons>
    </NavBarContainer>
  );
};

// Styled Components         
const NavBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: ${props => props.caterer ? 'none' : '#fff'};
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 0.5rem 2rem;
  margin-bottom: 2rem;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button`
  background: #FFA500;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  box-shadow: 0 2px 8px #eee;
  letter-spacing: 0.5px;
  &:hover {
    background: #e69500;
  }
`;

const NavButtonLogout = styled(NavButton)`
  background: #dc3545;
  &:hover {
    background: #a71d2a;
  }
`;

export default CustomNavbar;
