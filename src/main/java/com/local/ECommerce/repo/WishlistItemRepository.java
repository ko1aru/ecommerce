package com.local.ECommerce.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.local.ECommerce.model.Product;
import com.local.ECommerce.model.User;
import com.local.ECommerce.model.WishlistItem;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
	
	public List<WishlistItem> findAllByUser(User user);
	
	public WishlistItem findByProductAndUser(Product product, User user);
	
	public boolean existsByProductAndUser(Product product, User user);
	
	public Optional<WishlistItem> findByIdAndUser(long id, User user);
	
	public boolean existsByIdAndUser(long id, User user);

	public void deleteByIdAndUser(long id, User currentUser);
}