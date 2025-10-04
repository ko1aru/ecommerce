package com.local.ECommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TransactionHistoryDTO {
	private long transactionId;
	private long orderId;
	private BigDecimal amount;
	private String status;
	private LocalDateTime createdAt;
}