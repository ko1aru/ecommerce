package com.local.ECommerce.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.local.ECommerce.dto.TransactionHistoryDTO;
import com.local.ECommerce.dto.UserDTO;
import com.local.ECommerce.exceptions.AuthException;
import com.local.ECommerce.model.Role;
import com.local.ECommerce.model.TransactionHistory;
import com.local.ECommerce.model.User;
import com.local.ECommerce.repo.TransactionHistoryRepository;
import com.local.ECommerce.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	private final UserRepository repo;
	private final TransactionHistoryRepository transactionHistoryRepo;

	public User getCurrentUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	    if (auth == null || !(auth.getPrincipal() instanceof User)) {
	        throw new RuntimeException("No authenticated user found");
	    }
	    return (User) auth.getPrincipal();
	}
	
	public Map<String, String> makeUserAsAdmin(String username) {
		User user = repo.findByUsername(username)
				.orElseThrow(() -> new AuthException("User not found"));
		
		if(user.getRole().equals(Role.ADMIN.toString())) {
			return Map.of("message", "User "+ user.getUsername() + "is already an Admin");
		} else {
			user.setRole(Role.ADMIN.toString());
			repo.save(user);
			return Map.of("message", "User "+ user.getUsername() + "is now an Admin");
		}
	}
	
	public User getUserByUsernameOrEmail(String usernameOrEmail) {
		Optional<User> userOptional;
		if(repo.existsByUsername(usernameOrEmail)) {
			userOptional = repo.findByUsername(usernameOrEmail);
		} else if(repo.existsByEmail(usernameOrEmail)) {
			userOptional = repo.findByEmail(usernameOrEmail);
		} else {
			throw new AuthException("Invalid username or email");
		}
		return userOptional.get();
	}

	public List<TransactionHistoryDTO> getTransactionHistory() {
		User user = getCurrentUser();
		return getTransactionHistory(user);
	}
	public List<TransactionHistoryDTO> getTransactionHistory(String username) {
		User user = repo.findByUsername(username)
				.orElseThrow(() -> new AuthException("Invalid username"));
		return getTransactionHistory(user);
	}
	
	public List<TransactionHistoryDTO> getTransactionHistory(User user) {
		List<TransactionHistory> transactionHistories = transactionHistoryRepo.findAllByUser(user);
		List<TransactionHistoryDTO> response = new ArrayList<>();
		
		for(TransactionHistory history : transactionHistories) {
			TransactionHistoryDTO dto = TransactionHistoryDTO
					.builder()
					.transactionId(history.getId())
					.orderId(history.getOrderId())
					.amount(history.getAmount())
					.status(history.getStatus())
					.createdAt(history.getCreatedAt())
					.build();
			response.add(dto);
		}
		return response;
	}
	
	public Map<String, String> changeProfilePic(String url) {
		User user = getCurrentUser();
		user.setProfilePicUrl(url);
		repo.save(user);
		return Map.of("message", "Profile picture has been changed successfully.");
	}

	public List<UserDTO> getAllUsers() {
		List<User> users = repo.findAll();
		List<UserDTO> response = new ArrayList<>();
		for(User user : users) {
			response.add(new UserDTO(user.getUsername(), user.getEmail(), user.getProfilePicUrl(), user.getRole()));
		}
		return response;
	}
}