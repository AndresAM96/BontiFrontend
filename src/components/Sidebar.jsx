import {
  List,
  ListItem,
  ListItemText,
  Drawer,
  ListItemIcon,
  ListItemButton,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Home,
  People,
  Inventory,
  ShoppingCart,
  LocalShipping,
  AdminPanelSettings,
  Logout,
  Menu,
  ChevronLeft,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import LogoutModal from "./LogoutModal";

const menuItems = [
  { text: "Inicio", path: "/", icon: <Home /> },
  { text: "Clientes", path: "/clientes", icon: <People /> },
  { text: "Productos", path: "/productos", icon: <Inventory /> },
  { text: "Ventas", path: "/ventas", icon: <ShoppingCart /> },
  { text: "Proveedores", path: "/proveedores", icon: <LocalShipping /> },
  { text: "Usuarios", path: "/usuarios", icon: <AdminPanelSettings /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <>
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 240 : 70,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: open ? 240 : 70,
          boxSizing: "border-box",
          transition: "width 0.3s",
        },
      }}
    >
      <List>
        <ListItem disablePadding>
          <IconButton onClick={() => setOpen(!open)} sx={{ m: 1 }}>
            {open ? <ChevronLeft /> : <Menu />}
          </IconButton>
        </ListItem>

        <Divider />

        {menuItems.map((item) => (
          <Tooltip
            key={item.text}
            title={!open ? item.text : ""}
            placement="right"
            arrow
          >
            <ListItem disablePadding>
              <ListItemButton component={Link} to={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}

        <Divider />

        <Tooltip title={!open ? "Cerrar sesión" : ""} placement="right" arrow>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setLogoutOpen(true)}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              {open && <ListItemText primary="Cerrar sesión" />}
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List>
    </Drawer>
    {/* Modal de confirmación */}
    <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Sidebar;
