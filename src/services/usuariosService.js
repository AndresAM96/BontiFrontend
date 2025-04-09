import axios from "axios";

const API_URL = "http://localhost:8080/brontisandwich/usuarios";

export const obtenerUsuarios = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const crearUsuario = async (usuario) => {
  const response = await axios.post(API_URL, usuario);
  return response.data;
};

export const actualizarUsuario = async (id, usuario) => {
  const response = await axios.put(`${API_URL}/${id}`, usuario);
  return response.data;
};

export const eliminarUsuario = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};