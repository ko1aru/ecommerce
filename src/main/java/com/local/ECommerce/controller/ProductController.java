package com.local.ECommerce.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.local.ECommerce.dto.ProductDTO;
import com.local.ECommerce.dto.RatingRequestDTO;
import com.local.ECommerce.dto.RatingResponseDTO;
import com.local.ECommerce.model.Product;
import com.local.ECommerce.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
	private final ProductService service;

	@GetMapping
	public ResponseEntity<List<ProductDTO>> getAllProducts() {
		return ResponseEntity.ok(service.getAllProducts());
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProductDTO> getProductById(@PathVariable long id) {
		return ResponseEntity.ok(service.getProductById(id));
	}

	@GetMapping("/category")
	public ResponseEntity<List<ProductDTO>> getProductsByCategory(@RequestParam String category) {
		return ResponseEntity.ok(service.getProductsByCategory(category));
	}

	@PreAuthorize("hasAuthority('ADMIN')")
	@PostMapping("/add")
	public ResponseEntity<ProductDTO> addProduct(@RequestBody Product product) {
		return ResponseEntity.ok(service.addProduct(product));
	}

	@PreAuthorize("hasAuthority('ADMIN')")
	@PutMapping("/{id}")
	public ResponseEntity<ProductDTO> updateProduct(@PathVariable long id, @RequestBody Product product) {
		return ResponseEntity.ok(service.updateProduct(id, product));
	}

	@PreAuthorize("hasAuthority('ADMIN')")
	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable long id) {
		return ResponseEntity.ok(service.deleteProduct(id));
	}
	
	@PostMapping("/{id}/add-rating")
	public ResponseEntity<RatingResponseDTO> addRatingAndReview(@PathVariable("id") long productId, @RequestBody RatingRequestDTO request) {
		return ResponseEntity.ok(service.addRatingAndReview(productId, request));
	}
	
	@GetMapping("/{id}/get-rating")
	public ResponseEntity<List<RatingResponseDTO>> getReviewAndRating(@PathVariable("id") long productId) {
		return ResponseEntity.ok(service.getRatingAndReview(productId));
	}
}