package com.local.ECommerce.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
	private List<OrderItem> items;
	
	private BigDecimal totalPrice;
	
	@ManyToOne
	private User user;
	
	private Date date;
	
	private String status;
	
	private String paymentStatus;
	
	public void setTotalPrice() {
		totalPrice = items
				.stream()
				.map(OrderItem :: getTotalPrice)
				.reduce(BigDecimal.ZERO, BigDecimal :: add);
	}
}