import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute — wraps routes that require authentication.
 * Redirects unauthenticated users to /login.
 * Shows a spinner while auth state is being initialised.
 */
export default function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner label="Verifying session..." />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
