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
  obtenerProductos,
  crearProducto,
  eliminarProducto,
  actualizarProducto,
} from "../services/productosService";

const Productos = () => {
  const [open, setOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditandoId, setProductoEditandoId] = useState(null);
  const [productos, setProductos] = useState([]);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: "",
    descripcion: "",
    precio_venta: "",
    precio_compra: "",
    stock: "",
    stock_minimo: "",
    tipo_despacho: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarTipo, setSnackbarTipo] = useState("success");

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const data = await obtenerProductos();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const handleOpen = () => {
    setModoEdicion(false);
    setNuevoProducto({
      nombre_producto: "",
      descripcion: "",
      precio_venta: "",
      precio_compra: "",
      stock: "",
      stock_minimo: "",
      tipo_despacho: "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModoEdicion(false);
    setProductoEditandoId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    const productoParaEnviar = {
      ...nuevoProducto,
      precio_venta: Number(nuevoProducto.precio_venta),
      precio_compra: Number(nuevoProducto.precio_compra),
      stock: Number(nuevoProducto.stock),
      stock_minimo: Number(nuevoProducto.stock_minimo),
    };

    try {
      if (modoEdicion) {
        const actualizado = await actualizarProducto(productoEditandoId, productoParaEnviar);
        setProductos((prev) =>
          prev.map((p) => (p.id_producto === productoEditandoId ? actualizado : p))
        );
        setSnackbarMsg("Producto actualizado correctamente.");
      } else {
        const nuevo = await crearProducto(productoParaEnviar);
        setProductos((prev) => [...prev, nuevo]);
        setSnackbarMsg("Producto creado correctamente.");
      }
      setSnackbarTipo("success");
      setSnackbarOpen(true);
      handleClose();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      setSnackbarMsg("Error al guardar producto.");
      setSnackbarTipo("error");
      setSnackbarOpen(true);
    }
  };

  const handleEliminar = async (id) => {
    const confirmacion = confirm("¿Deseas eliminar este producto?");
    if (confirmacion) {
      try {
        await eliminarProducto(id);
        setProductos((prev) => prev.filter((p) => p.id_producto !== id));
        setSnackbarMsg("Producto eliminado correctamente.");
        setSnackbarTipo("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        setSnackbarMsg("Error al eliminar producto.");
        setSnackbarTipo("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleEditar = (producto) => {
    setModoEdicion(true);
    setProductoEditandoId(producto.id_producto);
    setNuevoProducto({ ...producto });
    setOpen(true);
  };

  return (
    <>
      <SectionLayout title="Gestión de Productos">
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Agregar Producto
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Precio Venta</TableCell>
                <TableCell>Precio Compra</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Stock Mínimo</TableCell>
                <TableCell>Tipo Despacho</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((producto) => (
                <TableRow key={producto.id_producto}>
                  <TableCell>{producto.nombre_producto}</TableCell>
                  <TableCell>{producto.descripcion}</TableCell>
                  <TableCell>${producto.precio_venta}</TableCell>
                  <TableCell>${producto.precio_compra}</TableCell>
                  <TableCell>{producto.stock}</TableCell>
                  <TableCell>{producto.stock_minimo}</TableCell>
                  <TableCell>{producto.tipo_despacho}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditar(producto)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleEliminar(producto.id_producto)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal Crear/Editar */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{modoEdicion ? "Editar Producto" : "Agregar Producto"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Nombre"
              name="nombre_producto"
              fullWidth
              margin="normal"
              value={nuevoProducto.nombre_producto}
              onChange={handleChange}
            />
            <TextField
              label="Descripción"
              name="descripcion"
              fullWidth
              margin="normal"
              value={nuevoProducto.descripcion}
              onChange={handleChange}
            />
            <TextField
              label="Precio Venta"
              name="precio_venta"
              type="number"
              fullWidth
              margin="normal"
              value={nuevoProducto.precio_venta}
              onChange={handleChange}
            />
            <TextField
              label="Precio Compra"
              name="precio_compra"
              type="number"
              fullWidth
              margin="normal"
              value={nuevoProducto.precio_compra}
              onChange={handleChange}
            />
            <TextField
              label="Stock"
              name="stock"
              type="number"
              fullWidth
              margin="normal"
              value={nuevoProducto.stock}
              onChange={handleChange}
            />
            <TextField
              label="Stock Mínimo"
              name="stock_minimo"
              type="number"
              fullWidth
              margin="normal"
              value={nuevoProducto.stock_minimo}
              onChange={handleChange}
            />
            <TextField
              label="Tipo de Despacho"
              name="tipo_despacho"
              fullWidth
              margin="normal"
              value={nuevoProducto.tipo_despacho}
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

export default Productos;