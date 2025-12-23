import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import FarmerApp from './FarmerApp';
import BuyerApp from './BuyerApp';
import PolicymakerApp from './PolicymakerApp';
import ProcessorApp from './ProcessorApp';
import AuthPage from './components/AuthPage';
import ChatWidget from './components/ChatWidget';
import TraceabilityPrototype from './components/traceability/TraceabilityPrototype';
import api from './api';

function App() {
  // State to track the current user object
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTraceability, setShowTraceability] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking auth...");
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/user');
          console.log("User found:", res.data);
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Auth check failed", err);
          localStorage.removeItem('token');
        }
      } else {
        console.log("No token found");
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Handler to select role from Landing Page (Legacy/Demo mode)
  const handleRoleSelect = (role) => {
    if (role === 'traceability') {
      setShowTraceability(true);
    } else {
      setUser({ role, name: 'Demo User' });
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Handler to logout or switch roles
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setShowTraceability(false);
  };

  console.log("Render App: loading=", loading, "auth=", isAuthenticated, "user=", user);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (showTraceability) {
    return <TraceabilityPrototype onExit={() => setShowTraceability(false)} />;
  }

  return (
    <>
      <ChatWidget />
      {!isAuthenticated ? (
        <AuthPage onLogin={handleLogin} />
      ) : (
        <>
          {user?.role === 'farmer' && <FarmerApp user={user} onLogout={handleLogout} />}
          {user?.role === 'buyer' && <BuyerApp user={user} onLogout={handleLogout} />}
          {user?.role === 'policymaker' && <PolicymakerApp user={user} onLogout={handleLogout} />}
          {user?.role === 'processor' && <ProcessorApp user={user} onLogout={handleLogout} />}
          {/* Fallback if role is invalid but authenticated, though unlikely */}
          {!['farmer', 'buyer', 'policymaker', 'processor'].includes(user?.role) && <LandingPage onSelectRole={handleRoleSelect} />}
        </>
      )}
    </>
  );
}

export default App;