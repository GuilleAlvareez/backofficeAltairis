package com.altairis.backoffice.controller;

import com.altairis.backoffice.model.Availability;
import com.altairis.backoffice.service.AvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AvailabilityController {

  private final AvailabilityService availabilityService;

  @GetMapping("/room-type/{roomTypeId}")
  public List<Availability> getByRoomType(
      @PathVariable Long roomTypeId,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
    return availabilityService.findByRoomTypeAndDateRange(roomTypeId, from, to);
  }

  @GetMapping("/hotel/{hotelId}")
  public List<Availability> getByHotel(
      @PathVariable Long hotelId,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
    return availabilityService.findByHotelAndDateRange(hotelId, from, to);
  }

  @PostMapping
  public ResponseEntity<Availability> save(
      @RequestBody Availability availability,
      @RequestParam Long roomTypeId) {
    return ResponseEntity.ok(availabilityService.save(availability, roomTypeId));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    availabilityService.delete(id);
    return ResponseEntity.noContent().build();
  }
}