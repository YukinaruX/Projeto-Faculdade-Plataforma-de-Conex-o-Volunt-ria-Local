import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import CreateOpportunity from './pages/CreateOpportunity';
import Auth from './pages/Auth';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Check for persisted session on load (simulated)
  useEffect(() => {
    const savedUser = localStorage.getItem('connect_causa_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('connect_causa_session', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('connect_causa_session');
  };

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth mode="login" onLogin={handleLogin} />} />
          <Route path="/register" element={<Auth mode="register" onLogin={handleLogin} />} />
          
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/explore" 
            element={user ? <Explore user={user} /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/create-opportunity" 
            element={
              user && user.role === 'organization' 
                ? <CreateOpportunity user={user} /> 
                : <Navigate to="/dashboard" />
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;