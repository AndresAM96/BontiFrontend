import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SectionLayout from "../components/SectionLayout";
import {
  obtenerUsuarios,
  crearUsuario,
  eliminarUsuario,
  actualizarUsuario,
} from "../services/usuariosService";

const Usuarios = () => {
  const [open, setOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioEditandoId, setUsuarioEditandoId] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    cedula_usuario: "",
    nombre: "",
    contrasena: "",
    rol: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarTipo, setSnackbarTipo] = useState("success");

  // Cargar usuarios desde backend
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleOpen = () => {
    setModoEdicion(false);
    setNuevoUsuario({
      cedula_usuario: "",
      nombre: "",
      contrasena: "",
      rol: "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModoEdicion(false);
    setUsuarioEditandoId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    try {
      if (modoEdicion) {
        const actualizado = await actualizarUsuario(usuarioEditandoId, nuevoUsuario);
        setUsuarios((prev) =>
          prev.map((u) => (u.cedula_usuario === usuarioEditandoId ? actualizado : u))
        );
        setSnackbarMsg("Usuario actualizado correctamente.");
      } else {
        const nuevo = await crearUsuario(nuevoUsuario);
        setUsuarios((prev) => [...prev, nuevo]);
        setSnackbarMsg("Usuario creado correctamente.");
      }
      setSnackbarTipo("success");
      setSnackbarOpen(true);
      handleClose();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      setSnackbarMsg("Error al guardar usuario.");
      setSnackbarTipo("error");
      setSnackbarOpen(true);
    }
  };

  const handleEliminar = async (id) => {
    const confirmacion = confirm("¿Deseas eliminar este usuario?");
    if (confirmacion) {
      try {
        await eliminarUsuario(id);
        setUsuarios((prev) => prev.filter((u) => u.cedula_usuario !== id));
        setSnackbarMsg("Usuario eliminado correctamente.");
        setSnackbarTipo("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        setSnackbarMsg("Error al eliminar usuario.");
        setSnackbarTipo("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleEditar = (usuario) => {
    setModoEdicion(true);
    setUsuarioEditandoId(usuario.cedula_usuario);
    setNuevoUsuario({ ...usuario });
    setOpen(true);
  };

  return (
    <>
      <SectionLayout title="Gestión de Usuarios">
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Agregar Usuario
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cédula</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Contraseña</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.cedula_usuario}>
                  <TableCell>{usuario.cedula_usuario}</TableCell>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.contrasena}</TableCell>
                  <TableCell>{usuario.rol}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditar(usuario)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleEliminar(usuario.cedula_usuario)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{modoEdicion ? "Editar Usuario" : "Agregar Usuario"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Cédula"
              name="cedula_usuario"
              fullWidth
              margin="normal"
              value={nuevoUsuario.cedula_usuario}
              onChange={handleChange}
              disabled={modoEdicion}
            />
            <TextField
              label="Nombre"
              name="nombre"
              fullWidth
              margin="normal"
              value={nuevoUsuario.nombre}
              onChange={handleChange}
            />
            <TextField
              label="Contraseña"
              name="contrasena"
              type="password"
              fullWidth
              margin="normal"
              value={nuevoUsuario.contrasena}
              onChange={handleChange}
            />
            <TextField
              label="Rol"
              name="rol"
              fullWidth
              margin="normal"
              value={nuevoUsuario.rol}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button variant="contained" color="primary" onClick={handleGuardar}>
              {modoEdicion ? "Guardar Cambios" : "Guardar"}
            </Button>
          </DialogActions>
        </Dialog>
      </SectionLayout>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarTipo}
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Usuarios;