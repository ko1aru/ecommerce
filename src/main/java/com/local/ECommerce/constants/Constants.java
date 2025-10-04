package com.local.ECommerce.constants;

public class Constants {
	public static final String SUCCESS = "Success";
	public static final String FAILED = "Failed";
	
	public static final String FROM_MAIL = "aakash.altair@gmail.com";
	public static final String VERIFICATION_MAIL_SUBJECT = "Verification";
	public static final String PASSWORD_RESET_MAIL_SUBJECT = "Password Reset";
	
	public String getVerificationMailBody(String token) {
		String url = "http://localhost:8080/api/auth/verify?token=";
		return  "Hi, welcome to our site!"
				+ "\n\nClick here to verify your account: " + url + token + "." 
				+ "\n\nThank you";
	}
	
	public String getPasswordResetMailBody(String token) {
		String url = "http://localhost:3000/reset-password?token=";
		return "Hi, "
				+ "\n\n Click this link to reset your password: " + url + token + "."
				+ "\n\nThank you";
	}
}
