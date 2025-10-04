package com.local.ECommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDTO {
	private String username;
	private String email;
	private String profilePicUrl;
	private String role;
}