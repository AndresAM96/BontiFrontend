import { useEffect, useState } from "react";
import {
    Snackbar,
    Alert,
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
  } from "@mui/material";
  import SectionLayout from "../components/SectionLayout";
  import DeleteIcon from "@mui/icons-material/Delete";
  import IconButton from "@mui/material/IconButton";
  import {
    obtenerClientes,
    crearCliente,
    eliminarCliente,
  } from "../services/clientesService";
  
  const Clientes = () => {
    const [open, setOpen] = useState(false);
  
    const [clientes, setClientes] = useState([]);
  
    const [nuevoCliente, setNuevoCliente] = useState({
      cedula_cliente: "",
      nombre_cliente: "",
      direccion_cliente: "",
      telefono_cliente: "",
      email_cliente: "",
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    
    const [snackbarMsg, setSnackbarMsg] = useState("");
    
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

    // Cargar datos del backend
    useEffect(() => {
      fetchClientes();
    }, []);

    const fetchClientes = async () => {
      try {
        const data = await obtenerClientes();
        setClientes(data);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };
  
    const handleOpen = () => {
      setNuevoCliente({
        cedula_cliente: "",
        nombre_cliente: "",
        direccion_cliente: "",
        telefono_cliente: "",
        email_cliente: "",
      });
      setOpen(true);
    };
  
    const handleClose = () => setOpen(false);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setNuevoCliente((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleGuardar = async () => {
      try {
        console.log("Cliente a guardar:", nuevoCliente);
        const nuevo = await crearCliente(nuevoCliente);
        setClientes((prev) => [...prev, nuevo]);
        handleClose();
      } catch (error) {
        console.error("Error al crear cliente:", error);
      }
    };

    const handleEliminar = (id) => {
      setConfirmDelete({ open: true, id });
    };
    
    const confirmarEliminacion = async () => {
      try {
        await eliminarCliente(confirmDelete.id);
        setClientes((prev) =>
          prev.filter((cliente) => cliente.cedula_cliente !== confirmDelete.id)
        );
        setSnackbarMsg("Cliente eliminado correctamente.");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        setSnackbarMsg("Error al eliminar cliente.");
        setSnackbarOpen(true);
      } finally {
        setConfirmDelete({ open: false, id: null });
      }
    };
  
    return (
      <>
      <SectionLayout title="Gestión de Clientes">
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Agregar Cliente
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
              {clientes.map((cliente) => (
                <TableRow key={cliente.cedula_cliente}>
                  <TableCell>{cliente.cedula_cliente}</TableCell>
                  <TableCell>{cliente.nombre_cliente}</TableCell>
                  <TableCell>{cliente.direccion_cliente}</TableCell>
                  <TableCell>{cliente.telefono_cliente}</TableCell>
                  <TableCell>{cliente.email_cliente}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleEliminar(cliente.cedula_cliente)}>
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
          <DialogTitle>Agregar Cliente</DialogTitle>
          <DialogContent>
            <TextField
              label="Cédula"
              name="cedula_cliente"
              fullWidth
              margin="normal"
              value={nuevoCliente.cedula_cliente}
              onChange={handleChange}
            />
            <TextField
              label="Nombre"
              name="nombre_cliente"
              fullWidth
              margin="normal"
              value={nuevoCliente.nombre_cliente}
              onChange={handleChange}
            />
            <TextField
              label="Dirección"
              name="direccion_cliente"
              fullWidth
              margin="normal"
              value={nuevoCliente.direccion_cliente}
              onChange={handleChange}
            />
            <TextField
              label="Teléfono"
              name="telefono_cliente"
              fullWidth
              margin="normal"
              value={nuevoCliente.telefono_cliente}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email_cliente"
              fullWidth
              margin="normal"
              value={nuevoCliente.email_cliente}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button variant="contained" color="primary" onClick={handleGuardar}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
        </SectionLayout>
        <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, id: null })}>
          <DialogTitle>¿Estás seguro de que deseas eliminar este cliente?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setConfirmDelete({ open: false, id: null })}>Cancelar</Button>
           <Button onClick={confirmarEliminacion} color="error" variant="contained">
            Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
          >
            {snackbarMsg}
          </Alert>
        </Snackbar>
      </>
    );
  };
  
  export default Clientes;