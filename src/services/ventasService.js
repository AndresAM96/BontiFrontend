import axios from "axios";

const API_URL = "http://localhost:8080/brontisandwich/ventas";

export const obtenerVentas = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const crearVenta = async (ventaData) => {
  const response = await axios.post(API_URL, ventaData);
  return response.data;
};

export const obtenerVentaPorId = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const actualizarVenta = async (id, ventaData) => {
  const response = await axios.put(`${API_URL}/${id}`, ventaData);
  return response.data;
};

export const eliminarVenta = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};