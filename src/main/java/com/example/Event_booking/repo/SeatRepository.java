package com.example.Event_booking.repo;

import com.example.Event_booking.entity.Seat;
import com.example.Event_booking.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat,Long> {
    List<Seat> findByEventVenue(Venue venue);

}
