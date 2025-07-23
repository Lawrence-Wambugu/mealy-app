import React, { useState } from 'react';
import styled from 'styled-components';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const SignupPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: var(--secondary-color);
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const CatererSignupPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    try {
      await authService.signup(name, username, email, phone, password, true);
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <SignupPageContainer>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',margin:'2rem 0'}}>
        <img src="https://i.pinimg.com/736x/cd/46/dd/cd46dda11eec042b2cfc2ec6c497f5ce.jpg" alt="Mealy Logo" style={{height:'56px',marginRight:'18px',borderRadius:'8px'}} />
        <span style={{fontSize:'2.8rem',fontWeight:'bold',color:'#FFA500',letterSpacing:'2px'}}>Mealy</span>
      </div>
      <h1>Become a Caterer</h1>
      <SignupForm onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Business Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </SignupForm>
    </SignupPageContainer>
  );
};

export default CatererSignupPage;
