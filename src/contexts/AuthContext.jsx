import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(MOCK_USERS);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email, password) => {
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
  };

  const isAuthenticated = () => {
    return localStorage.getItem("isAuthenticated") === "true" && user !== null;
  };

  const hasRole = (requiredRole) => {
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

  const value = {
    user,
    users: getAllUsers(),
    login,
    logout,
    isAuthenticated,
    hasRole,
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
