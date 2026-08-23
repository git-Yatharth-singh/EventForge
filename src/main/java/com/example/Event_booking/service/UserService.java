package com.example.Event_booking.service;

import com.example.Event_booking.Request.LoginRequest;
import com.example.Event_booking.entity.User;
import com.example.Event_booking.entity.role;
import com.example.Event_booking.repo.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;


    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public void createUser(User user){
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null) {
            user.setRole(role.USER);
        }

        userRepository.save(user);
    }

    public List<User> allUsers(){
        return userRepository.findAll();
    }
    public User findByEmail(String email){
        return userRepository.findByEmail(email).orElseThrow();
    }

    public String login(LoginRequest loginRequest){
        Authentication authentication=authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        return jwtService.GenerateJwt(loginRequest.getEmail());
    }
}
