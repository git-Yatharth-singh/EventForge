package com.example.Event_booking.service;

import com.example.Event_booking.entity.Seat;
import com.example.Event_booking.entity.Venue;
import com.example.Event_booking.repo.SeatRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final VenueService venueService;

    public SeatService(SeatRepository seatRepository, VenueService venueService) {
        this.seatRepository = seatRepository;
        this.venueService = venueService;
    }
    public void createSeat(Seat seat){
        seatRepository.save(seat);
    }
    public List<Seat> getAllSeat(){
        return seatRepository.findAll();
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
