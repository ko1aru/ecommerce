package com.local.ECommerce.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class CartItemRequestDTO {
	
	private long productId;
	
	@Min(1)
	private int quantity;
}