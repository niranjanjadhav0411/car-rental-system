package com.carrental.auth_service.controller;

import com.carrental.auth_service.entity.Car;
import com.carrental.auth_service.repository.CarRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin/cars")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final CarRepository carRepository;

    @PostMapping
    public ResponseEntity<Car> addCar(@Valid @RequestBody Car car) {

        car.setId(null); // ensure new entity
        car.setAvailable(true);

        Car savedCar = carRepository.save(car);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedCar);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Car> updateCar(
            @PathVariable Long id,
            @Valid @RequestBody Car carRequest
    ) {

        Optional<Car> optionalCar = carRepository.findById(id);

        if (optionalCar.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Car existingCar = optionalCar.get();

        existingCar.setBrand(carRequest.getBrand());
        existingCar.setModel(carRequest.getModel());
        existingCar.setPricePerDay(carRequest.getPricePerDay());
        existingCar.setAvailable(carRequest.isAvailable());

        Car updatedCar = carRepository.save(existingCar);

        return ResponseEntity.ok(updatedCar);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {

        if (!carRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        carRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
