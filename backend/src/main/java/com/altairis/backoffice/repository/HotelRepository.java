package com.altairis.backoffice.repository;

import com.altairis.backoffice.model.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

  @Query(value = "SELECT * FROM hotels WHERE " +
      ":search IS NULL OR " +
      "LOWER(name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
      "LOWER(city) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
      "LOWER(country) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
      "LOWER(category) LIKE LOWER(CONCAT('%', :search, '%'))", countQuery = "SELECT COUNT(*) FROM hotels WHERE " +
          ":search IS NULL OR " +
          "LOWER(name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
          "LOWER(city) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
          "LOWER(country) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
          "LOWER(category) LIKE LOWER(CONCAT('%', :search, '%'))", nativeQuery = true)
  Page<Hotel> searchHotels(@Param("search") String search, Pageable pageable);

  long countByActiveTrue();
}