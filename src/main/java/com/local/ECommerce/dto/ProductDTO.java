package com.local.ECommerce.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductDTO {
	private long id;
	private String name;
	private String description;
	private String brand;
	private String category;
	private BigDecimal price;
	private int stock;
	private String imageUrl;
	private int averageRating;
	private List<RatingResponseDTO> ratings;
	private boolean wishlisted;
}