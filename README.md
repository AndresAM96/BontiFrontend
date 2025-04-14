# Inventario Frontend

Este es el frontend del sistema de inventario, desarrollado en **React.js**, usando **Vite** como bundler y **Material UI** para el diseño de interfaz moderna.

## 📦 Tecnologías

- React + Vite
- Material UI
- Axios
- React Router

## 🚀 Instalación

```bash
npm install

## ▶️ Correr el proyecto

```bash
npm run dev

## 📂 Estructura principal

- src/pages → vistas del sistema (Clientes, Productos, Ventas, etc.)

- src/components → componentes reutilizables (Sidebar, Navbar, Modales)

- src/services → servicios de conexión con el backend vía Axios

src/layout → layout general de la app

## 🔒 Autenticación

Al iniciar sesión se guarda el usuario autenticado en localStorage. Existen rutas protegidas mediante el componente PrivateRoute.

## 📌 Notas

- El superadministrador no se registra desde el frontend, debe insertarse directamente en la base de datos.

- El sidebar puede expandirse/contraerse.

- Funcionalidad completa para clientes, productos, proveedores, ventas y usuarios.