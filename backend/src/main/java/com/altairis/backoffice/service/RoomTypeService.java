package com.altairis.backoffice.service;

import com.altairis.backoffice.model.Hotel;
import com.altairis.backoffice.model.RoomType;
import com.altairis.backoffice.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomTypeService {

  private final RoomTypeRepository roomTypeRepository;
  private final HotelService hotelService;

  public List<RoomType> findByHotelId(Long hotelId) {
    return roomTypeRepository.findByHotelId(hotelId);
  }

  public List<RoomType> findAll() {
    return roomTypeRepository.findAll();
  }

  public RoomType findById(Long id) {
    return roomTypeRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("RoomType not found with id: " + id));
  }

  public RoomType save(RoomType roomType, Long hotelId) {
    Hotel hotel = hotelService.findById(hotelId);
    roomType.setHotel(hotel);
    return roomTypeRepository.save(roomType);
  }

  public RoomType update(Long id, RoomType roomTypeData) {
    RoomType roomType = findById(id);
    roomType.setName(roomTypeData.getName());
    roomType.setDescription(roomTypeData.getDescription());
    roomType.setCapacity(roomTypeData.getCapacity());
    roomType.setPricePerNight(roomTypeData.getPricePerNight());
    roomType.setActive(roomTypeData.getActive());
    return roomTypeRepository.save(roomType);
  }

  public void delete(Long id) {
    findById(id);
    roomTypeRepository.deleteById(id);
  }
}