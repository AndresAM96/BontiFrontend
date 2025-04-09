import { List, ListItem, ListItemText, Drawer, ListItemIcon, ListItemButton } from "@mui/material";
import { Home, People, Inventory, ShoppingCart, LocalShipping, AdminPanelSettings } from "@mui/icons-material";
import { Link } from "react-router-dom";

const menuItems = [
  { text: "Inicio", path: "/", icon: <Home /> },
  { text: "Clientes", path: "/clientes", icon: <People /> },
  { text: "Productos", path: "/productos", icon: <Inventory /> },
  { text: "Ventas", path: "/ventas", icon: <ShoppingCart /> },
  { text: "Proveedores", path: "/proveedores", icon: <LocalShipping /> },
  { text: "Usuarios", path: "/usuarios", icon: <AdminPanelSettings /> },
];

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;