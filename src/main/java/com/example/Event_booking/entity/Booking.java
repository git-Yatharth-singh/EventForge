package com.example.Event_booking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name="Booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Event event;

    @Enumerated(EnumType.STRING)
    private status Status;

    @CreationTimestamp
    private Instant createdAt;

    private BigDecimal totalAmount;
}
