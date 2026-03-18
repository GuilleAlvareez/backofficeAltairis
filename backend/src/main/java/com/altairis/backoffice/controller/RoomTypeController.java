package com.altairis.backoffice.controller;

import com.altairis.backoffice.model.RoomType;
import com.altairis.backoffice.service.RoomTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-types")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RoomTypeController {

  private final RoomTypeService roomTypeService;

  @GetMapping
  public List<RoomType> getAll(@RequestParam(required = false) Long hotelId) {
    if (hotelId != null) {
      return roomTypeService.findByHotelId(hotelId);
    }
    return roomTypeService.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<RoomType> getById(@PathVariable Long id) {
    return ResponseEntity.ok(roomTypeService.findById(id));
  }

  @PostMapping
  public ResponseEntity<RoomType> create(
      @RequestBody RoomType roomType,
      @RequestParam Long hotelId) {
    return ResponseEntity.ok(roomTypeService.save(roomType, hotelId));
  }

  @PutMapping("/{id}")
  public ResponseEntity<RoomType> update(
      @PathVariable Long id,
      @RequestBody RoomType roomType) {
    return ResponseEntity.ok(roomTypeService.update(id, roomType));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    roomTypeService.delete(id);
    return ResponseEntity.noContent().build();
  }
}