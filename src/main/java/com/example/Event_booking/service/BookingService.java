package com.example.Event_booking.service;

import com.example.Event_booking.Request.BookingRequest;
import com.example.Event_booking.entity.*;
import com.example.Event_booking.repo.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final PaymentService paymentService;
    private final RedisService redisService;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository, EventRepository eventRepository, SeatRepository seatRepository, BookingSeatRepository bookingSeatRepository, PaymentService paymentService, RedisService redisService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.seatRepository = seatRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.paymentService = paymentService;
        this.redisService = redisService;
    }
@Transactional
    public void createBooking(BookingRequest request) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow();
        Event event = eventRepository.findById(request.getEventId()).orElseThrow();

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);

        List<Seat> seats = request.getSeatIds()
                .stream()
                .map(id -> seatRepository.findById(id).orElseThrow())
                .toList();

        BigDecimal totalAmount = seats.stream()
                .map(Seat::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        booking.setTotalAmount(totalAmount);

        // Check whether seats are already permanently booked
    // Validate that seats belong to the requested event
// and check whether they are already permanently booked
    for (Seat seat : seats) {

        if (seat.getEvent().getId()!=event.getId()) {
            throw new RuntimeException(
                    "Seat " + seat.getSeatNo() +
                            " does not belong to this event"
            );
        }

        if (!bookingSeatRepository.findBySeat(seat).isEmpty()) {
            throw new RuntimeException(
                    "Seat already booked: " + seat.getSeatNo()
            );
        }
    }



        // Redis reservation
        List<String> reservedKeys = new ArrayList<>();

        for (Seat seat : seats) {

            String key = "event:" + event.getId() + ":seat:" + seat.getId();

            boolean reserved = redisService.reserveSeat(
                    key,
                    String.valueOf(user.getId()),
                    600
            );

            if (!reserved) {

                for (String reservedKey : reservedKeys) {
                    redisService.deleteValue(reservedKey);
                }

                throw new RuntimeException(
                        "Seat temporarily booked: " + seat.getSeatNo()
                );
            }

            reservedKeys.add(key);
        }
        booking.setStatus(status.PENDING);
        bookingRepository.save(booking);
    for (Seat seat : seats) {
        BookingSeat bookingSeat = new BookingSeat();

        bookingSeat.setBooking(booking);
        bookingSeat.setSeat(seat);

        bookingSeatRepository.save(bookingSeat);
    }
        paymentService.createPayment(booking);
    }
    public List<Booking> allBookings(){
        return bookingRepository.findAll();
    }
    public Booking findBooking(Long id){
        return bookingRepository.findById(id).orElseThrow();
    }


    @Transactional
    public void cancelBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        if (!booking.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You cannot cancel this booking");
        }

        if (booking.getStatus() != status.PENDING) {
            throw new RuntimeException(
                    "Only pending bookings can be cancelled"
            );
        }

        List<BookingSeat> bookingSeats =
                bookingSeatRepository.findByBookingId(id);

        // Release seats from Redis
        for (BookingSeat bookingSeat : bookingSeats) {

            Seat seat = bookingSeat.getSeat();

            String key = "event:"
                    + booking.getEvent().getId()
                    + ":seat:"
                    + seat.getId();

            redisService.deleteValue(key);
        }

        // Remove booking-seat relationships
        bookingSeatRepository.deleteByBooking(booking);

        // Cancel booking
        booking.setStatus(status.CANCELLED);
        bookingRepository.save(booking);
    }
}
