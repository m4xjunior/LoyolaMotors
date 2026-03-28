import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const ContextoAutenticacion = createContext(null);

// Mock users data - in a real app, this would come from an API
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@lexusfx.com",
    password: "Admin2025",
    nombre: "Administrador",
    apellidos: "Sistema",
    rol: "admin",
    activo: true,
    fechaCreacion: new Date("2024-01-01"),
    ultimoAcceso: new Date(),
  },
  {
    id: "2",
    email: "empleado@loyolamotors.com",
    password: "empleado123",
    nombre: "Juan",
    apellidos: "Pérez",
    rol: "empleado",
    activo: true,
    fechaCreacion: new Date("2024-02-01"),
    ultimoAcceso: new Date(),
  },
];

export const ProveedorAutenticacion = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(MOCK_USERS);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("isAuthenticated");
      }
    }
    setLoading(false);
  }, []);

  // Cross-tab logout sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "isAuthenticated" && e.newValue === null) {
        setUser(null);
      }
      if (e.key === "currentUser" && e.newValue === null) {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const iniciarSesion = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        const foundUser = users.find(
          (u) => u.email === email && u.password === password && u.activo,
        );

        if (foundUser) {
          const userSession = {
            id: foundUser.id,
            email: foundUser.email,
            nombre: foundUser.nombre,
            apellidos: foundUser.apellidos,
            rol: foundUser.rol,
          };

          setUser(userSession);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("currentUser", JSON.stringify(userSession));

          // Update last access
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.id === foundUser.id ? { ...u, ultimoAcceso: new Date() } : u,
            ),
          );

          resolve(userSession);
        } else {
          reject(new Error("Credenciales incorrectas o usuario inactivo"));
        }
      }, 500);
    });
  };

  const cerrarSesion = () => {
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
  };

  const estaAutenticado = () => {
    return localStorage.getItem("isAuthenticated") === "true" && user !== null;
  };

  const tieneRol = (requiredRole) => {
    if (!user) return false;
    if (requiredRole === "admin") return user.rol === "admin";
    if (requiredRole === "empleado")
      return user.rol === "admin" || user.rol === "empleado";
    return true;
  };

  const createUser = (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = users.find((u) => u.email === userData.email);
        if (existingUser) {
          reject(new Error("Ya existe un usuario con este email"));
          return;
        }

        const newUser = {
          id: Date.now().toString(),
          ...userData,
          activo: true,
          fechaCreacion: new Date(),
          ultimoAcceso: null,
        };

        setUsers((prevUsers) => [...prevUsers, newUser]);
        resolve(newUser);
      }, 500);
    });
  };

  const updateUser = (userId, userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = users.findIndex((u) => u.id === userId);
        if (userIndex === -1) {
          reject(new Error("Usuario no encontrado"));
          return;
        }

        const updatedUsers = [...users];
        updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...userData };
        setUsers(updatedUsers);

        // Update current user session if it's the same user
        if (user && user.id === userId) {
          const updatedUser = { ...user, ...userData };
          setUser(updatedUser);
          localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        }

        resolve(updatedUsers[userIndex]);
      }, 500);
    });
  };

  const deleteUser = (userId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user && user.id === userId) {
          reject(new Error("No puedes eliminar tu propio usuario"));
          return;
        }

        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
        resolve(true);
      }, 500);
    });
  };

  const getAllUsers = () => {
    return users.filter((u) => u.activo);
  };

  // Aliases for backward compatibility
  const login = iniciarSesion;
  const logout = cerrarSesion;
  const isAuthenticated = estaAutenticado;
  const hasRole = tieneRol;

  const value = {
    user,
    loading,
    users: getAllUsers(),
    iniciarSesion,
    cerrarSesion,
    estaAutenticado,
    tieneRol,
    // backward-compat aliases
    login,
    logout,
    isAuthenticated,
    hasRole,
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
  };

  return <ContextoAutenticacion.Provider value={value}>{children}</ContextoAutenticacion.Provider>;
};

ProveedorAutenticacion.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAutenticacion = () => {
  const context = useContext(ContextoAutenticacion);
  if (!context) {
    throw new Error("useAutenticacion debe ser usado dentro de un ProveedorAutenticacion");
  }
  return context;
};
