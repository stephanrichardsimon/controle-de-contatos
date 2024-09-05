import axios from "axios";

// Crie uma instância do Axios com a base URL
const api = axios.create({
  baseURL: "http://localhost:3001", // Altere para a URL do seu JSON Server
});

export default api;
