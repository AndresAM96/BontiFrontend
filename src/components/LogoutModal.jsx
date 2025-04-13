import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Slide,
  } from "@mui/material";
  import { forwardRef } from "react";
  
  // Animación estilo desprendible
  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
  export default function LogoutModal({ open, onClose, onConfirm }) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogTitle>Cerrar sesión</DialogTitle>
        <DialogContent dividers>
          <Typography>¿Seguro que deseas cerrar sesión?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={onConfirm} variant="contained" color="error">
            Cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>
    );
  }  