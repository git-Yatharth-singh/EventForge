package com.example.Event_booking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="Seat")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(unique = true,nullable = false)
    private String seatNo;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Event event;

    @ManyToOne
    private User user;
    @Column(nullable = false)
    private BigDecimal price;

}
