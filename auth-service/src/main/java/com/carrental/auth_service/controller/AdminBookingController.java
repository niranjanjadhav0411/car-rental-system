package com.carrental.auth_service.controller;

import com.carrental.auth_service.dto.BookingResponse;
import com.carrental.auth_service.entity.Booking;
import com.carrental.auth_service.entity.BookingStatus;
import com.carrental.auth_service.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminBookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(
                bookingService.getAllBookings()
                        .stream()
                        .map(this::mapToResponse)
                        .toList()
        );
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approve(@PathVariable Long id) {
        bookingService.updateBookingStatus(id, BookingStatus.CONFIRMED);
        return ResponseEntity.ok("Booking approved successfully");
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<String> reject(@PathVariable Long id) {
        bookingService.updateBookingStatus(id, BookingStatus.REJECTED);
        return ResponseEntity.ok("Booking rejected successfully");
    }

    private BookingResponse mapToResponse(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getCar().getBrand() + " " + b.getCar().getModel(),
                b.getStartDate(),
                b.getEndDate(),
                b.getTotalPrice(),
                b.getStatus().name()
        );
    }
}
