import api from "./axios";

/**
 * IMPORTANT BACKEND LIMITATION (see project notes):
 * GET /seats returns SeatResponse { id, seatNo, price, status } with the
 * live AVAILABLE/RESERVED/BOOKED status the backend computes from Redis +
 * bookings — but it has NO eventId, and there is no GET /seats/event/{id}.
 * GET /seats/venue/{venueId} returns raw Seat entities (with a nested
 * Event, so we CAN filter by event) but with no computed status field.
 *
 * Workaround used here (no backend change, no invented endpoint): fetch
 * both, filter the venue seats down to this event, then join in status by
 * matching seat id. This does mean GET /seats pulls every seat in the
 * system on every seat-selection page load — fine for a portfolio-scale
 * dataset, but flagged as a real limitation. The clean backend fix would
 * be adding `eventId` to SeatResponse or a GET /seats/event/{id} endpoint.
 */
export async function getSeatsForEvent(eventId, venueId) {
  const [allSeatsRes, venueSeatsRes] = await Promise.all([
    api.get("/seats"),
    api.get(`/seats/venue/${venueId}`),
  ]);

  const statusById = new Map(
    allSeatsRes.data.map((s) => [s.id, { price: s.price, status: s.status }])
  );

  const seatsForEvent = venueSeatsRes.data.filter(
    (seat) => seat.event && String(seat.event.id) === String(eventId)
  );

  return seatsForEvent
    .map((seat) => {
      const extra = statusById.get(seat.id);
      return {
        id: seat.id,
        seatNo: seat.seatNo,
        price: extra ? extra.price : seat.price,
        status: extra ? extra.status : "AVAILABLE",
      };
    })
    .sort((a, b) => a.seatNo.localeCompare(b.seatNo, undefined, { numeric: true }));
}
