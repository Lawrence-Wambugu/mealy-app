import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const LoginPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const LoginForm = styled.form`
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

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.login(username, password);
      const decodedToken = jwtDecode(data.access_token);
      const user = { username: decodedToken.sub.username, isAdmin: decodedToken.sub.is_admin };
      
      dispatch(loginSuccess({ token: data.access_token, user }));

      if (user.isAdmin) {
        navigate('/caterer-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <LoginPageContainer>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',margin:'2rem 0'}}>
        <img src="https://i.pinimg.com/736x/cd/46/dd/cd46dda11eec042b2cfc2ec6c497f5ce.jpg" alt="Mealy Logo" style={{height:'56px',marginRight:'18px',borderRadius:'8px'}} />
        <span style={{fontSize:'2.8rem',fontWeight:'bold',color:'#FFA500',letterSpacing:'2px'}}>Mealy</span>
      </div>
      <h1>Login</h1>
      <LoginForm onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </LoginForm>
    </LoginPageContainer>
  );
};

export default LoginPage;
