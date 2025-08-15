// api/authClient.ts
import axios from "axios";

// Sin interceptor (para login/register)
const authClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export default authClient;
