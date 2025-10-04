package com.local.ECommerce.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.local.ECommerce.dto.ProductDTO;
import com.local.ECommerce.dto.RatingRequestDTO;
import com.local.ECommerce.dto.RatingResponseDTO;
import com.local.ECommerce.exceptions.ProductException;
import com.local.ECommerce.exceptions.ReviewException;
import com.local.ECommerce.model.Product;
import com.local.ECommerce.model.ProductReviewAndRating;
import com.local.ECommerce.model.User;
import com.local.ECommerce.repo.ProductRepository;
import com.local.ECommerce.repo.ProductReviewAndRatingRepo;
import com.local.ECommerce.repo.WishlistItemRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {
	private final ProductRepository repo;
	private final ProductReviewAndRatingRepo ratingRepo;
	private final WishlistItemRepository wishlistItemRepo;
	private final UserService userService;

	public List<ProductDTO> getAllProducts() {
		List<Product> products = repo.findAll();
		List<ProductDTO> response = new ArrayList<>();
		
		for(Product product : products) {
			response.add(toDTO(product));
		}
		return response;
	}

	public ProductDTO getProductById(long id) {
		Product product = repo.findById(id)
				.orElseThrow(() -> new ProductException("Product not found"));
		return toDTO(product);
	}

	public List<ProductDTO> getProductsByCategory(String category) {
		List<Product> products = repo.findByCategory(category);
		List<ProductDTO> response = new ArrayList<>();
		
		for(Product product : products) {
			response.add(toDTO(product));
		}
		return response;
	}

	public ProductDTO addProduct(Product product) {
		return toDTO(repo.save(product));
	}

	public ProductDTO updateProduct(long id, Product newProduct) {
		Product product = repo.findById(id)
				.orElseThrow(() -> new ProductException("Product not found"));
		product.setName(newProduct.getName());
		product.setPrice(newProduct.getPrice());
		product.setStock(newProduct.getStock());
		product.setDescription(newProduct.getDescription());
		product.setCategory(newProduct.getCategory());
		product.setImageUrl(newProduct.getImageUrl());
		
		return toDTO(repo.save(product));
	}

	public Map<String, String> deleteProduct(long id) {
		if(repo.existsById(id)) {
			repo.deleteById(id);
			return Map.of("message", "Product deleted successfully!");
		} else {
			throw new ProductException("Product not found");
		}
	}

	public RatingResponseDTO addRatingAndReview(long productId, RatingRequestDTO request) {
		User user = getCurrentUser();
		Optional<ProductReviewAndRating> existing = ratingRepo.findByProductIdAndUsername(productId, user.getUsername());
		if (existing.isPresent()) {
		    throw new ReviewException("You’ve already reviewed this product");
		}
		
		Product product = repo.findById(productId)
				.orElseThrow(() -> new ProductException("Product not found"));
		
		ProductReviewAndRating rating = ProductReviewAndRating
				.builder()
				.product(product)
				.rating(request.getRating())
				.review(request.getReview())
				.username(user.getUsername())
				.build();
		ratingRepo.save(rating);
		
		int averageRating = (product.getAverageRating() + rating.getRating()) / (product.getRatings().size());
		product.setAverageRating(averageRating);
		repo.save(product);
		
		RatingResponseDTO response = RatingResponseDTO
				.builder()
				.id(rating.getId())
				.rating(rating.getRating())
				.review(rating.getReview())
				.productId(rating.getProduct().getId())
				.username(user.getUsername())
				.build();
		return response;
	}

	public List<RatingResponseDTO> getRatingAndReview(long productId) {
		List<RatingResponseDTO> response = new ArrayList<>();
		List<ProductReviewAndRating> ratings = ratingRepo.findAllByProductId(productId);
		for(ProductReviewAndRating rating : ratings) {
			response.add(RatingResponseDTO
					.builder()
					.id(rating.getId())
					.rating(rating.getRating())
					.review(rating.getReview())
					.productId(rating.getProduct().getId())
					.username(rating.getUsername())
					.build()
			);
		}
		return response;
	}
	
	private ProductDTO toDTO(Product product) {
		List<RatingResponseDTO> ratings = new ArrayList<>();
		for(ProductReviewAndRating rating : product.getRatings()) {
			ratings.add(RatingResponseDTO
					.builder()
					.id(rating.getId())
					.productId(rating.getProduct().getId())
					.rating(rating.getRating())
					.review(rating.getReview())
					.username(rating.getUsername())
					.build()
			);
		}
		
		return ProductDTO
				.builder()
				.id(product.getId())
				.name(product.getName())
				.description(product.getDescription())
				.brand(product.getBrand())
				.category(product.getCategory())
				.price(product.getPrice())
				.stock(product.getStock())
				.imageUrl(product.getImageUrl())
				.averageRating(product.getAverageRating())
				.ratings(ratings)
				.wishlisted(wishlistItemRepo.existsByProductAndUser(product, getCurrentUser()))
				.build();
	}
	
	private User getCurrentUser() {
		return userService.getCurrentUser();
	}
}