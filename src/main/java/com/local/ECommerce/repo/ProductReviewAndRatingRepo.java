package com.local.ECommerce.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.local.ECommerce.model.ProductReviewAndRating;

public interface ProductReviewAndRatingRepo extends JpaRepository<ProductReviewAndRating, Long> {

	public List<ProductReviewAndRating> findAllByProductId(long productId);

	public Optional<ProductReviewAndRating> findByProductIdAndUsername(long productId, String username);
	
}