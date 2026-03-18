package com.altairis.backoffice.controller;

import com.altairis.backoffice.model.Hotel;
import com.altairis.backoffice.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HotelController {

  private final HotelService hotelService;

  @GetMapping
  public Page<Hotel> getAll(
      @RequestParam(defaultValue = "") String search,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    return hotelService.searchHotels(
        search.isBlank() ? null : search,
        PageRequest.of(page, size, Sort.by("name")));
  }

  @GetMapping("/all")
  public List<Hotel> getAllNoPagination() {
    return hotelService.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Hotel> getById(@PathVariable Long id) {
    return ResponseEntity.ok(hotelService.findById(id));
  }

  @PostMapping
  public ResponseEntity<Hotel> create(@RequestBody Hotel hotel) {
    return ResponseEntity.ok(hotelService.save(hotel));
  }

  @PutMapping("/{id}")
  public ResponseEntity<Hotel> update(@PathVariable Long id, @RequestBody Hotel hotel) {
    return ResponseEntity.ok(hotelService.update(id, hotel));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    hotelService.delete(id);
    return ResponseEntity.noContent().build();
  }
}