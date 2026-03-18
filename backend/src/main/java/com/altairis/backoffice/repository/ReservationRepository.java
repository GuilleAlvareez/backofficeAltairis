package com.altairis.backoffice.repository;

import com.altairis.backoffice.model.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

  Optional<Reservation> findByReservationCode(String code);

  Page<Reservation> findByGuestNameContainingIgnoreCaseOrGuestEmailContainingIgnoreCase(
      String name, String email, Pageable pageable);

  List<Reservation> findByCheckInBetweenOrderByCheckIn(LocalDate from, LocalDate to);

  @Query("SELECT COUNT(r) FROM Reservation r WHERE r.status = 'CONFIRMED'")
  long countConfirmed();

  @Query("SELECT COUNT(r) FROM Reservation r WHERE r.checkIn = :today")
  long countCheckInsToday(@Param("today") LocalDate today);

  @Query("SELECT COUNT(r) FROM Reservation r WHERE r.checkOut = :today")
  long countCheckOutsToday(@Param("today") LocalDate today);

  @Query("SELECT r.status, COUNT(r) FROM Reservation r GROUP BY r.status")
  List<Object[]> countByStatus();
}