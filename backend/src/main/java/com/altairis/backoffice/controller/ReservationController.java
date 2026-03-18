package com.altairis.backoffice.controller;

import com.altairis.backoffice.model.Reservation;
import com.altairis.backoffice.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationController {

  private final ReservationService reservationService;

  @GetMapping
  public Page<Reservation> getAll(
      @RequestParam(defaultValue = "") String search,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    if (search.isBlank()) {
      return reservationService.findAll(
          PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id")));
    }
    return reservationService.search(
        search,
        PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id")));
  }

  @GetMapping("/{id}")
  public ResponseEntity<Reservation> getById(@PathVariable Long id) {
    return ResponseEntity.ok(reservationService.findById(id));
  }

  @PostMapping
  public ResponseEntity<Reservation> create(
      @RequestBody Reservation reservation,
      @RequestParam Long roomTypeId) {
    return ResponseEntity.ok(reservationService.save(reservation, roomTypeId));
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<Reservation> updateStatus(
      @PathVariable Long id,
      @RequestParam Reservation.ReservationStatus status) {
    return ResponseEntity.ok(reservationService.updateStatus(id, status));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    reservationService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/dashboard")
  public Map<String, Object> getDashboardStats() {
    return reservationService.getDashboardStats();
  }
}