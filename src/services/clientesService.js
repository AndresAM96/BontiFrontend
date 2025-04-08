import axios from "axios";

const API_URL = "http://localhost:8080/api/clientes"; // ajusta si tu backend usa otra ruta

export const obtenerClientes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const crearCliente = async (cliente) => {
  const response = await axios.post(API_URL, cliente);
  return response.data;
};

export const eliminarCliente = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};