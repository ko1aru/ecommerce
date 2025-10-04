package com.local.ECommerce.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.local.ECommerce.model.TransactionHistory;
import com.local.ECommerce.model.User;

public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, Long> {
	public List<TransactionHistory> findAllByUser(User user);
}