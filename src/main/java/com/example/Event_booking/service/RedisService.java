package com.example.Event_booking.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService {
    private final StringRedisTemplate redisTemplate;

    public RedisService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void setValue(String key,String value,long timeout){
        redisTemplate.opsForValue().set(key,value,timeout, TimeUnit.SECONDS);
    }
    public String getValue(String key){
        return redisTemplate.opsForValue().get(key);
    }
    public boolean reserveSeat(String key,String userId,long timeout){
        Boolean success=redisTemplate.opsForValue()
                .setIfAbsent(key,userId,timeout,TimeUnit.SECONDS);
        return Boolean.TRUE.equals(success);
    }
    public void deleteValue(String key){
        redisTemplate.delete(key);
    }

}
