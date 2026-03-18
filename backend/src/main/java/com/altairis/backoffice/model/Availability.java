package com.altairis.backoffice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "availabilities")
@Data
@NoArgsConstructor
public class Availability {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @JsonIgnoreProperties({ "availabilities", "hibernateLazyInitializer" })
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "room_type_id", nullable = false)
  private RoomType roomType;

  @Column(nullable = false)
  private LocalDate date;

  @Column(nullable = false)
  private Integer totalRooms;

  @Column(nullable = false)
  private Integer availableRooms;

  @Transient
  public Integer getBookedRooms() {
    return totalRooms - availableRooms;
  }
}