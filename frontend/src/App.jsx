import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import SeatSelection from "./pages/SeatSelection";
import Checkout from "./pages/Checkout";
import PaymentResult from "./pages/PaymentResult";
import MyBookings from "./pages/MyBookings";
import BookingDetails from "./pages/BookingDetails";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminEventForm from "./pages/admin/AdminEventForm";
import AdminVenues from "./pages/admin/AdminVenues";
import AdminVenueForm from "./pages/admin/AdminVenueForm";
import AdminSeats from "./pages/admin/AdminSeats";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />

          <Route
            path="/events/:id/seats"
            element={
              <ProtectedRoute>
                <SeatSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/:paymentId"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/success"
            element={
              <ProtectedRoute>
                <PaymentResult variant="success" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/failure"
            element={
              <ProtectedRoute>
                <PaymentResult variant="failure" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/expired"
            element={
              <ProtectedRoute>
                <PaymentResult variant="expired" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute>
                <BookingDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="events/new" element={<AdminEventForm />} />
            <Route path="events/:id/edit" element={<AdminEventForm />} />
            <Route path="venues" element={<AdminVenues />} />
            <Route path="venues/new" element={<AdminVenueForm />} />
            <Route path="venues/:id/edit" element={<AdminVenueForm />} />
            <Route path="seats" element={<AdminSeats />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
