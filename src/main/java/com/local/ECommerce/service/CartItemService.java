package com.local.ECommerce.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.local.ECommerce.dto.CartItemRequestDTO;
import com.local.ECommerce.dto.CartItemResponseDTO;
import com.local.ECommerce.exceptions.CartItemException;
import com.local.ECommerce.exceptions.ProductException;
import com.local.ECommerce.model.CartItem;
import com.local.ECommerce.model.Product;
import com.local.ECommerce.model.User;
import com.local.ECommerce.repo.CartItemRepository;
import com.local.ECommerce.repo.ProductRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartItemService {

	private final CartItemRepository repo;
	private final ProductRepository productRepo;
	private final UserService userService;

	public List<CartItemResponseDTO> getAllCartItems() {
		List<CartItem> cartItems = repo.findAllByUser(getCurrentUser());
		
		List<CartItemResponseDTO> response = new ArrayList<>();
		for(CartItem item : cartItems) {
			response.add(new CartItemResponseDTO(item));
		}
		return response;
	}

	public CartItemResponseDTO addCartItem(CartItemRequestDTO request) {
		User currentUser = getCurrentUser();
		
		Product product = productRepo.findById(request.getProductId())
				.orElseThrow(() -> new ProductException("Product not found"));
		CartItem item = repo.findByUserAndProduct(currentUser, product);
		
		if(item != null) {
			item.setQuantity(item.getQuantity() + request.getQuantity());
		} else {
			item = CartItem.builder()
					.product(product)
					.quantity(request.getQuantity())
					.user(currentUser)
					.build();
		}
		return new CartItemResponseDTO(repo.save(item));
	}

	@Transactional
	public Map<String, String> deleteCartItem(long id) {
		repo.deleteByIdAndUser(id, getCurrentUser());
		return Map.of("message", "Item removed from cart.");
	}

	public CartItemResponseDTO updateQuantity(long id, int updatedQuantity) {
		CartItem item = repo.findByIdAndUser(id, getCurrentUser())
		        .orElseThrow(() -> new CartItemException("Item not found"));
		item.setQuantity(updatedQuantity);
		return new CartItemResponseDTO(repo.save(item));
	}
	
	public Map<String, BigDecimal> getTotalCartPrice() {
		Map<String, BigDecimal> response = new HashMap<>();
		response.put("price", repo.findAllByUser(getCurrentUser())
				.stream()
				.map(CartItem :: getTotalPrice)
				.reduce(BigDecimal.ZERO, BigDecimal :: add)
		);
		return response;
	}
	
	public void clearCart() {
		repo.deleteAllByUser(getCurrentUser());
	}
    
    private User getCurrentUser() {
    	return userService.getCurrentUser();
    }
}