import axios from "axios";

const API_URL = "http://localhost:8080/brontisandwich/login";

export const login = async (credenciales) => {
  const response = await axios.post(API_URL, credenciales);
  return response.data;
};