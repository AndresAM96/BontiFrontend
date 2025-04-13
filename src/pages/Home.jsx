import { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { obtenerVentas } from "../services/ventasService";
import { obtenerProductos } from "../services/productosService";
import { obtenerClientes } from "../services/clientesService";
import { obtenerProveedores } from "../services/proveedoresService";

export default function Home() {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setVentas(await obtenerVentas());
    setProductos(await obtenerProductos());
    setClientes(await obtenerClientes());
    setProveedores(await obtenerProveedores());
  };

  const resumen = [
    { label: "Ventas", total: ventas.length },
    { label: "Productos", total: productos.length },
    { label: "Clientes", total: clientes.length },
    { label: "Proveedores", total: proveedores.length },
  ];

  // Datos para el gráfico (top 5 ventas más recientes)
  const ventasRecientes = ventas
    .slice(-5)
    .map((v) => ({ nombre: `#${v.id_venta}`, total: v.detalles.reduce((acc, d) => acc + d.precio_unitario * d.cantidad, 0) }));

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>Bienvenido al sistema de inventarios</Typography>

      <Grid container spacing={2}>
        {resumen.map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">{item.label}</Typography>
              <Typography variant="h4">{item.total}</Typography>
            </Paper>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Ventas recientes</Typography>
            {ventasRecientes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ventasRecientes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2">Aún no hay ventas registradas.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}