package com.example.Event_booking.controller;

import com.example.Event_booking.entity.Venue;
import com.example.Event_booking.service.VenueService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/venues")
public class VenueController {

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }
     @PostMapping
    public void createVenue(@RequestBody Venue venue){
        venueService.createVenue(venue);
    }

    @GetMapping
    public List<Venue> allVenue(){
        return venueService.allVenue();
    }

    @GetMapping("/{id}")
    public Venue getVenue(@PathVariable Long id){
        return venueService.findVenue(id);
    }

    @PutMapping("/{id}")
    public void updateVenue(@PathVariable Long id,@RequestBody Venue venue){
        venueService.updateVenue(venue,id);
    }

    @DeleteMapping("/{id}")
    public void deleteVenue(@PathVariable Long id){
        venueService.deleteVenue(id);
    }
}
