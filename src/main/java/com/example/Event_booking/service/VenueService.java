package com.example.Event_booking.service;

import com.example.Event_booking.entity.Venue;
import com.example.Event_booking.repo.VenueRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VenueService {

    private final VenueRepository venueRepository;

    public VenueService(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    public void createVenue(Venue venue){
        venueRepository.save(venue);
    }
    public List<Venue> allVenue(){
        return venueRepository.findAll();
    }
    public Venue findVenue(Long id){
        return venueRepository.findById(id).orElseThrow();
    }
    public void updateVenue(Venue venue,Long id){
        Venue oldVenue=venueRepository.findById(id).orElseThrow();
        oldVenue.setLocation(venue.getLocation());
        oldVenue.setName(venue.getName());
        venueRepository.save(venue);
    }
    public void deleteVenue(Long id){
        venueRepository.deleteById(id);
    }
}
