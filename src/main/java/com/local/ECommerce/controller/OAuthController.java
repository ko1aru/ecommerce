package com.local.ECommerce.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.local.ECommerce.config.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;

@RestController
public class OAuthController {
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@GetMapping("/oauth-success")
    public void oauthSuccess(@AuthenticationPrincipal OAuth2User oAuth2User, HttpServletResponse response) throws IOException {
        String email = oAuth2User.getAttribute("email");
        String token = jwtUtil.generateToken(email);

        response.sendRedirect("http://localhost:3000/oauth-callback?token=" + token);
    }
}
