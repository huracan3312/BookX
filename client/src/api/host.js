import axios from "axios";

// Configuración de la instancia de Axios
const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Función para obtener los datos de un lugar por ID
export const getHostById = (id) => {
  return api.get(`/host/${id}`);
};

// Función para crear un nuevo lugar
export const createHost = (hostData) => {
  return api.post("api/host/", hostData);
};

// Función para actualizar un lugar existente
export const updatehost = (id, hostData) => {
  return api.put(`/host/${id}`, hostData);
};

export const deleteHost = (id) => {
  return api.delete(`/host/${id}`);
};
