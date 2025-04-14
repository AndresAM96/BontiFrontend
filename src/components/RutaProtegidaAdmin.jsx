import { Navigate } from "react-router-dom";

const RutaProtegidaAdmin = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (usuario.rol !== "Admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default RutaProtegidaAdmin;