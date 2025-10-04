package com.local.ECommerce.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.local.ECommerce.dto.ProductDTO;
import com.local.ECommerce.dto.WishlistItemResponseDTO;
import com.local.ECommerce.exceptions.ProductException;
import com.local.ECommerce.exceptions.WishlistItemException;
import com.local.ECommerce.model.Product;
import com.local.ECommerce.model.User;
import com.local.ECommerce.model.WishlistItem;
import com.local.ECommerce.repo.ProductRepository;
import com.local.ECommerce.repo.WishlistItemRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WishlistItemService {
	private final WishlistItemRepository repo;
	private final ProductRepository productRepo;
	private final UserService userService;
	
	public List<WishlistItemResponseDTO> getWishlist() {
		List<WishlistItem> wishlistItems = repo.findAllByUser(getCurrentUser());
		List<WishlistItemResponseDTO> response = new ArrayList<>();
		
		for(WishlistItem item : wishlistItems) {
			Product product = item.getProduct();
			ProductDTO productDto = ProductDTO
					.builder()
					.id(product.getId())
					.name(product.getName())
					.brand(product.getBrand())
					.price(product.getPrice())
					.imageUrl(product.getImageUrl())
					.wishlisted(repo.existsByProductAndUser(product, getCurrentUser()))
					.build();
			
			response.add(WishlistItemResponseDTO
					.builder()
					.id(item.getId())
					.product(productDto)
					.build()
					);
		}
		return response;
	}
	
	@Transactional
	public WishlistItemResponseDTO addProductToWishlist(long productId) {
		Product product = productRepo.findById(productId)
				.orElseThrow(() -> new ProductException("Product not found"));
		
		if(repo.existsByProductAndUser(product, getCurrentUser())) {
			throw new WishlistItemException("Product already added to wishlist");
		}
		WishlistItem wishlistItem = WishlistItem
				.builder()
				.product(product)
				.user(getCurrentUser())
				.build();
		repo.save(wishlistItem);
		
		ProductDTO productDto = ProductDTO
				.builder()
				.id(product.getId())
				.name(product.getName())
				.brand(product.getBrand())
				.price(product.getPrice())
				.imageUrl(product.getImageUrl())
				.wishlisted(true)
				.build();
		
		return WishlistItemResponseDTO
				.builder()
				.id(wishlistItem.getId())
				.product(productDto)
				.build();
	}
	
	@Transactional
	public Map<String, String> removeProductFromWishlist(long id) {
		User user = getCurrentUser();
		if(!repo.existsByIdAndUser(id, user)) {
			throw new WishlistItemException("Wishlist item not found");
		}
		repo.deleteByIdAndUser(id, getCurrentUser());
		return Map.of("message", "Removed from Wishlist");
	}
	
	private User getCurrentUser() {
		return userService.getCurrentUser();
	}
}