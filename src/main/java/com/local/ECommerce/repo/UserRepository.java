package com.local.ECommerce.repo;

import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.local.ECommerce.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	
	public Optional<User> findByUsername(String username);

	public Optional<User> findByEmail(String usernameOrEmail);
	
	public boolean existsByUsername(String username);
	
	public boolean existsByEmail(String email);
	
	@Modifying
	@Query(value = "UPDATE users SET verification_token=?2 WHERE username=?1", nativeQuery = true)
	public void setVerificationToken(String username, String token);
	
	@Modifying
	@Query(value = "UPDATE users SET verification_token=null WHERE username = ?1", nativeQuery = true)
	public void deleteVerificationToken(String username);
	
	@Query(value = "SELECT * FROM users WHERE verification_token = ?1", nativeQuery = true)
	public Optional<User> findByVerificationToken(String token);

	@Modifying
	@Query(value = "UPDATE users SET refresh_token=?2 WHERE username=?1", nativeQuery = true)
	public int setRefreshToken(String username, String refreshToken);
	
	public Optional<User> findByRefreshToken(String refreshToken);
	
//	@Query(value = "SELECT validation_token FROM users WHERE username = ?1")
//	public String getVerificationToken(String username);
}