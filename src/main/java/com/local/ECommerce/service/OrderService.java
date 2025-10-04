package com.local.ECommerce.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.local.ECommerce.constants.Constants;
import com.local.ECommerce.dto.OrderResponseDTO;
import com.local.ECommerce.exceptions.OrderException;
import com.local.ECommerce.model.CartItem;
import com.local.ECommerce.model.Order;
import com.local.ECommerce.model.OrderItem;
import com.local.ECommerce.model.OrderStatus;
import com.local.ECommerce.model.Product;
import com.local.ECommerce.model.TransactionHistory;
import com.local.ECommerce.model.User;
import com.local.ECommerce.repo.CartItemRepository;
import com.local.ECommerce.repo.OrderRepository;
import com.local.ECommerce.repo.ProductRepository;
import com.local.ECommerce.repo.TransactionHistoryRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
	private final OrderRepository repo;
	private final CartItemRepository cartItemRepo;
	private final ProductRepository productRepo;
	private final TransactionHistoryRepository transactionHistoryRepo;
	private final UserService userService;
	
	public List<OrderResponseDTO> getOrdersByUser() {
		List<Order> orders = repo.findAllByUser(getCurrentUser());
		if(orders.size() == 0) {
			throw new OrderException("No orders found");
		}
		
		List<OrderResponseDTO> response = new ArrayList<>();
		for(Order order : orders) {
			response.add(new OrderResponseDTO(order.getId(), order.getItems(), order.getTotalPrice(), order.getDate(), order.getStatus()));
		}
		return response;
	}
	
	public OrderResponseDTO placeOrder() {
		User currentUser = getCurrentUser();
		List<CartItem> cartItems = cartItemRepo.findAllByUser(currentUser);
		
		List<OrderItem> orderItems = new ArrayList<>();
		for(CartItem item : cartItems) {
			orderItems.add(
					OrderItem.builder()
					.product(item.getProduct())
					.quantity(item.getQuantity())
					.build()
					);
		}
		
		Order order = Order.builder()
				.items(orderItems)
				.user(currentUser)
				.date(new Date())
				.status(OrderStatus.PLACED.toString())
				.build();
		order.setTotalPrice();
		
		for(OrderItem item : orderItems) {
			item.setOrder(order);
		}
		
		repo.save(order);
		
		return new OrderResponseDTO(order.getId(), order.getItems(), order.getTotalPrice(), order.getDate(), order.getStatus());
	}
	
	@Transactional
	public Map<String, String> pay(long id) {
		User currentUser = getCurrentUser();
		Order order = repo.findById(id)
				.orElseThrow(() -> new OrderException("Order not found"));

		if (!order.getUser().getUsername().equals(currentUser.getUsername()) &&
				!currentUser.getRole().equals("ADMIN")) {
		    throw new OrderException("You are not allowed to pay for this order");
		}

		List<OrderItem> items = order.getItems();
		for (OrderItem item : items) {
			Product product = item.getProduct();
			product.setStock(product.getStock() - item.getQuantity());
			productRepo.save(product);
		}

		order.setPaymentStatus(Constants.SUCCESS);
		order.setStatus(OrderStatus.DELIVERED.toString());
		TransactionHistory transactionHistory = TransactionHistory
				.builder()
				.orderId(order.getId())
				.amount(order.getTotalPrice())
				.status(order.getPaymentStatus())
				.user(currentUser)
				.build();
		
		repo.save(order);
		cartItemRepo.deleteAllByUser(getCurrentUser());
		transactionHistoryRepo.save(transactionHistory);
		
		return Map.of("message", "Payment successful. Your order has been placed");
	}
	
	public Map<String, String> cancelOrder(long orderId) {
		Order order = repo.findById(orderId)
				.orElseThrow(() -> new OrderException("Order not found"));
		order.setStatus(OrderStatus.CANCELLED.toString());
		repo.save(order);
		return Map.of("message", "Order has been deleted");
	}
	
	private User getCurrentUser() {
		return userService.getCurrentUser();
	}
}