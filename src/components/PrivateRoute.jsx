import { Navigate } from "react-router-dom";

// Este componente envuelve las rutas privadas
export default function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem("usuario"); // puedes ajustar a la key que uses para guardar sesión

  if (!isAuthenticated) {
    // Si no está autenticado, lo redirige al login
    return <Navigate to="/login" replace />;
  }

  // Si sí está autenticado, renderiza la vista
  return children;
}