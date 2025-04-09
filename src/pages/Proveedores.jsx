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
  obtenerProveedores,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
} from "../services/proveedoresService";

const Proveedores = () => {
  const [open, setOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [proveedorEditandoId, setProveedorEditandoId] = useState(null);
  const [proveedores, setProveedores] = useState([]);

  const [nuevoProveedor, setNuevoProveedor] = useState({
    cedula_proveedor: "",
    nombre_proveedor: "",
    direccion_proveedor: "",
    telefono_proveedor: "",
    email_proveedor: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarTipo, setSnackbarTipo] = useState("success");

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const data = await obtenerProveedores();
      setProveedores(data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };

  const handleOpen = () => {
    setModoEdicion(false);
    setNuevoProveedor({
      cedula_proveedor: "",
      nombre_proveedor: "",
      direccion_proveedor: "",
      telefono_proveedor: "",
      email_proveedor: "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModoEdicion(false);
    setProveedorEditandoId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProveedor((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    try {
      const proveedorFormateado = {
        ...nuevoProveedor,
        cedula_proveedor: parseInt(nuevoProveedor.cedula_proveedor, 10),
      };
  
      console.log("Proveedor a guardar:", proveedorFormateado);
  
      if (modoEdicion) {
        const actualizado = await actualizarProveedor(proveedorEditandoId, proveedorFormateado);
        setProveedores((prev) =>
          prev.map((p) => (p.cedula_proveedor === proveedorEditandoId ? actualizado : p))
        );
        setSnackbarMsg("Proveedor actualizado correctamente.");
      } else {
        const nuevo = await crearProveedor(proveedorFormateado);
        setProveedores((prev) => [...prev, nuevo]);
        setSnackbarMsg("Proveedor creado correctamente.");
      }
  
      setSnackbarTipo("success");
      setSnackbarOpen(true);
      handleClose();
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
      setSnackbarMsg("Error al guardar proveedor.");
      setSnackbarTipo("error");
      setSnackbarOpen(true);
    }
  };

  const handleEliminar = async (id) => {
    const confirmacion = confirm("¿Deseas eliminar este proveedor?");
    if (confirmacion) {
      try {
        await eliminarProveedor(id);
        setProveedores((prev) =>
          prev.filter((p) => p.cedula_proveedor !== id)
        );
        setSnackbarMsg("Proveedor eliminado correctamente.");
        setSnackbarTipo("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error al eliminar proveedor:", error);
        setSnackbarMsg("Error al eliminar proveedor.");
        setSnackbarTipo("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleEditar = (proveedor) => {
    setModoEdicion(true);
    setProveedorEditandoId(proveedor.cedula_proveedor);
    setNuevoProveedor({ ...proveedor });
    setOpen(true);
  };

  return (
    <>
      <SectionLayout title="Gestión de Proveedores">
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Agregar Proveedor
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cédula</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proveedores.map((proveedor) => (
                <TableRow key={proveedor.cedula_proveedor}>
                  <TableCell>{proveedor.cedula_proveedor}</TableCell>
                  <TableCell>{proveedor.nombre_proveedor}</TableCell>
                  <TableCell>{proveedor.direccion_proveedor}</TableCell>
                  <TableCell>{proveedor.telefono_proveedor}</TableCell>
                  <TableCell>{proveedor.email_proveedor}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditar(proveedor)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleEliminar(proveedor.cedula_proveedor)}>
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
          <DialogTitle>{modoEdicion ? "Editar Proveedor" : "Agregar Proveedor"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Cédula"
              name="cedula_proveedor"
              fullWidth
              margin="normal"
              value={nuevoProveedor.cedula_proveedor}
              onChange={handleChange}
              disabled={modoEdicion}
            />
            <TextField
              label="Nombre"
              name="nombre_proveedor"
              fullWidth
              margin="normal"
              value={nuevoProveedor.nombre_proveedor}
              onChange={handleChange}
            />
            <TextField
              label="Dirección"
              name="direccion_proveedor"
              fullWidth
              margin="normal"
              value={nuevoProveedor.direccion_proveedor}
              onChange={handleChange}
            />
            <TextField
              label="Teléfono"
              name="telefono_proveedor"
              fullWidth
              margin="normal"
              value={nuevoProveedor.telefono_proveedor}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email_proveedor"
              fullWidth
              margin="normal"
              value={nuevoProveedor.email_proveedor}
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

export default Proveedores;