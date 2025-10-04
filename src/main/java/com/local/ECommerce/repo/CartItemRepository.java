package com.local.ECommerce.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.local.ECommerce.model.CartItem;
import com.local.ECommerce.model.Product;
import com.local.ECommerce.model.User;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
	public List<CartItem> findAllByUser(User user);

	public void deleteByIdAndUser(long id, User currentUser);

	public Optional<CartItem>findByIdAndUser(long id, User currentUser);
	
	public CartItem findByUserAndProduct(User user, Product product);

	public void deleteAllByUser(User currentUser);
}