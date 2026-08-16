package com.example.Event_booking.repo;

import com.example.Event_booking.entity.Booking;
import com.example.Event_booking.entity.BookingSeat;
import com.example.Event_booking.entity.Seat;
import com.example.Event_booking.entity.status;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat,Long> {
    List<BookingSeat> findBySeat(Seat seat);
    List<BookingSeat> findByBookingId(Long id);
    void deleteByBooking(Booking booking);
}
