package com.local.ECommerce.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.local.ECommerce.model.OrderItem;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderResponseDTO {
	private long id;
	private List<OrderItem> items;
	private BigDecimal totalPrice;
	private Date date;
	private String status;
}