package com.altairis.backoffice.service;

import com.altairis.backoffice.model.Reservation;
import com.altairis.backoffice.model.RoomType;
import com.altairis.backoffice.model.Hotel;
import com.altairis.backoffice.repository.ReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

  @Mock
  private ReservationRepository reservationRepository;

  @Mock
  private RoomTypeService roomTypeService;

  @InjectMocks
  private ReservationService reservationService;

  private Reservation reservation;
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
    roomType.setHotel(hotel);

    reservation = new Reservation();
    reservation.setId(1L);
    reservation.setReservationCode("ALT-000001");
    reservation.setRoomType(roomType);
    reservation.setGuestName("Carlos Martínez");
    reservation.setGuestEmail("carlos@email.com");
    reservation.setCheckIn(LocalDate.now().plusDays(1));
    reservation.setCheckOut(LocalDate.now().plusDays(4));
    reservation.setNumberOfRooms(1);
    reservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
  }

  @Test
  void deberiaEncontrarReservaPorId() {
    when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

    Reservation result = reservationService.findById(1L);

    assertNotNull(result);
    assertEquals("ALT-000001", result.getReservationCode());
    assertEquals("Carlos Martínez", result.getGuestName());
  }

  @Test
  void deberiaLanzarExcepcionSiReservaNoExiste() {
    when(reservationRepository.findById(99L)).thenReturn(Optional.empty());

    RuntimeException ex = assertThrows(RuntimeException.class,
        () -> reservationService.findById(99L));

    assertEquals("Reservation not found with id: 99", ex.getMessage());
  }

  @Test
  void deberiaCalcularPrecioTotalCorrectamente() {
    // 3 noches x 650€ x 1 habitación = 1950€
    when(roomTypeService.findById(1L)).thenReturn(roomType);
    when(reservationRepository.save(any(Reservation.class))).thenAnswer(i -> i.getArgument(0));

    Reservation newReservation = new Reservation();
    newReservation.setGuestName("Carlos Martínez");
    newReservation.setGuestEmail("carlos@email.com");
    newReservation.setCheckIn(LocalDate.now().plusDays(1));
    newReservation.setCheckOut(LocalDate.now().plusDays(4));
    newReservation.setNumberOfRooms(1);

    Reservation result = reservationService.save(newReservation, 1L);

    assertEquals(new BigDecimal("1950.00"), result.getTotalPrice());
  }

  @Test
  void deberiaCalcularPrecioConVariasHabitaciones() {
    // 3 noches x 650€ x 2 habitaciones = 3900€
    when(roomTypeService.findById(1L)).thenReturn(roomType);
    when(reservationRepository.save(any(Reservation.class))).thenAnswer(i -> i.getArgument(0));

    Reservation newReservation = new Reservation();
    newReservation.setGuestName("Carlos Martínez");
    newReservation.setGuestEmail("carlos@email.com");
    newReservation.setCheckIn(LocalDate.now().plusDays(1));
    newReservation.setCheckOut(LocalDate.now().plusDays(4));
    newReservation.setNumberOfRooms(2);

    Reservation result = reservationService.save(newReservation, 1L);

    assertEquals(new BigDecimal("3900.00"), result.getTotalPrice());
  }

  @Test
  void deberiaGenerarCodigoDeReserva() {
    when(roomTypeService.findById(1L)).thenReturn(roomType);
    when(reservationRepository.save(any(Reservation.class))).thenAnswer(i -> i.getArgument(0));

    Reservation newReservation = new Reservation();
    newReservation.setGuestName("Carlos Martínez");
    newReservation.setGuestEmail("carlos@email.com");
    newReservation.setCheckIn(LocalDate.now().plusDays(1));
    newReservation.setCheckOut(LocalDate.now().plusDays(4));
    newReservation.setNumberOfRooms(1);

    Reservation result = reservationService.save(newReservation, 1L);

    assertNotNull(result.getReservationCode());
    assertTrue(result.getReservationCode().startsWith("ALT-"));
    assertEquals(10, result.getReservationCode().length());
  }

  @Test
  void deberiaActualizarEstadoDeReserva() {
    when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
    when(reservationRepository.save(any(Reservation.class))).thenReturn(reservation);

    Reservation result = reservationService.updateStatus(1L, Reservation.ReservationStatus.CANCELLED);

    assertEquals(Reservation.ReservationStatus.CANCELLED, result.getStatus());
    verify(reservationRepository, times(1)).save(any(Reservation.class));
  }

  @Test
  void deberiaBorrarReserva() {
    when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
    doNothing().when(reservationRepository).deleteById(1L);

    reservationService.delete(1L);

    verify(reservationRepository, times(1)).deleteById(1L);
  }

  @Test
  void deberiaRetornarTodasLasReservasPaginadas() {
    Page<Reservation> page = new PageImpl<>(List.of(reservation));
    when(reservationRepository.findAll(any(PageRequest.class))).thenReturn(page);

    Page<Reservation> result = reservationService.findAll(PageRequest.of(0, 10));

    assertEquals(1, result.getTotalElements());
  }
}