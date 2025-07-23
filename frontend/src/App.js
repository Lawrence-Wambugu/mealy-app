import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GlobalStyle from './components/GlobalStyle';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CatererSignupPage from './pages/CatererSignupPage';
import DashboardPage from './pages/DashboardPage';
import CatererDashboardPage from './pages/CatererDashboardPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import MealsPage from './pages/MealsPage';
import ViewOrdersPage from './pages/ViewOrdersPage';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/caterer-signup" element={<CatererSignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/caterer-dashboard" element={<CatererDashboardPage />} />
        <Route path="/orders" element={<CustomerOrdersPage />} />
        <Route path="/meals" element={<MealsPage />} />
        <Route path="/orders-received" element={<ViewOrdersPage />} />
      </Routes>
    </Router>
  );
}

export default App; 