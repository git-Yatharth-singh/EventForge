package com.example.Event_booking.service;

import com.example.Event_booking.Request.SeatRequest;
import com.example.Event_booking.entity.BookingSeat;
import com.example.Event_booking.entity.Event;
import com.example.Event_booking.entity.Seat;
import com.example.Event_booking.entity.Venue;
import com.example.Event_booking.repo.BookingSeatRepository;
import com.example.Event_booking.repo.EventRepository;
import com.example.Event_booking.repo.SeatRepository;
import com.example.Event_booking.response.SeatResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final VenueService venueService;
    private final BookingSeatRepository bookingSeatRepository;
    private final RedisService redisService;
    private final EventRepository eventRepository;

    public SeatService(SeatRepository seatRepository, VenueService venueService, BookingSeatRepository bookingSeatRepository, RedisService redisService, EventRepository eventRepository) {
        this.seatRepository = seatRepository;
        this.venueService = venueService;
        this.bookingSeatRepository = bookingSeatRepository;
        this.redisService = redisService;
        this.eventRepository = eventRepository;
    }
    public void createSeat(SeatRequest request) {

        if (request.getSeatNo() == null || request.getSeatNo().isBlank()) {
            throw new RuntimeException("Seat number is required");
        }

        if (request.getPrice() == null) {
            throw new RuntimeException("Price is required");
        }

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Seat seat = new Seat();

        seat.setSeatNo(request.getSeatNo());
        seat.setPrice(request.getPrice());
        seat.setEvent(event);

        seatRepository.save(seat);
    }
    public List<SeatResponse> getAllSeat(){
        List <Seat> seats=seatRepository.findAll();
        return seats.stream().map(seat -> {
            if (seat.getEvent() == null) {
                throw new RuntimeException("Seat " + seat.getId() + " has no event");
            }
            String key="event:"+ seat.getEvent().getId()+":seat:"+seat.getId();
            String status;
            List<BookingSeat> bookingSeats =
                    bookingSeatRepository.findBySeat(seat);

            boolean booked = bookingSeats.stream()
                    .anyMatch(bs ->
                            bs.getBooking().getStatus() != null
                                    && bs.getBooking().getStatus().name().equals("CONFIRMED")
                    );

            if (booked) {

                status = "BOOKED";

            } else if (redisService.getValue(key) != null) {

                status = "RESERVED";

            } else {

                status = "AVAILABLE";
            }
            return new SeatResponse(
                    seat.getId(),
                    seat.getSeatNo(),
                    seat.getPrice().doubleValue(),
                    status
            );
        }).toList();
    }
    public Seat findSeat(Long id){
        return seatRepository.findById(id).orElseThrow();
    }
    public void updateSeat(Long id,Seat seat){
        Seat oldSeat=seatRepository.findById(id).orElseThrow();
        oldSeat.setSeatNo(seat.getSeatNo());
        seatRepository.save(oldSeat);
    }
    public void deleteSeat(Long id){
        seatRepository.deleteById(id);
    }

    public List<Seat> findByVenueid(Long venueId){
        Venue venue = venueService.findVenue(venueId);
        return seatRepository.findByEventVenue(venue);
    }

}
