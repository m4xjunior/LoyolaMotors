
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAutenticacion } from '../../contextos/ContextoAutenticacion';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, hasRole, loading } = useAutenticacion();
  const location = useLocation();

  // Wait for auth state to be restored from localStorage
  if (loading) {
    return null;
  }

  if (!isAuthenticated()) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

export default ProtectedRoute;
