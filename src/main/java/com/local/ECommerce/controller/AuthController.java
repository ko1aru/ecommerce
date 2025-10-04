package com.local.ECommerce.controller;

import java.net.URI;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.local.ECommerce.dto.AuthResponse;
import com.local.ECommerce.dto.LoginRequest;
import com.local.ECommerce.dto.RegisterRequest;
import com.local.ECommerce.dto.UserDTO;
import com.local.ECommerce.model.User;
import com.local.ECommerce.service.AuthenticationService;
import com.local.ECommerce.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
	
	private final AuthenticationService authService;
	private final UserService userService;
	
	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
		return ResponseEntity.ok(authService.register(request));
	}
	
	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
//		return ResponseEntity.ok(authService.login(request));
		return authService.login(request);
	}
	
	@GetMapping("/verify")
	public ResponseEntity<Void> verifyUser(@RequestParam String token) {
		if(authService.verifyUser(token)) {
			return ResponseEntity.status(HttpStatus.FOUND)
				    .location(URI.create("http://localhost:3000/verify-success"))
				    .build();
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
			    .location(URI.create("http://localhost:3000/verify-failed"))
			    .build();
	}
	
	@PostMapping("/resend-verification")
	public ResponseEntity<Map<String, String>> resendVerificationMail(@RequestParam String usernameOrEmail) {
		authService.resendVerificationMail(usernameOrEmail);
		return ResponseEntity.status(HttpStatus.OK)
				.body(Map.of("message", "Email has been resent successfully."));
	}
	
	@PostMapping("/forgot-password")
	public ResponseEntity<Map<String, String>> forgotPassword(@RequestParam String usernameOrEmail) {
		authService.forgotPassword(usernameOrEmail);
		return ResponseEntity.status(HttpStatus.OK)
				.body(Map.of("message", "Email with password reset link has been sent successfully."));
	}
	
	@PostMapping("/reset-password")
	public ResponseEntity<Map<String, String>> resetPassword(@RequestParam String token, @RequestBody Map<String, String> request) {
		String newPassword = request.get("newPassword");
		authService.resetPassword(token, newPassword);
		return ResponseEntity.status(HttpStatus.OK)
				.body(Map.of("message", "Password has been reset successfully."));
	}
	
	@PostMapping("/refresh-token")
	public ResponseEntity<AuthResponse> refreshToken(@RequestBody Map<String, String> request) {
		String refreshToken = request.get("refreshToken");
		return ResponseEntity.ok(authService.refreshToken(refreshToken));
	}
	
	@GetMapping("/me")
	public ResponseEntity<UserDTO> getCurrentUser() {
		User user = userService.getCurrentUser();
		UserDTO dto = new UserDTO(user.getUsername(), user.getEmail(), user.getProfilePicUrl(), user.getRole());
		return ResponseEntity.ok(dto);
	}
}