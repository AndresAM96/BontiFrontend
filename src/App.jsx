import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import Proveedores from "./pages/Proveedores";
import Usuarios from "./pages/Usuarios";
import NuevaVenta from "./pages/ventas/NuevaVenta";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import RutaProtegidaAdmin from "./components/RutaProtegidaAdmin"; // 👈

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route index element={<Home />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="productos" element={<Productos />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="ventas/nueva" element={<NuevaVenta />} />
          <Route path="proveedores" element={<Proveedores />} />

          {/* Protegida solo para admin */}
          <Route
            path="usuarios"
            element={
              <RutaProtegidaAdmin>
                <Usuarios />
              </RutaProtegidaAdmin>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;