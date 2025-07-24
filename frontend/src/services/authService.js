import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://mealy-app-ajxu.onrender.com'; // Render backend URL fallback

const signup = (name, username, email, phone, password, isAdmin) => {
  return axios.post(`