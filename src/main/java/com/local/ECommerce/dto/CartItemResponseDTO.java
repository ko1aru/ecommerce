package com.local.ECommerce.dto;

import java.math.BigDecimal;

import com.local.ECommerce.model.CartItem;
import com.local.ECommerce.model.Product;

import lombok.Data;

@Data
public class CartItemResponseDTO {
	private long id;
	private Product product;
	private int quantity;
	private BigDecimal totalPrice;
	
	public CartItemResponseDTO(CartItem item) {
		this.id = item.getId();
		this.product = item.getProduct();
		this.quantity = item.getQuantity();
		this.totalPrice = item.getTotalPrice();
	}
}