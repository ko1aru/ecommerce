package com.local.ECommerce.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.local.ECommerce.dto.CartItemRequestDTO;
import com.local.ECommerce.dto.CartItemResponseDTO;
import com.local.ECommerce.service.CartItemService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartItemController {
	private final CartItemService service;

	@GetMapping
	public ResponseEntity<List<CartItemResponseDTO>> getCart() {
		return ResponseEntity.ok(service.getAllCartItems());
	}

	@PostMapping("/add")
	public ResponseEntity<CartItemResponseDTO> addCartItem(@RequestBody CartItemRequestDTO cartItemRequest) {
		return ResponseEntity.ok(service.addCartItem(cartItemRequest));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, String>> deleteCartItem(@PathVariable long id) {
		return ResponseEntity.ok(service.deleteCartItem(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<CartItemResponseDTO> updateQuantity(@PathVariable int id, @RequestParam int quantity) {
		return ResponseEntity.ok(service.updateQuantity(id, quantity));
	}
	
	@GetMapping("/totalPrice")
	public ResponseEntity<Map<String, BigDecimal>> getTotalCartPrice() {
		return ResponseEntity.ok(service.getTotalCartPrice());
	}
}