package com.example.Event_booking.Request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class BookingRequest {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotEmpty(message = "At least one seat is required")
    private List<Long> seatIds;
}