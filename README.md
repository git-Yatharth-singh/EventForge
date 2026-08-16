# EventForge

EventForge is an event booking platform built with Spring Boot that allows
users to discover events, select seats, and make bookings securely.

## Features

- User registration and login
- JWT-based authentication and authorization
- Event creation and management
- Seat selection and booking
- Temporary seat reservation using Redis
- Automatic seat reservation expiration using Redis TTL
- MySQL database for persistent data
- Payment integration
- Booking management
- RESTful APIs
- Secure password hashing using BCrypt

## Tech Stack

- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA / Hibernate
- MySQL
- Redis
- Docker
- Maven

## Architecture

Client
  ↓
Spring Boot REST API
  ↓
Spring Security + JWT
  ↓
Services
  ↓
MySQL + Redis

## Seat Reservation

Redis is used to temporarily reserve seats while a user completes
the booking process. Redis TTL automatically releases a reservation
when it expires, preventing seats from being locked indefinitely.

## Authentication

Users authenticate using their email and password. After successful
authentication, the server generates a JWT which is used to access
protected endpoints.

## Project Status

🚧 Currently under development.
