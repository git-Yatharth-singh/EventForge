package com.example.Event_booking.Request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class BookingRequest {
    private Long userId;
    private Long eventId;
    private List<Long> seatIds;
}
