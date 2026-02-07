package com.carrental.auth_service.controller;

import com.carrental.auth_service.dto.BookingRequest;
import com.carrental.auth_service.entity.*;
import com.carrental.auth_service.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;

    @PostMapping
    public Booking createBooking(
            @RequestBody BookingRequest request,
            Authentication authentication
    ) {

        User user = userRepository.findByEmail("nj@gmail.com").orElseThrow();

        Car car = carRepository.findById(request.getCarId())
                .orElseThrow();

        long days = ChronoUnit.DAYS.between(
                request.getStartDate(),
                request.getEndDate()
        );

        Booking booking = Booking.builder()
                .car(car)
                .user(user)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalDays((int) days)
                .totalPrice(days * car.getPricePerDay())
                .status(BookingStatus.CONFIRMED)
                .build();

        return bookingRepository.save(booking);
    }

    @GetMapping("/my")
    public List<Booking> myBookings(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow();
        return bookingRepository.findByUser(user);
    }
}
