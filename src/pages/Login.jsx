import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [cedula, setCedula] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", tipo: "info" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!cedula || !contrasena) {
      setSnackbar({
        open: true,
        msg: "Debes ingresar ambos campos",
        tipo: "warning",
      });
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/brontisandwich/usuarios/${cedula}`);
      const usuario = response.data;

      if (usuario.contrasena === contrasena) {
        localStorage.setItem("usuario", JSON.stringify(usuario));
        setSnackbar({
          open: true,
          msg: `Bienvenido ${usuario.nombre}`,
          tipo: "success",
        });
        setTimeout(() => navigate("/"), 1000);
      } else {
        setSnackbar({
          open: true,
          msg: "Contraseña incorrecta",
          tipo: "error",
        });
      }
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      setSnackbar({
        open: true,
        msg: "Usuario no encontrado",
        tipo: "error",
      });
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Paper elevation={4} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>

        <TextField
          label="Cédula"
          variant="outlined"
          fullWidth
          margin="normal"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Ingresar
        </Button>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.tipo}
          sx={{ width: "100%" }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}