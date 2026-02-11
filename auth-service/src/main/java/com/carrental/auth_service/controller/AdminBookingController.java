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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminBookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {

        List<BookingResponse> responses = bookingService.getAllBookings()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    /**
     * Approve booking
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveBooking(@PathVariable Long id) {

        bookingService.updateBookingStatus(id, BookingStatus.CONFIRMED);

        return ResponseEntity.ok("Booking approved successfully");
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<String> rejectBooking(@PathVariable Long id) {

        bookingService.updateBookingStatus(id, BookingStatus.REJECTED);

        return ResponseEntity.ok("Booking rejected successfully");
    }

    private BookingResponse mapToResponse(Booking booking) {

        String carName = booking.getCar() != null
                ? booking.getCar().getBrand() + " " + booking.getCar().getModel()
                : "N/A";

        return new BookingResponse(
                booking.getId(),
                carName,
                booking.getStartDate(),
                booking.getEndDate(),
                booking.getTotalPrice(),
                booking.getStatus().name()
        );
    }
}
