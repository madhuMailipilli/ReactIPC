import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RoleBasedRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role || user?.userRole || user?.user_role;
  
  if (userRole === 'TENANT_ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (userRole === 'VP') {
    return <Navigate to="/vp" replace />;
  } else {
    return <Navigate to="/agent" replace />;
  }
};

export default RoleBasedRedirect;