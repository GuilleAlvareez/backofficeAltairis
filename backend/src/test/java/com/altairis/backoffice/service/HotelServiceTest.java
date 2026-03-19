package com.altairis.backoffice.service;

import com.altairis.backoffice.model.Hotel;
import com.altairis.backoffice.repository.HotelRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HotelServiceTest {

  @Mock
  private HotelRepository hotelRepository;

  @InjectMocks
  private HotelService hotelService;

  private Hotel hotel;

  @BeforeEach
  void setUp() {
    hotel = new Hotel();
    hotel.setId(1L);
    hotel.setName("Hotel Arts Barcelona");
    hotel.setCountry("España");
    hotel.setCity("Barcelona");
    hotel.setStars(5);
    hotel.setActive(true);
  }

  @Test
  void deberiaEncontrarHotelPorId() {
    when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));

    Hotel result = hotelService.findById(1L);

    assertNotNull(result);
    assertEquals("Hotel Arts Barcelona", result.getName());
    assertEquals("Barcelona", result.getCity());
  }

  @Test
  void deberiaLanzarExcepcionSiHotelNoExiste() {
    when(hotelRepository.findById(99L)).thenReturn(Optional.empty());

    RuntimeException ex = assertThrows(RuntimeException.class,
        () -> hotelService.findById(99L));

    assertEquals("Hotel not found with id: 99", ex.getMessage());
  }

  @Test
  void deberiaGuardarHotel() {
    when(hotelRepository.save(any(Hotel.class))).thenReturn(hotel);

    Hotel result = hotelService.save(hotel);

    assertNotNull(result);
    assertEquals("Hotel Arts Barcelona", result.getName());
    verify(hotelRepository, times(1)).save(hotel);
  }

  @Test
  void deberiaActualizarHotel() {
    Hotel updated = new Hotel();
    updated.setName("Hotel Ritz Madrid");
    updated.setCountry("España");
    updated.setCity("Madrid");
    updated.setStars(5);
    updated.setActive(true);

    when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));
    when(hotelRepository.save(any(Hotel.class))).thenReturn(hotel);

    Hotel result = hotelService.update(1L, updated);

    assertNotNull(result);
    verify(hotelRepository, times(1)).save(any(Hotel.class));
  }

  @Test
  void deberiaBorrarHotel() {
    when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));
    doNothing().when(hotelRepository).deleteById(1L);

    hotelService.delete(1L);

    verify(hotelRepository, times(1)).deleteById(1L);
  }

  @Test
  void deberiaLanzarExcepcionAlBorrarHotelInexistente() {
    when(hotelRepository.findById(99L)).thenReturn(Optional.empty());

    assertThrows(RuntimeException.class, () -> hotelService.delete(99L));
    verify(hotelRepository, never()).deleteById(any());
  }

  @Test
  void deberiaContarHotelesActivos() {
    when(hotelRepository.countByActiveTrue()).thenReturn(8L);

    long count = hotelService.countActive();

    assertEquals(8L, count);
  }
}