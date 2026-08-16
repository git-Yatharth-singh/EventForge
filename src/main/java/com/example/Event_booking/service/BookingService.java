package com.example.Event_booking.service;

import com.example.Event_booking.Request.BookingRequest;
import com.example.Event_booking.entity.*;
import com.example.Event_booking.repo.*;
import org.springframework.stereotype.Service;


import java.math.BigDecimal;
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

    public void createBooking(BookingRequest request){
        User user=userRepository.findById(request.getUserId()).orElseThrow();
        Event event=eventRepository.findById(request.getEventId()).orElseThrow();
        Booking booking=new Booking();
        booking.setUser(user);//setting user and event in booking table
        booking.setEvent(event);
        //separating all the seats that the user sends
        List<Seat> seats=request.getSeatIds().stream().map(id->seatRepository.findById(id).orElseThrow()).toList();
        //adding the total amount per seat
        BigDecimal totalAmount = seats.stream()
                .map(Seat::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        booking.setTotalAmount(totalAmount);
        //checking if the seats are already filled
        for (Seat seat : seats) {
            if (!bookingSeatRepository.findBySeat(seat).isEmpty()) {
                throw new RuntimeException("Seat already booked: " + seat.getSeatNo());
            }
        }
        booking.setStatus(status.PENDING);
        bookingRepository.save(booking);

        for (Seat seat:seats){
            boolean reserved=redisService.reserveSeat(
                    "event:"+event.getId()+":seat:"+seat.getId(),
                    String.valueOf(user.getId()),
                    600
            );
            if(!reserved){
                throw new RuntimeException(
                        "Seat temporarily booked: "+seat.getSeatNo()
                );
            }
        }
        //setting every seat to its booking seat
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

}
