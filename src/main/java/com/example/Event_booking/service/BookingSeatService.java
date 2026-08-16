package com.example.Event_booking.service;

import com.example.Event_booking.entity.Booking;
import com.example.Event_booking.entity.BookingSeat;
import com.example.Event_booking.repo.BookingSeatRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingSeatService {

    private final BookingSeatRepository bookingSeatRepository;

    public BookingSeatService(BookingSeatRepository bookingSeatRepository) {
        this.bookingSeatRepository = bookingSeatRepository;
    }
    public void createBookingSeat(BookingSeat bookingSeat){
        bookingSeatRepository.save(bookingSeat);
    }
    public List<BookingSeat> getSeatsOfBooking(Long id) {
        return bookingSeatRepository.findByBookingId(id);
    }
}
