package com.carrental.auth_service.controller;

import com.carrental.auth_service.dto.BookingRequest;
import com.carrental.auth_service.dto.BookingResponse;
import com.carrental.auth_service.entity.Booking;
import com.carrental.auth_service.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // ================= CREATE BOOKING =================
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        // 🔐 Spring Security guarantees this is NOT null
        Booking booking = bookingService.createBooking(
                request,
                userDetails.getUsername()
        );

        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setCarId(booking.getCar().getId());
        response.setCarName(booking.getCar().getName());
        response.setStartDate(booking.getStartDate());
        response.setEndDate(booking.getEndDate());
        response.setTotalPrice(booking.getTotalPrice());
        response.setStatus(booking.getStatus().name());

        return ResponseEntity.ok(response);
    }

    // ================= GET LOGGED-IN USER BOOKINGS =================
    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(
                bookingService.getUserBookings(userDetails.getUsername())
        );
    }

    // ================= CANCEL BOOKING =================
    @PutMapping("/{id}/cancel")
    public ResponseEntity<String> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        bookingService.cancelBooking(id, userDetails.getUsername());
        return ResponseEntity.ok("Booking cancelled successfully");
    }
}
