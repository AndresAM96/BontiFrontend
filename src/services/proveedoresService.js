import axios from "axios";

const API_URL = "http://localhost:8080/brontisandwich/proveedores";

export const obtenerProveedores = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const crearProveedor = async (proveedor) => {
  const response = await axios.post(API_URL, proveedor);
  return response.data;
};

export const actualizarProveedor = async (id, proveedor) => {
  const response = await axios.put(`${API_URL}/${id}`, proveedor);
  return response.data;
};

export const eliminarProveedor = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};