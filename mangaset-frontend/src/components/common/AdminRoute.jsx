// src/components/common/AdminRoute.jsx
// Protects routes that require is_staff=true.
// Non-admin authenticated users are redirected to home with an error toast.
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container mt-5">
        <LoadingSpinner text="Vérification des permissions..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user?.is_staff && !user?.is_superuser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
