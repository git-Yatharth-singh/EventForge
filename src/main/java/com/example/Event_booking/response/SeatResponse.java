package com.example.Event_booking.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SeatResponse {

    private Long id;
    private String seatNo;
    private double price;
    private String status;
}