package com.example.Event_booking.controller;

import com.example.Event_booking.entity.Event;
import com.example.Event_booking.service.EventService;
import com.example.Event_booking.service.RedisService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {
    private final EventService eventService;
    private final RedisService redisService;

    public EventController(EventService eventService, RedisService redisService) {
        this.eventService = eventService;
        this.redisService = redisService;
    }

    @PostMapping
    public void createEvent(@RequestBody Event event){
        eventService.createEvent(event);
    }

    @GetMapping
    public List<Event> allEvent(){
        return eventService.allEvents();
    }

    @GetMapping("/{id}")
    public Event findEvent(@PathVariable Long id){
        return eventService.findEvent(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public void updateEvent(@PathVariable Long id, @RequestBody Event event){
        eventService.updateEvent(id,event);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id){
        eventService.deleteEvent(id);
    }

    @GetMapping("/reserve-test")
    public boolean reserveTest(){
        return redisService.reserveSeat(
                "event:1:seat:A1",
                "user123",
                60
        );
    }
}
