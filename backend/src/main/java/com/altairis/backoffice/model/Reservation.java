package com.altairis.backoffice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
public class Reservation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable = false)
  private String reservationCode;

  @JsonIgnoreProperties({ "availabilities", "hibernateLazyInitializer" })
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "room_type_id", nullable = false)
  private RoomType roomType;

  @Column(nullable = false)
  private String guestName;

  @Column(nullable = false)
  private String guestEmail;

  private String guestPhone;

  @Column(nullable = false)
  private LocalDate checkIn;

  @Column(nullable = false)
  private LocalDate checkOut;

  private Integer numberOfRooms = 1;
  private BigDecimal totalPrice;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ReservationStatus status = ReservationStatus.CONFIRMED;

  private String notes;

  @Column(nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  public enum ReservationStatus {
    CONFIRMED, CANCELLED, COMPLETED, PENDING
  }
}