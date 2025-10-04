package com.local.ECommerce.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.local.ECommerce.dto.WishlistItemResponseDTO;
import com.local.ECommerce.service.WishlistItemService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistItemController {
	private final WishlistItemService service;
	
	@GetMapping
	public ResponseEntity<List<WishlistItemResponseDTO>> getWishList() {
		return ResponseEntity.ok(service.getWishlist());
	}
	
	@PostMapping("/add-to-wishlist")
	public ResponseEntity<WishlistItemResponseDTO> addToWishList(@RequestParam long productId) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.addProductToWishlist(productId));
	}
	
	@DeleteMapping("/remove-from-wishlist")
	public ResponseEntity<Map<String, String>> removeFromWishlist(@RequestParam long wishlistItemId) {
		return ResponseEntity.ok(service.removeProductFromWishlist(wishlistItemId));
	}
}