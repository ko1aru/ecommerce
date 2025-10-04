package com.local.ECommerce.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RatingResponseDTO {
	private long id;
	private int rating;
	private String review;
	private long productId;
	private String username;
}