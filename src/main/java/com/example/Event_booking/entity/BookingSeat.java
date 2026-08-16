package com.example.Event_booking.entity;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name="Booking_Seat",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "seat_id")
        }
            )
public class BookingSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id",nullable = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "seat_id",nullable = false)
    private Seat seat;
}
