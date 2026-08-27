import api from "./axios";

export async function adminCreateVenue({ name, location }) {
  await api.post("/venues", { name, location });
}

export async function adminUpdateVenue(id, { name, location }) {
  await api.put(`/venues/${id}`, { name, location });
}

export async function adminDeleteVenue(id) {
  await api.delete(`/venues/${id}`);
}
