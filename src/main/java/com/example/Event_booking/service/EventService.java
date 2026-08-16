package com.example.Event_booking.service;

import com.example.Event_booking.entity.Event;
import com.example.Event_booking.repo.EventRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class EventService {

    private final EventRepository eventRepository;
    public EventService(EventRepository eventRepository){
        this.eventRepository = eventRepository;
    }
    public void createEvent(Event event){
        eventRepository.save(event);
    }
    public List<Event> allEvents(){
        return eventRepository.findAll();
    }
    public Optional<Event> findEvent(Long id){
        return eventRepository.findById(id);
    }
    public void updateEvent(Long id,Event event){
        Event oldEvent=eventRepository.findById(id).orElseThrow();
        oldEvent.setName(event.getName());
        oldEvent.setDescription(event.getDescription());
        oldEvent.setStartTime(event.getStartTime());
        oldEvent.setEndTime(event.getEndTime());
        eventRepository.save(event);
    }
    public void deleteEvent(Long id){
        eventRepository.deleteById(id);
    }
}
