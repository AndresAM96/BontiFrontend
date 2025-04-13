import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Slide,
  } from "@mui/material";
  import { forwardRef } from "react";
  import jsPDF from "jspdf";
  import "jspdf-autotable";
  
  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
  export default function DetalleVentaModal({ open, venta, onClose }) {
    if (!venta) return null;
  
    const calcularTotal = () => {
      const subtotal = venta.detalles?.reduce(
        (acc, d) => acc + d.precio_unitario * d.cantidad,
        0
      ) || 0;
      return subtotal - parseFloat(venta.descuento || 0);
    };
  
    const exportarPDF = () => {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(`Venta #${venta.id_venta}`, 14, 22);
      doc.setFontSize(12);
      doc.text(`Usuario: ${venta.usuario?.nombre}`, 14, 32);
      doc.text(`Forma de pago: ${venta.forma_pago}`, 14, 40);
      doc.text(`Tipo Factura: ${venta.tipo_factura}`, 14, 48);
      doc.text(`Fecha: ${new Date(venta.fecha).toLocaleString("es-CO")}`, 14, 56);
  
      doc.autoTable({
        startY: 70,
        head: [["Producto", "Cantidad", "Precio Unitario", "Subtotal"]],
        body: venta.detalles.map((d) => [
          d.producto?.nombre_producto,
          d.cantidad,
          `$${d.precio_unitario}`,
          `$${(d.precio_unitario * d.cantidad).toFixed(2)}`,
        ]),
      });
  
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.text(`Descuento: $${venta.descuento}`, 14, finalY);
      doc.text(`Total: $${calcularTotal().toFixed(2)}`, 14, finalY + 8);
  
      doc.save(`Venta_${venta.id_venta}.pdf`);
    };
  
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogTitle>Detalle de Venta</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1">ID Venta: #{venta.id_venta}</Typography>
          <Typography variant="body2">Usuario: {venta.usuario?.nombre}</Typography>
          <Typography variant="body2">Forma de pago: {venta.forma_pago}</Typography>
          <Typography variant="body2">Factura: {venta.tipo_factura}</Typography>
          <Typography variant="body2">
            Fecha: {new Date(venta.fecha).toLocaleString("es-CO")}
          </Typography>
          <Typography variant="body2">Descripción: {venta.descripcion}</Typography>
  
          <Typography variant="h6" mt={2}>
            Productos
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {venta.detalles.map((d, i) => (
                <TableRow key={i}>
                  <TableCell>{d.producto?.nombre_producto}</TableCell>
                  <TableCell>{d.cantidad}</TableCell>
                  <TableCell>${d.precio_unitario}</TableCell>
                  <TableCell>${(d.precio_unitario * d.cantidad).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
  
          <Typography mt={2}>Descuento: ${venta.descuento}</Typography>
          <Typography variant="h6">Total: ${calcularTotal().toFixed(2)}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cerrar</Button>
          <Button onClick={exportarPDF} variant="contained">
            Exportar a PDF
          </Button>
        </DialogActions>
      </Dialog>
    );
  }