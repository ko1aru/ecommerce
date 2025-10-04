package com.local.ECommerce.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.local.ECommerce.dto.TransactionHistoryDTO;
import com.local.ECommerce.dto.UserDTO;
import com.local.ECommerce.model.User;
import com.local.ECommerce.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
	
	private final UserService service;
	
	@GetMapping("/me")
	public ResponseEntity<User> getCurrentUser() {
		return ResponseEntity.ok(service.getCurrentUser());
	}
	
	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping("/all")
	public ResponseEntity<List<UserDTO>> getAllUsers() {
	    return ResponseEntity.ok(service.getAllUsers());
	}
	
	@PreAuthorize("hasAuthority('ADMIN')")
	@PutMapping("/makeuserasadmin")
	public ResponseEntity<Map<String, String>> makeUserAsAdmin(@RequestParam String username) {
		return ResponseEntity.ok(service.makeUserAsAdmin(username));
	}
	
	@GetMapping("/transaction-history")
	public ResponseEntity<List<TransactionHistoryDTO>> getTransactionHistory() {
		return ResponseEntity.ok(service.getTransactionHistory());
	}
	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping("/transaction-history/admin")
	public ResponseEntity<List<TransactionHistoryDTO>> getTransactionHistory(@RequestParam String username) {
		return ResponseEntity.ok(service.getTransactionHistory(username));
	}
	
	@PutMapping("/change-profile-pic")
	public ResponseEntity<Map<String, String>> changeProfilePic(@RequestParam String imageUrl) {
		return ResponseEntity.ok(service.changeProfilePic(imageUrl));
	}
}