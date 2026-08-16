package com.example.Event_booking.controller;

import com.example.Event_booking.service.RedisService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RedisController {
    private final RedisService redisService;

    public RedisController(RedisService redisService) {
        this.redisService = redisService;
    }

    @GetMapping("/redis-test")
    public String redisTest() {
        redisService.setValue("test:key", "hello-redis", 60);
        return redisService.getValue("test:key");
    }
}
