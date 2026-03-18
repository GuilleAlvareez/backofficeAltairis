package com.altairis.backoffice.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "hotels")
@Data
@NoArgsConstructor
public class Hotel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String country;

  @Column(nullable = false)
  private String city;

  private String address;
  private Integer stars;
  private String category;
  private String phone;
  private String email;
  private Boolean active = true;

  @JsonIgnore
  @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<RoomType> roomTypes = new ArrayList<>();
}