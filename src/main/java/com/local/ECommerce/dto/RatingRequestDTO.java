package com.local.ECommerce.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RatingRequestDTO {
	@NotNull
	@Min(1)
	@Max(5)
	private int rating;
	private String review;
}