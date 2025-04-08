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
      nombre: "",
      correo: "",
      telefono: "",
    });

    // 1. Cargar datos del backend
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
      setNuevoCliente({ nombre: "", correo: "", telefono: "" }); // limpiar
      setOpen(true);
    };
  
    const handleClose = () => setOpen(false);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setNuevoCliente((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleGuardar = async () => {
      try {
        const nuevo = await crearCliente(nuevoCliente);
        setClientes((prev) => [...prev, nuevo]);
        handleClose();
      } catch (error) {
        console.error("Error al crear cliente:", error);
      }
    };

    const handleEliminar = async (id) => {
        const confirmacion = confirm("¿Estás seguro de que quieres eliminar este cliente?");
        if (!confirmacion) return;

        try {
          await eliminarCliente(id);
          setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
        } catch (error) {
          console.error("Error al eliminar cliente:", error);
        }
    };
  
    return (
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
                    <TableCell>Nombre</TableCell>
                    <TableCell>Correo</TableCell>
                    <TableCell>Teléfono</TableCell>
                    <TableCell>Acciones</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                    <TableCell>{cliente.nombre}</TableCell>
                    <TableCell>{cliente.correo}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>
                        <IconButton
                            color="error"
                            onClick={() => handleEliminar(cliente.id)}
                            >
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
              label="Nombre"
              name="nombre"
              fullWidth
              margin="normal"
              value={nuevoCliente.nombre}
              onChange={handleChange}
            />
            <TextField
              label="Correo"
              name="correo"
              fullWidth
              margin="normal"
              value={nuevoCliente.correo}
              onChange={handleChange}
            />
            <TextField
              label="Teléfono"
              name="telefono"
              fullWidth
              margin="normal"
              value={nuevoCliente.telefono}
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
    );
  };
  
  export default Clientes;