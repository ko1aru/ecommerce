package com.local.ECommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class WishlistItemResponseDTO {
	private long id;
	private ProductDTO product;
}