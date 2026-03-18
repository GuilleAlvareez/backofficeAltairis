package com.altairis.backoffice.service;

import com.altairis.backoffice.model.Reservation;
import com.altairis.backoffice.model.RoomType;
import com.altairis.backoffice.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

  private final ReservationRepository reservationRepository;
  private final RoomTypeService roomTypeService;

  public Page<Reservation> findAll(Pageable pageable) {
    return reservationRepository.findAll(pageable);
  }

  public Page<Reservation> search(String search, Pageable pageable) {
    return reservationRepository
        .findByGuestNameContainingIgnoreCaseOrGuestEmailContainingIgnoreCase(
            search, search, pageable);
  }

  public Reservation findById(Long id) {
    return reservationRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
  }

  public Reservation save(Reservation reservation, Long roomTypeId) {
    RoomType roomType = roomTypeService.findById(roomTypeId);
    reservation.setRoomType(roomType);
    reservation.setReservationCode(generateCode());

    // Calcular precio total automáticamente
    if (roomType.getPricePerNight() != null) {
      long nights = reservation.getCheckIn()
          .until(reservation.getCheckOut())
          .getDays();
      reservation.setTotalPrice(
          roomType.getPricePerNight()
              .multiply(java.math.BigDecimal.valueOf(nights))
              .multiply(java.math.BigDecimal.valueOf(reservation.getNumberOfRooms())));
    }

    return reservationRepository.save(reservation);
  }

  public Reservation updateStatus(Long id, Reservation.ReservationStatus status) {
    Reservation reservation = findById(id);
    reservation.setStatus(status);
    return reservationRepository.save(reservation);
  }

  public void delete(Long id) {
    findById(id);
    reservationRepository.deleteById(id);
  }

  // Stats para el dashboard
  public Map<String, Object> getDashboardStats() {
    List<Object[]> statusCounts = reservationRepository.countByStatus();
    Map<String, Long> byStatus = statusCounts.stream()
        .collect(Collectors.toMap(
            row -> row[0].toString(),
            row -> (Long) row[1]));

    return Map.of(
        "totalReservations", reservationRepository.count(),
        "confirmed", byStatus.getOrDefault("CONFIRMED", 0L),
        "pending", byStatus.getOrDefault("PENDING", 0L),
        "cancelled", byStatus.getOrDefault("CANCELLED", 0L),
        "completed", byStatus.getOrDefault("COMPLETED", 0L),
        "checkInsToday", reservationRepository.countCheckInsToday(LocalDate.now()),
        "checkOutsToday", reservationRepository.countCheckOutsToday(LocalDate.now()));
  }

  private String generateCode() {
    return "ALT-" + String.format("%06d",
        (int) (Math.random() * 900000) + 100000);
  }
}