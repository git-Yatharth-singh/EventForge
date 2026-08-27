package com.example.Event_booking.service;

import com.example.Event_booking.entity.*;
import com.example.Event_booking.repo.BookingRepository;
import com.example.Event_booking.repo.BookingSeatRepository;
import com.example.Event_booking.repo.PaymentRepository;
import com.example.Event_booking.repo.UserRepository;
import com.example.Event_booking.response.PaymentResponse;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;import org.springframework.transaction.annotation.Transactional;


@Service
public class PaymentService {
    private final RedisService redisService;
    private final PaymentRepository paymentRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;


    public PaymentService(RedisService redisService, PaymentRepository paymentRepository, BookingSeatRepository bookingSeatRepository, BookingRepository bookingRepository, UserRepository userRepository) {
        this.redisService = redisService;
        this.paymentRepository = paymentRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
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

    public List<PaymentResponse> allPayment() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return paymentRepository.findByBookingUserId(user.getId())
                .stream()
                .map(payment -> new PaymentResponse(
                        payment.getId(),
                        payment.getStatus(),
                        payment.getAmount(),
                        payment.getBooking().getId()
                ))
                .toList();
    }


    public PaymentResponse findPayment(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow();

        return new PaymentResponse(
                payment.getId(),
                payment.getStatus(),
                payment.getAmount(),
                payment.getBooking().getId()
        );
    }

    public List<Payment> findByBooking(Booking booking) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        if (!booking.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You cannot access this booking's payment");
        }

        return paymentRepository.findByBooking(booking);
    }
    @Transactional
    public void updateStatus(Long paymentid) {

        Payment payment = paymentRepository.findById(paymentid)
                .orElseThrow();

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        if (!payment.getBooking().getUser().getEmail().equals(email)) {
            throw new RuntimeException("You cannot access this payment");
        }

        if (payment.getStatus() == paymentStatus.PENDING) {

            Booking booking = payment.getBooking();

            releaseSeats(booking);

            payment.setStatus(paymentStatus.SUCCESS);
            paymentRepository.save(payment);

            booking.setStatus(status.CONFIRMED);
            bookingRepository.save(booking);
        }
    }
    @Transactional
    public void failPayment(Long paymentid) {

        Payment payment = paymentRepository.findById(paymentid)
                .orElseThrow();

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        if (!payment.getBooking().getUser().getEmail().equals(email)) {
            throw new RuntimeException("You cannot access this payment");
        }

        if (payment.getStatus() == paymentStatus.PENDING) {

            Booking booking = payment.getBooking();

            releaseSeats(booking);

            bookingSeatRepository.deleteByBooking(booking);

            payment.setStatus(paymentStatus.FAILED);
            paymentRepository.save(payment);

            booking.setStatus(status.FAILED);
            bookingRepository.save(booking);
        }
    }
    @Transactional
    public void cancelPayment(Long paymentid) {

        Payment payment = paymentRepository.findById(paymentid)
                .orElseThrow();

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        if (!payment.getBooking().getUser().getEmail().equals(email)) {
            throw new RuntimeException("You cannot access this payment");
        }

        if (payment.getStatus() == paymentStatus.PENDING) {

            Booking booking = payment.getBooking();

            releaseSeats(booking);

            bookingSeatRepository.deleteByBooking(booking);

            payment.setStatus(paymentStatus.CANCELLED);
            paymentRepository.save(payment);

            booking.setStatus(status.CANCELLED);
            bookingRepository.save(booking);
        }
    }
    @Transactional
    @Scheduled(fixedRate = 60000)
    public void expirePayments() {

        List<Payment> payments =
                paymentRepository.findByStatus(paymentStatus.PENDING);

        for (Payment payment : payments) {

            Instant expiryTime =
                    payment.getCreatedAt().plus(10, ChronoUnit.MINUTES);

            if (Instant.now().isAfter(expiryTime)) {

                Booking booking = payment.getBooking();

                releaseSeats(booking);

                bookingSeatRepository.deleteByBooking(booking);

                payment.setStatus(paymentStatus.EXPIRED);
                paymentRepository.save(payment);

                booking.setStatus(status.EXPIRED);
                bookingRepository.save(booking);
            }
        }
    }
    public void releaseSeats(Booking booking){
        List<com.example.Event_booking.entity.BookingSeat> bookingSeats=bookingSeatRepository.findByBookingId(booking.getId());

        for(com.example.Event_booking.entity.BookingSeat bookingSeat : bookingSeats){

            Long eventId=booking.getEvent().getId();
            Long seatId=bookingSeat.getSeat().getId();

            String key= "event:" +eventId+ ":seat:" + seatId;

            redisService.deleteValue(key);
        }
    }
}
