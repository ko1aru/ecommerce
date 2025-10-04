package com.local.ECommerce.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.local.ECommerce.model.Order;
import com.local.ECommerce.model.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
	public List<Order> findAllByUser(User user);
}