package com.example.Event_booking.repo;

import com.example.Event_booking.entity.Booking;
import com.example.Event_booking.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {
    List<Payment> findByBooking(Booking booking);
    List<Payment> findByBookingUserId(Long userId);
}
