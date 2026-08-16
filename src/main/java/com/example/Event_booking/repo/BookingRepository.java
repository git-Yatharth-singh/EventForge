package com.example.Event_booking.repo;

import com.example.Event_booking.entity.Booking;
import com.example.Event_booking.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.Event_booking.entity.User;
import java.util.List;
@Repository
public interface BookingRepository extends JpaRepository<Booking,Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByEvent(Event event);
    Boolean existsByUser(User user);
}
