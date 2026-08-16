package com.example.Event_booking.controller;

import com.example.Event_booking.entity.Booking;
import com.example.Event_booking.entity.Payment;
import com.example.Event_booking.repo.BookingRepository;
import com.example.Event_booking.service.BookingService;
import com.example.Event_booking.service.PaymentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment")
public class PaymentController {
    private final PaymentService paymentService;
    private final BookingService bookingService;
    public PaymentController(PaymentService paymentService, BookingService bookingService) {
        this.paymentService = paymentService;
        this.bookingService= bookingService;
    }

    @PostMapping
    public void createPayment(@RequestBody Booking booking){
        paymentService.createPayment(booking);
    }

    @GetMapping
    public List<Payment> allPayment(){
        return paymentService.allPayment();
    }

    @GetMapping("/{id}")
    public Payment findPayment(@PathVariable Long id){
        return paymentService.findPayment(id);
    }

    @GetMapping("/booking/{bookingId}")
    public List<Payment> findBybooking(@PathVariable Long bookingid){
        Booking booking=bookingService.findBooking(bookingid);
        return paymentService.findByBooking(booking);
    }

    @PostMapping("/{id}/pay")
    public void processPayment(@PathVariable Long id){
        paymentService.updateStatus(id);
    }

    @PostMapping("/{id}/fail")
    public void failpayment(@PathVariable Long id){
        paymentService.failPayment(id);
    }

    @PostMapping("/{id}/cancel")
    public void cancelpayment(@PathVariable Long id){
        paymentService.cancelPayment(id);
    }
}
