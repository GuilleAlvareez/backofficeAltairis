package com.altairis.backoffice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "room_types")
@Data
@NoArgsConstructor
public class RoomType {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  private String description;
  private Integer capacity;
  private BigDecimal pricePerNight;
  private Boolean active = true;

  @JsonIgnoreProperties({ "roomTypes", "hibernateLazyInitializer" })
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "hotel_id", nullable = false)
  private Hotel hotel;

  @JsonIgnore
  @OneToMany(mappedBy = "roomType", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Availability> availabilities = new ArrayList<>();
}