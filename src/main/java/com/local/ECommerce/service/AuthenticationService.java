package com.local.ECommerce.service;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.local.ECommerce.config.JwtUtil;
import com.local.ECommerce.constants.Constants;
import com.local.ECommerce.dto.AuthResponse;
import com.local.ECommerce.dto.LoginRequest;
import com.local.ECommerce.dto.RegisterRequest;
import com.local.ECommerce.exceptions.AuthException;
import com.local.ECommerce.model.Role;
import com.local.ECommerce.model.User;
import com.local.ECommerce.repo.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
	private final UserRepository userRepo;
	private final PasswordEncoder encoder;
	private final JwtUtil jwtUtil;
	private final EmailService emailService;
	private final UserService userService;
    private final AuthenticationManager authenticationManager;
	
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
    	if(userRepo.existsByUsername(registerRequest.getUsername()) ||
    			userRepo.existsByEmail(registerRequest.getEmail())) {
    		throw new AuthException("User or email already exists!");
    	}
    	
    	User user = User.builder()
    			.username(registerRequest.getUsername())
    			.email(registerRequest.getEmail())
    			.password(encoder.encode(registerRequest.getPassword()))
    			.profilePicUrl(registerRequest.getProfilePicUrl())
    			.role(Role.USER.toString())
    			.isVerified(false)
    			.build();
    	
    	userRepo.save(user);
    	String token = jwtUtil.generateToken(registerRequest.getEmail());
    	
    	String verificationToken = UUID.randomUUID().toString();
    	userRepo.setVerificationToken(user.getUsername(), verificationToken);
    	emailService.sendVerificationEmail(user.getEmail(), Constants.VERIFICATION_MAIL_SUBJECT, new Constants().getVerificationMailBody(verificationToken));
    	
    	return new AuthResponse(token, null);
    }
    
    @Transactional
    public ResponseEntity<AuthResponse> login (LoginRequest loginRequest) {
    	try {
	    	authenticationManager.authenticate(
	                new UsernamePasswordAuthenticationToken(
	                		loginRequest.getUsername(),
	                		loginRequest.getPassword()
	                )
	        );
	    	
	    	User user = userRepo.findByUsername(loginRequest.getUsername())
	    			.orElseThrow(() -> new AuthException("User not found"));
	    	
	    	if (!user.isVerified()) {
	    	    throw new AuthException("Please verify your email before logging in.");
	    	}
	    	
	    	String token = jwtUtil.generateToken(user.getEmail());
	    	String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
	    	userRepo.setRefreshToken(user.getEmail(), refreshToken);
	
	    	return ResponseEntity.status(HttpStatus.ACCEPTED)
                    .body(new AuthResponse(token, refreshToken));
    	} catch (BadCredentialsException e) {
    		e.printStackTrace();
            throw new AuthException("Invalid username or password");
        } catch (Exception e) {
        	e.printStackTrace();
            throw new AuthException("Something went wrong");
        }
    }
	
    @Transactional
	public boolean verifyUser(String token) {
		User user = userRepo.findByVerificationToken(token)
				.orElseThrow(() -> new AuthException("Invalid verification link"));
		user.setVerified(true);
		userRepo.save(user);
		userRepo.deleteVerificationToken(user.getUsername());
		return true;
	}
	
	@Transactional
	public void resendVerificationMail(String usernameOrEmail) {
		User user = userService.getUserByUsernameOrEmail(usernameOrEmail);
		
		String verificationToken = UUID.randomUUID().toString();
    	userRepo.setVerificationToken(user.getUsername(), verificationToken);
    	emailService.sendVerificationEmail(
    			user.getEmail(), 
    			Constants.VERIFICATION_MAIL_SUBJECT, 
    			new Constants().getVerificationMailBody(verificationToken)
    	);
	}

	@Transactional
	public void forgotPassword(String usernameOrEmail) {
		User user = userService.getUserByUsernameOrEmail(usernameOrEmail);
		
		String verificationToken = UUID.randomUUID().toString();
		userRepo.setVerificationToken(user.getUsername(), verificationToken);
		emailService.sendVerificationEmail(
				user.getEmail(), 
				Constants.PASSWORD_RESET_MAIL_SUBJECT, 
				new Constants().getPasswordResetMailBody(verificationToken)
		);
	}

	@Transactional
	public void resetPassword(String token, String newPassword) {
		User user = userRepo.findByVerificationToken(token)
				.orElseThrow(() -> new AuthException("Invalid verification link"));
		user.setPassword(encoder.encode(newPassword));
		userRepo.save(user);
		userRepo.deleteVerificationToken(user.getUsername());
	}

	@Transactional
	public AuthResponse refreshToken(String refreshToken) {
		User user = userRepo.findByRefreshToken(refreshToken)
				.orElseThrow(() -> new AuthException("Invalid refresh token"));
		
		String token = jwtUtil.generateToken(user.getEmail());
    	refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
    	userRepo.setRefreshToken(refreshToken, user.getUsername());
    	
		return new AuthResponse(token, refreshToken);
	}
}