import { AppBar, Toolbar, Typography } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="static" color="primary" sx={{ borderRadius: 0 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
          BRONTISANDWICH
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;