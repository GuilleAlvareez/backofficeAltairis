package com.altairis.backoffice.service;

import com.altairis.backoffice.model.Availability;
import com.altairis.backoffice.model.RoomType;
import com.altairis.backoffice.repository.AvailabilityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AvailabilityServiceTest {

  @Mock
  private AvailabilityRepository availabilityRepository;

  @Mock
  private RoomTypeService roomTypeService;

  @InjectMocks
  private AvailabilityService availabilityService;

  private Availability availability;
  private RoomType roomType;

  @BeforeEach
  void setUp() {
    roomType = new RoomType();
    roomType.setId(1L);
    roomType.setName("Suite Junior");

    availability = new Availability();
    availability.setId(1L);
    availability.setRoomType(roomType);
    availability.setDate(LocalDate.now().plusDays(1));
    availability.setTotalRooms(10);
    availability.setAvailableRooms(5);
  }

  @Test
  void deberiaEncontrarDisponibilidadPorRangoFechas() {
    LocalDate from = LocalDate.now();
    LocalDate to = LocalDate.now().plusDays(7);

    when(availabilityRepository.findByRoomTypeIdAndDateBetweenOrderByDate(1L, from, to))
        .thenReturn(List.of(availability));

    List<Availability> result = availabilityService.findByRoomTypeAndDateRange(1L, from, to);

    assertEquals(1, result.size());
    assertEquals(5, result.get(0).getAvailableRooms());
  }

  @Test
  void deberiaCrearNuevaDisponibilidadSiNoExiste() {
    when(roomTypeService.findById(1L)).thenReturn(roomType);
    when(availabilityRepository.findByRoomTypeIdAndDate(1L, availability.getDate()))
        .thenReturn(Optional.empty());
    when(availabilityRepository.save(any(Availability.class))).thenReturn(availability);

    Availability result = availabilityService.save(availability, 1L);

    assertNotNull(result);
    assertEquals(10, result.getTotalRooms());
    assertEquals(5, result.getAvailableRooms());
    verify(availabilityRepository, times(1)).save(any(Availability.class));
  }

  @Test
  void deberiaActualizarDisponibilidadSiYaExiste() {
    when(roomTypeService.findById(1L)).thenReturn(roomType);
    when(availabilityRepository.findByRoomTypeIdAndDate(1L, availability.getDate()))
        .thenReturn(Optional.of(availability));
    when(availabilityRepository.save(any(Availability.class))).thenReturn(availability);

    Availability updated = new Availability();
    updated.setDate(availability.getDate());
    updated.setTotalRooms(20);
    updated.setAvailableRooms(15);

    Availability result = availabilityService.save(updated, 1L);

    assertNotNull(result);
    verify(availabilityRepository, times(1)).save(any(Availability.class));
  }

  @Test
  void deberiaCalcularHabitacionesOcupadas() {
    assertEquals(5, availability.getBookedRooms());
  }

  @Test
  void deberiaBorrarDisponibilidad() {
    doNothing().when(availabilityRepository).deleteById(1L);

    availabilityService.delete(1L);

    verify(availabilityRepository, times(1)).deleteById(1L);
  }
}