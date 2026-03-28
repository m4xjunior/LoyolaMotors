
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
<<<<<<<< HEAD:src/componentes/RutaProtegida/RutaProtegida.jsx
import { useAutenticacion } from '../../contextos/ContextoAutenticacion';
========
import { useAuth } from '../../contextos/ContextoAutenticacao';
>>>>>>>> origin/main:src/componentes/RotaProtegida/RotaProtegida.jsx

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { estaAutenticado, tieneRol, loading } = useAutenticacion();
  const location = useLocation();

  // Wait for auth state to be restored from localStorage
  if (loading) {
    return null;
  }

  if (!estaAutenticado()) {
    // Redirect them to the /inicio-sesion page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login.
    return <Navigate to="/inicio-sesion" state={{ from: location }} replace />;
  }

  if (requiredRole && !tieneRol(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

export default ProtectedRoute;
