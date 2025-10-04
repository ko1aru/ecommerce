package com.local.ECommerce.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.local.ECommerce.dto.OrderResponseDTO;
import com.local.ECommerce.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {
	private final OrderService service;
	
	@PostMapping("/placeorder")
	public ResponseEntity<OrderResponseDTO> placeOrder() {
		return ResponseEntity.ok(service.placeOrder());
	}
	
	@GetMapping("/orderhistory")
	public ResponseEntity<List<OrderResponseDTO>> getOrders() {
		return ResponseEntity.ok(service.getOrdersByUser());
	}
	
	@PostMapping("/pay/{id}")
	public ResponseEntity<Map<String, String>> pay(@PathVariable long id) {
		return ResponseEntity.ok(service.pay(id));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, String>> cancelOrder(@PathVariable long id) {
		return ResponseEntity.ok(service.cancelOrder(id));
	}
}