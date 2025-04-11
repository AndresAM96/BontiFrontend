import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import SectionLayout from "../../components/SectionLayout";
import { obtenerUsuarios } from "../../services/usuariosService";
import { obtenerProductos } from "../../services/productosService";
import { crearVenta } from "../../services/ventasService";
import { useNavigate } from "react-router-dom";

export default function NuevaVenta() {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);

  const [venta, setVenta] = useState({
    nombre: "",
    tipo_factura: "",
    forma_pago: "",
    fecha: new Date().toISOString().slice(0, 16),
    descripcion: "",
    descuento: 0,
    cedula_usuario: "",
    detalles: [],
  });

  const [snackbar, setSnackbar] = useState({ open: false, msg: "", tipo: "success" });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
    fetchProductos();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const data = await obtenerProductos();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const handleDetalleChange = (index, field, value) => {
    const nuevosDetalles = [...venta.detalles];
    nuevosDetalles[index][field] = field === "cantidad" ? parseInt(value) || 0 : value;

    // Actualizar precio_unitario si cambia el producto
    if (field === "id_producto") {
      const productoSeleccionado = productos.find((p) => p.id_producto === parseInt(value));
      if (productoSeleccionado) {
        nuevosDetalles[index].precio_unitario = productoSeleccionado.precio_venta;
      }
    }

    setVenta({ ...venta, detalles: nuevosDetalles });
  };

  const agregarDetalle = () => {
    setVenta((prev) => ({
      ...prev,
      detalles: [...prev.detalles, { id_producto: "", cantidad: 1, precio_unitario: 0 }],
    }));
  };

  const eliminarDetalle = (index) => {
    setVenta((prev) => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index),
    }));
  };

  const calcularSubtotal = () =>
      venta.detalles.reduce((acc, d) => acc + d.precio_unitario * d.cantidad, 0);

  const calcularTotal = () => calcularSubtotal() - parseFloat(venta.descuento || 0);

  const handleGuardar = async () => {
    try {
      const datosVenta = {
        ...venta,
        usuario: { cedula_usuario: parseInt(venta.cedula_usuario) },
        detalles: venta.detalles.map((d) => ({
          producto: { id_producto: parseInt(d.id_producto) },
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario,
        })),
      };
      
      await crearVenta(datosVenta);
      console.log("Datos a enviar al backend:", datosVenta);
      setSnackbar({ open: true, msg: "Venta guardada correctamente", tipo: "success" });
      navigate("/ventas");
    } catch (error) {
      console.error("Error al guardar venta:", error);
      setSnackbar({ open: true, msg: "Error al guardar venta", tipo: "error" });
    }
  };

  return (
    <SectionLayout title="Nueva Venta">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Referencia de la venta"
            fullWidth
            value={venta.nombre}
            onChange={(e) => setVenta({ ...venta, nombre: e.target.value })}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            label="Tipo de factura"
            select
            fullWidth
            value={venta.tipo_factura}
            onChange={(e) => setVenta({ ...venta, tipo_factura: e.target.value })}
          >
            <MenuItem value="Factura A">Factura A</MenuItem>
            <MenuItem value="Factura B">Factura B</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            label="Forma de pago"
            select
            fullWidth
            value={venta.forma_pago}
            onChange={(e) => setVenta({ ...venta, forma_pago: e.target.value })}
          >
            <MenuItem value="Efectivo">Efectivo</MenuItem>
            <MenuItem value="Transferencia">Transferencia</MenuItem>
            <MenuItem value="Crédito">Crédito</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Descripción"
            fullWidth
            value={venta.descripcion}
            onChange={(e) => setVenta({ ...venta, descripcion: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Usuario"
            select
            fullWidth
            value={venta.cedula_usuario}
            onChange={(e) => setVenta({ ...venta, cedula_usuario: e.target.value })}
          >
            {usuarios.map((u) => (
              <MenuItem key={u.cedula_usuario} value={u.cedula_usuario}>
                {u.nombre_usuario}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Productos
          </Typography>
          {venta.detalles.map((detalle, i) => (
            <Card key={i} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      label="Producto"
                      fullWidth
                      value={detalle.id_producto}
                      onChange={(e) => handleDetalleChange(i, "id_producto", e.target.value)}
                    >
                      {productos.map((p) => (
                        <MenuItem key={p.id_producto} value={p.id_producto}>
                          {p.nombre_producto}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      label="Cantidad"
                      type="number"
                      fullWidth
                      value={detalle.cantidad}
                      onChange={(e) => handleDetalleChange(i, "cantidad", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      label="Precio Unitario"
                      fullWidth
                      value={detalle.precio_unitario}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      label="Subtotal"
                      fullWidth
                      value={(detalle.precio_unitario * detalle.cantidad).toFixed(2)}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => eliminarDetalle(i)}
                    >
                      Eliminar
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          <Button variant="outlined" onClick={agregarDetalle}>
            Agregar producto
          </Button>
        </Grid>

        <Grid item xs={6} md={3}>
          <TextField
            label="Descuento"
            type="number"
            fullWidth
            value={venta.descuento}
            onChange={(e) => setVenta({ ...venta, descuento: e.target.value })}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography variant="h6" mt={2}>
            Total: ${calcularTotal().toFixed(2)}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleGuardar}>
            Guardar Venta
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.tipo}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </SectionLayout>
  );
}