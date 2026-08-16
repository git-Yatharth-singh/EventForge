package com.example.Event_booking.controller;

import com.example.Event_booking.entity.Booking;
import com.example.Event_booking.entity.BookingSeat;
import com.example.Event_booking.service.BookingSeatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking-seats")
public class BookingSeatController {

    private final BookingSeatService bookingSeatService;

    public BookingSeatController(BookingSeatService bookingSeatService) {
        this.bookingSeatService = bookingSeatService;
    }

    @PostMapping
    public void createBookingSeat(@RequestBody BookingSeat bookingSeat){
        bookingSeatService.createBookingSeat(bookingSeat);
    }

    @GetMapping("/booking/{bookingid}")
    public List<BookingSeat> allBookingSeats(@PathVariable Long bookingid){
        return bookingSeatService.getSeatsOfBooking(bookingid);
    }

}
