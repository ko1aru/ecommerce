package com.local.ECommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.local.ECommerce.constants.Constants;

@Service
public class EmailService {
	@Autowired
	private JavaMailSender mailSender;
	
	public void sendVerificationEmail(String to, String subject, String body) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(Constants.FROM_MAIL);
		message.setTo(to);
		message.setSubject(subject);
		message.setText(body);
		mailSender.send(message);
	}
}