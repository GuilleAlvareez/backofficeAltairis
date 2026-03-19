package com.altairis.backoffice.service;

import com.altairis.backoffice.model.Hotel;
import com.altairis.backoffice.model.RoomType;
import com.altairis.backoffice.repository.RoomTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomTypeServiceTest {

  @Mock
  private RoomTypeRepository roomTypeRepository;

  @Mock
  private HotelService hotelService;

  @InjectMocks
  private RoomTypeService roomTypeService;

  private RoomType roomType;
  private Hotel hotel;

  @BeforeEach
  void setUp() {
    hotel = new Hotel();
    hotel.setId(1L);
    hotel.setName("Hotel Arts Barcelona");

    roomType = new RoomType();
    roomType.setId(1L);
    roomType.setName("Suite Junior");
    roomType.setPricePerNight(new BigDecimal("650.00"));
    roomType.setCapacity(2);
    roomType.setActive(true);
    roomType.setHotel(hotel);
  }

  @Test
  void deberiaEncontrarRoomTypePorId() {
    when(roomTypeRepository.findById(1L)).thenReturn(Optional.of(roomType));

    RoomType result = roomTypeService.findById(1L);

    assertNotNull(result);
    assertEquals("Suite Junior", result.getName());
  }

  @Test
  void deberiaLanzarExcepcionSiRoomTypeNoExiste() {
    when(roomTypeRepository.findById(99L)).thenReturn(Optional.empty());

    RuntimeException ex = assertThrows(RuntimeException.class,
        () -> roomTypeService.findById(99L));

    assertEquals("RoomType not found with id: 99", ex.getMessage());
  }

  @Test
  void deberiaEncontrarRoomTypesPorHotelId() {
    when(roomTypeRepository.findByHotelId(1L)).thenReturn(List.of(roomType));

    List<RoomType> result = roomTypeService.findByHotelId(1L);

    assertEquals(1, result.size());
    assertEquals("Suite Junior", result.get(0).getName());
  }

  @Test
  void deberiaGuardarRoomTypeAsociandoHotel() {
    when(hotelService.findById(1L)).thenReturn(hotel);
    when(roomTypeRepository.save(any(RoomType.class))).thenReturn(roomType);

    RoomType newRoomType = new RoomType();
    newRoomType.setName("Suite Junior");
    newRoomType.setPricePerNight(new BigDecimal("650.00"));

    RoomType result = roomTypeService.save(newRoomType, 1L);

    assertNotNull(result);
    assertEquals("Hotel Arts Barcelona", result.getHotel().getName());
    verify(roomTypeRepository, times(1)).save(any(RoomType.class));
  }

  @Test
  void deberiaActualizarRoomType() {
    RoomType updated = new RoomType();
    updated.setName("Suite Deluxe");
    updated.setPricePerNight(new BigDecimal("800.00"));
    updated.setCapacity(3);
    updated.setActive(true);

    when(roomTypeRepository.findById(1L)).thenReturn(Optional.of(roomType));
    when(roomTypeRepository.save(any(RoomType.class))).thenReturn(roomType);

    RoomType result = roomTypeService.update(1L, updated);

    assertNotNull(result);
    verify(roomTypeRepository, times(1)).save(any(RoomType.class));
  }

  @Test
  void deberiaBorrarRoomType() {
    when(roomTypeRepository.findById(1L)).thenReturn(Optional.of(roomType));
    doNothing().when(roomTypeRepository).deleteById(1L);

    roomTypeService.delete(1L);

    verify(roomTypeRepository, times(1)).deleteById(1L);
  }

  @Test
  void deberiaLanzarExcepcionAlBorrarRoomTypeInexistente() {
    when(roomTypeRepository.findById(99L)).thenReturn(Optional.empty());

    assertThrows(RuntimeException.class, () -> roomTypeService.delete(99L));
    verify(roomTypeRepository, never()).deleteById(any());
  }
}