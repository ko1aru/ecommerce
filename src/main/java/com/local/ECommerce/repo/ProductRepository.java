package com.local.ECommerce.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.local.ECommerce.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	public List<Product> findByBrand(String brand);
	public List<Product> findByCategory(String category);
	public boolean existsById(long id);
}