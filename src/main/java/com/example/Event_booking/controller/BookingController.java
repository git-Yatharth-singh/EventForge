package com.example.Event_booking.controller;

import com.example.Event_booking.Request.BookingRequest;
import com.example.Event_booking.entity.Booking;
import com.example.Event_booking.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public void createBooking(@RequestBody BookingRequest booking){
        bookingService.createBooking(booking);
    }

    @GetMapping
    public List<Booking> getAllBooking(){
        return bookingService.allBookings();
    }

    @GetMapping("{id}")
    public Booking getBooking(@PathVariable Long id){
        return bookingService.findBooking(id);
    }

}
