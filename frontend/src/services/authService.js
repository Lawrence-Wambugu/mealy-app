import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://mealy-app-ajxu.onrender.com'; // Render backend URL fallback

const signup = (name, username, email, phone, password, isAdmin) => {
  return axios.post(`${API_URL}/register`, {
    name,
    username,
    email,
    phone,
    password,
    is_admin: isAdmin,
  });
};

const login = (username, password) => {
  return axios
    .post(`${API_URL}/login`, {
      username,
      password,
    })
    .then((response) => {
      if (response.data.access_token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  signup,
  login,
  logout,
};

export default authService;