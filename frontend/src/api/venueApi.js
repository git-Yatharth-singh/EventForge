import api from "./axios";

export async function getVenue(id) {
  const res = await api.get(`/venues/${id}`);
  return res.data;
}

export async function getVenues() {
  const res = await api.get("/venues");
  return res.data;
}
