import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

export async function fetchIndicators({ ticker, range = "1mo", interval = "1d" }) {
  // Adjust path/params to match your C++ endpoints.
  const res = await api.get("/indicators", { params: { ticker, range, interval } });
  return res.data;
}
