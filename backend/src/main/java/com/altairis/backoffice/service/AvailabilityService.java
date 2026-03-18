package com.altairis.backoffice.service;

import com.altairis.backoffice.model.Availability;
import com.altairis.backoffice.model.RoomType;
import com.altairis.backoffice.repository.AvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

  private final AvailabilityRepository availabilityRepository;
  private final RoomTypeService roomTypeService;

  public List<Availability> findByRoomTypeAndDateRange(Long roomTypeId, LocalDate from, LocalDate to) {
    return availabilityRepository.findByRoomTypeIdAndDateBetweenOrderByDate(roomTypeId, from, to);
  }

  public List<Availability> findByHotelAndDateRange(Long hotelId, LocalDate from, LocalDate to) {
    return availabilityRepository.findByHotelIdAndDateRange(hotelId, from, to);
  }

  public Availability save(Availability availability, Long roomTypeId) {
    RoomType roomType = roomTypeService.findById(roomTypeId);
    availability.setRoomType(roomType);

    // Si ya existe disponibilidad para ese día, la actualizamos
    return availabilityRepository
        .findByRoomTypeIdAndDate(roomTypeId, availability.getDate())
        .map(existing -> {
          existing.setTotalRooms(availability.getTotalRooms());
          existing.setAvailableRooms(availability.getAvailableRooms());
          return availabilityRepository.save(existing);
        })
        .orElseGet(() -> availabilityRepository.save(availability));
  }

  public void delete(Long id) {
    availabilityRepository.deleteById(id);
  }
}