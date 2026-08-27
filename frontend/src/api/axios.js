import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const TOKEN_KEY = "eventforge_jwt";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors + handle global 401
let onUnauthorized = () => {};
export function registerUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

// The backend's GlobalExceptionHandler returns the raw exception message
// as a plain-text 400 body (e.g. "Email already exists", "Seat temporarily
// booked: A1"). There is no JSON error envelope, so we normalize every
// failure into a single shape the UI can rely on: { status, message }.
function extractMessage(error) {
  const res = error.response;
  if (!res) {
    return "Unable to connect to EventForge. Please try again.";
  }
  const data = res.data;
  if (typeof data === "string" && data.trim().length > 0) return data;
  if (data && typeof data === "object" && data.message) return data.message;

  switch (res.status) {
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "We couldn't find what you were looking for.";
    case 409:
      return "That action conflicts with the current state. Please refresh and try again.";
    case 500:
      return "Something went wrong on our end. Please try again shortly.";
    default:
      return "Something went wrong. Please try again.";
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = extractMessage(error);

    if (status === 401 || status === 403) {
      clearToken();
      onUnauthorized();
    }

    return Promise.reject({ status, message, raw: error });
  }
);

export default api;
