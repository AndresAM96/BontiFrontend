import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SectionLayout from "../components/SectionLayout";
import { useNavigate } from "react-router-dom";
import {
  obtenerVentas,
  eliminarVenta,
} from "../services/ventasService";

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarTipo, setSnackbarTipo] = useState("success");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      const data = await obtenerVentas();
      console.log("VENTAS OBTENIDAS:", data);
      setVentas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      setSnackbarMsg("Error al obtener ventas.");
      setSnackbarTipo("error");
      setSnackbarOpen(true);
    }
  };

  const handleEliminar = async (id) => {
    const confirmacion = confirm("¿Estás seguro de eliminar esta venta?");
    if (!confirmacion) return;

    try {
      await eliminarVenta(id);
      setVentas((prev) => prev.filter((venta) => venta.idVenta !== id));
      setSnackbarMsg("Venta eliminada correctamente.");
      setSnackbarTipo("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al eliminar venta:", error);
      setSnackbarMsg("Error al eliminar venta.");
      setSnackbarTipo("error");
      setSnackbarOpen(true);
    }
  };

  const calcularTotal = (venta) => {
    const subtotal = venta.detalles?.reduce((acc, d) => acc + d.precio_unitario * d.cantidad, 0) || 0;
    return subtotal - parseFloat(venta.descuento || 0);
  };

  return (
    <>
      <SectionLayout title="Gestión de Ventas">
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/ventas/nueva")}
          >
            Nueva Venta
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Tipo Factura</TableCell>
                <TableCell>Forma Pago</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Descuento</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventas.length > 0 ? (
                ventas.map((venta) => (
                  <TableRow key={venta.idVenta}>
                    <TableCell>{venta.idVenta}</TableCell>
                    <TableCell>{venta.nombre}</TableCell>
                    <TableCell>{venta.usuario?.nombre}</TableCell>
                    <TableCell>{venta.tipoFactura}</TableCell>
                    <TableCell>{venta.formaPago}</TableCell>
                    <TableCell>
                      {new Date(venta.fecha).toLocaleString("es-CO")}
                    </TableCell>
                    <TableCell>${venta.descuento}</TableCell>
                    <TableCell>${calcularTotal(venta).toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleEliminar(venta.idVenta)}
                      >
                      <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No hay ventas registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
}