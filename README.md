# EventForge

EventForge is a full-stack event booking platform that allows users to
discover events, select seats, make secure bookings, and manage their
bookings.

## Live Demo

🌐 **Frontend:** https://eventforgeapp.onrender.com

🔗 **Backend API:** https://event-forge.up.railway.app

## Features

- User registration and login
- JWT-based authentication and authorization
- Event creation and management
- Seat selection and booking
- Temporary seat reservation using Redis
- Automatic seat reservation expiration using Redis TTL
- PostgreSQL database for persistent data
- Payment processing
- Booking management
- RESTful APIs
- Secure password hashing using BCrypt

## Tech Stack

- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA / Hibernate
- PostgreSQL
- Redis
- Docker
- Maven
- React
- Vite

## Architecture

React Frontend
       ↓
Spring Boot REST API
       ↓
Spring Security + JWT
       ↓
Service Layer
       ↓
PostgreSQL + Redis

## Seat Reservation

Redis is used to temporarily reserve seats while a user completes
the booking process. Redis TTL automatically releases a reservation
when it expires, preventing seats from being locked indefinitely.

## Authentication

Users authenticate using their email and password. After successful
authentication, the server generates a JWT which is used to access
protected endpoints.

## Deployment

- Frontend: Render
- Backend: Railway
- Database: PostgreSQL
- Redis: Redis

## Project Status

🚀 Deployed and functional.

The project is still being actively improved with additional features
and optimizations.
