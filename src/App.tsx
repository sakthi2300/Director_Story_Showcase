import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';


import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DirectorDashboard from './pages/director/DirectorDashboard';
import DirectorProfile from './pages/director/DirectorProfile';
import AddStory from './pages/director/AddStory';
import ProducerDashboard from './pages/producer/ProducerDashboard';
import ProducerProfile from './pages/producer/ProducerProfile';


const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode;
  requiredRole?: 'director' | 'producer';
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to the appropriate dashboard based on user's role
    return <Navigate to={`/${user?.role}/dashboard`} />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Director Routes */}
          <Route 
            path="/director/dashboard" 
            element={
              <ProtectedRoute requiredRole="director">
                <DirectorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/director/add-story" 
            element={
              <ProtectedRoute requiredRole="director">
                <AddStory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/director/profile" 
            element={
              <ProtectedRoute requiredRole="director">
                <DirectorProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Producer Routes */}
          <Route 
            path="/producer/dashboard" 
            element={
              <ProtectedRoute requiredRole="producer">
                <ProducerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/producer/profile" 
            element={
              <ProtectedRoute requiredRole="producer">
                <ProducerProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;