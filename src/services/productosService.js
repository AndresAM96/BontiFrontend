import axios from "axios";

const API_URL = "http://localhost:8080/brontisandwich/productos";

export const obtenerProductos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const crearProducto = async (producto) => {
  const response = await axios.post(API_URL, producto);
  return response.data;
};

export const eliminarProducto = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const actualizarProducto = async (id, producto) => {
    const response = await axios.put(`${API_URL}/${id}`, producto);
    return response.data;
  };  