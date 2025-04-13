import { AppBar, Box,  Toolbar, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  return (
    <AppBar position="static" color="primary" sx={{ borderRadius: 0 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
          BRONTISANDWICH
        </Typography>
        {usuario && (
          <Box display="flex" alignItems="center">
            <AccountCircleIcon sx={{ mr: 1 }} />
            <Typography variant="body1">{usuario.nombre}</Typography>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;