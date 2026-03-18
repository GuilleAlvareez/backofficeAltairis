package com.altairis.backoffice.service;

import com.altairis.backoffice.model.Hotel;
import com.altairis.backoffice.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelService {

  private final HotelRepository hotelRepository;

  public Page<Hotel> searchHotels(String search, Pageable pageable) {
    return hotelRepository.searchHotels(search, pageable);
  }

  public List<Hotel> findAll() {
    return hotelRepository.findAll();
  }

  public Hotel findById(Long id) {
    return hotelRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + id));
  }

  public Hotel save(Hotel hotel) {
    return hotelRepository.save(hotel);
  }

  public Hotel update(Long id, Hotel hotelData) {
    Hotel hotel = findById(id);
    hotel.setName(hotelData.getName());
    hotel.setCountry(hotelData.getCountry());
    hotel.setCity(hotelData.getCity());
    hotel.setAddress(hotelData.getAddress());
    hotel.setStars(hotelData.getStars());
    hotel.setCategory(hotelData.getCategory());
    hotel.setPhone(hotelData.getPhone());
    hotel.setEmail(hotelData.getEmail());
    hotel.setActive(hotelData.getActive());
    return hotelRepository.save(hotel);
  }

  public void delete(Long id) {
    findById(id);
    hotelRepository.deleteById(id);
  }

  public long countActive() {
    return hotelRepository.countByActiveTrue();
  }
}