// api/authClient.ts
import axios from "axios";

// Sin interceptor (para login/register)
const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default authClient;
