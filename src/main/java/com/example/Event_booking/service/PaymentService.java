package com.example.Event_booking.service;

import com.example.Event_booking.entity.Booking;
import com.example.Event_booking.entity.Payment;
import com.example.Event_booking.entity.paymentStatus;
import com.example.Event_booking.entity.status;
import com.example.Event_booking.repo.BookingRepository;
import com.example.Event_booking.repo.BookingSeatRepository;
import com.example.Event_booking.repo.PaymentRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;import org.springframework.transaction.annotation.Transactional;


@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentRepository paymentRepository, BookingSeatRepository bookingSeatRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.bookingRepository = bookingRepository;

    }

    public void createPayment(Booking booking) {
        Payment payment = new Payment();

        payment.setBooking(booking);
        payment.setAmount(booking.getTotalAmount());
        payment.setStatus(paymentStatus.PENDING);

        paymentRepository.save(payment);
        booking.setStatus(status.PENDING);
        bookingRepository.save(booking);

    }

    public List<Payment> allPayment() {
        return paymentRepository.findAll();
    }

    public Payment findPayment(Long id) {
        return paymentRepository.findById(id).orElseThrow();
    }

    public List<Payment> findByBooking(Booking booking) {
        return paymentRepository.findByBooking(booking);
    }
@Transactional
    public void updateStatus(Long paymentid) {
        Payment payment = paymentRepository.findById(paymentid).orElseThrow();
        if(payment.getStatus()==paymentStatus.PENDING) {
            payment.setStatus(paymentStatus.SUCCESS);
            paymentRepository.save(payment);
            Booking booking = payment.getBooking();
            booking.setStatus(status.CONFIRMED);
            bookingRepository.save(booking);
        }
    }
@Transactional
    public void failPayment(Long paymentid) {
        Payment payment = paymentRepository.findById(paymentid).orElseThrow();
        if(payment.getStatus()==paymentStatus.PENDING) {
            payment.setStatus(paymentStatus.FAILED);
            paymentRepository.save(payment);
            bookingSeatRepository.deleteByBooking(payment.getBooking());
            Booking booking = payment.getBooking();
            booking.setStatus(status.FAILED);
            bookingRepository.save(booking);
        }
    }
@Transactional
    public void cancelPayment(Long paymentid) {
        Payment payment = paymentRepository.findById(paymentid).orElseThrow();
        if(payment.getStatus()==paymentStatus.PENDING) {
            payment.setStatus(paymentStatus.CANCELLED);
            paymentRepository.save(payment);
            bookingSeatRepository.deleteByBooking(payment.getBooking());
            Booking booking = payment.getBooking();
            booking.setStatus(status.CANCELLED);
            bookingRepository.save(booking);
        }
    }
@Transactional
    @Scheduled(fixedRate = 60000)
    public void expirePayments() {
        List<Payment> payments = paymentRepository.findAll();
        for (Payment payment : payments) {
            if (payment.getStatus() == paymentStatus.PENDING) {
                LocalDateTime expiryTime = payment.getCreatedAt().plusMinutes(10);

                if (LocalDateTime.now().isAfter(expiryTime)) {
                    payment.setStatus(paymentStatus.EXPIRED);

                    paymentRepository.save(payment);
                    bookingSeatRepository.deleteByBooking(payment.getBooking());
                    Booking booking=payment.getBooking();
                    booking.setStatus(status.EXPIRED);
                    bookingRepository.save(booking);
                }
            }
        }
    }
}
