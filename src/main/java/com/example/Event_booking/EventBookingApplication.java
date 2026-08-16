package com.example.Event_booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class EventBookingApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventBookingApplication.class, args);
	}

}
