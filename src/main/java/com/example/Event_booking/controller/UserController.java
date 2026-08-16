package com.example.Event_booking.controller;

import com.example.Event_booking.entity.User;
import com.example.Event_booking.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public void createUser(@RequestBody User user){
        userService.createUser(user);
    }

    @GetMapping
    public List<User> allUsers(){
        return userService.allUsers();
    }

    @GetMapping("/email/{email}")
    public User findByEmail(@PathVariable String email){
        return userService.findByEmail(email);
    }
}
