# EventForge — Frontend

A React (Vite) frontend for the EventForge Spring Boot backend, built against
the actual backend source (not assumptions) — every endpoint, DTO, and
security rule below was verified by reading the repository directly.

## Setup

```bash
npm install
cp .env.example .env   # already points at the Railway production API
npm run dev
```

`VITE_API_BASE_URL` is the only thing the frontend knows about the backend.

## Verified against the backend source

- `POST /auth/login` returns the JWT as a **raw string body**, not JSON — handled in `api/authApi.js`.
- `POST /users` is public (`SecurityConfig` permits `POST /users`); role is never sent from the signup form, so the backend always assigns `USER`.
- `POST /booking` takes `{ eventId, seatIds }` only (no `userId`) and **returns void** — the frontend has no booking id after this call.
- Redis reservation TTL is 600s (`BookingService`), enforced server-side; the checkout countdown is a visual aid only.
- `GET /payment` is filtered to the authenticated user server-side (`PaymentService#allPayment`); `GET /booking` is **not** filtered (`findAll()`).
- The `GlobalExceptionHandler` returns every `RuntimeException` as a plain-text `400` body — there's no JSON error envelope, so `api/axios.js` treats the raw string as the message.
- `pay` / `fail` / `cancel` on `PaymentController` are **silent no-ops** if the payment has already left `PENDING` (e.g. the backend's 60s expiry job beat you to it) — the frontend always re-fetches the payment after calling one of these rather than trusting the call succeeded.
- No `@JsonIgnore` on `User.password` — API responses do include the bcrypt hash. The frontend strips it in `api/userApi.js` and never renders or persists it.

## Two real backend/frontend mismatches (worked around, no backend touched)

**1. Seat selection can't tell which seats belong to an event.**
`SeatResponse` (`GET /seats`) is `{ id, seatNo, price, status }` — no `eventId`, and there's no `GET /seats/event/{id}`. `GET /seats/venue/{id}` returns raw `Seat` entities with a nested `Event` (so it *can* be filtered by event) but no computed status.

`api/seatApi.js` fetches both and joins them by seat id client-side. It works, but it means `GET /seats` (every seat in the system) is fetched on every seat-selection page load. **Recommended backend fix:** add `eventId` to `SeatResponse`, or a `GET /seats/event/{id}` endpoint.

**2. "My Bookings" has no user-scoped endpoint.**
`GET /booking` is `bookingRepository.findAll()` — every booking in the system. There's no `GET /booking/user/{id}`.

`hooks/useMyBookings.js` instead calls `GET /payment` (which *is* user-filtered) to get the current user's `bookingId`s, then fetches each via `GET /booking/{id}`. This only ever touches bookings the user is already entitled to see. **Recommended backend fix:** add `GET /booking/user/{id}` (or filter `GET /booking` by the authenticated user) for efficiency — this workaround is O(n) requests per page load.

## Admin area

`/admin` (Dashboard, Events, Venues, Seats — full create/edit/delete) is
gated by `AdminRoute`, which checks `user.role === "ADMIN"` and redirects
everyone else. This is a **frontend-only** gate: `SecurityConfig` does not
currently restrict `POST/PUT/DELETE /events`, `/venues`, or `/seats` to
ADMIN, so any authenticated user hitting those endpoints directly (outside
this UI) could still use them. The dashboard surfaces this as a visible
warning. Hardening this properly means adding role checks in
`SecurityConfig` on the backend.

Seat editing is limited to seat number only — `SeatService#updateSeat`
ignores price/event on `PUT /seats/{id}` by design, so changing a seat's
price means deleting and re-creating it.

## Needs your attention before going live

- **CORS is not configured anywhere in the backend.** If this frontend is deployed on a different origin than the Railway backend, every request will be blocked by the browser. This needs a `CorsConfig`/`@CrossOrigin` addition on the backend allowing your frontend's origin — I have not made this change since the brief said not to modify the backend without being asked.
- `GET /booking/{id}` has no ownership check (only `DELETE /booking/{id}` does) — the frontend never calls it with an arbitrary id, but it's worth knowing this is an IDOR gap in the API itself if it's ever called from elsewhere.
