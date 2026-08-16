package com.example.Event_booking.controller;

import com.example.Event_booking.entity.Seat;
import com.example.Event_booking.entity.Venue;
import com.example.Event_booking.service.SeatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seats")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @PostMapping
    public void createSeat(@RequestBody Seat seat){
        seatService.createSeat(seat);
    }

    @GetMapping
    public List<Seat> allSeat(){
        return seatService.getAllSeat();
    }

    @GetMapping("/{id}")
    public Seat findSeat(@PathVariable Long id){
        return seatService.findSeat(id);
    }

    @PutMapping("/{id}")
    public void updateSeat(@PathVariable Long id,@RequestBody Seat seat){
        seatService.updateSeat(id,seat);
    }

    @DeleteMapping("/{id}")
    public void deleteSeat(@PathVariable Long id){
        seatService.deleteSeat(id);
    }
    @GetMapping("/venue/{id}")
    public List<Seat> findByVenue(@PathVariable Long id){
        return seatService.findByVenueid(id);
    }
}
