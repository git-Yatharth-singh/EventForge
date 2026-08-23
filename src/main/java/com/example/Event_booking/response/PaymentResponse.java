package com.example.Event_booking.response;

import com.example.Event_booking.entity.paymentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class PaymentResponse {

    private Long id;
    private paymentStatus status;
    private BigDecimal amount;
    private Long bookingId;
}