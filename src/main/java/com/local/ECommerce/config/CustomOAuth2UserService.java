package com.local.ECommerce.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.local.ECommerce.model.User;
import com.local.ECommerce.repo.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
	@Autowired
    private UserRepository userRepository;
	
	@Override
	@Transactional
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);
		
		String email = oAuth2User.getAttribute("email");
		String name = oAuth2User.getAttribute("name");
		System.out.println("Google returned email=" + email + ", name=" + name);

		userRepository.findByEmail(email)
	        .orElseGet(() -> userRepository.save(
	            User.builder()
	                .email(email)
	                .username(name)
	                .role("USER")
	                .authProvider("GOOGLE")
	                .build()
	        ));

//		return new DefaultOAuth2User(
//				Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole())),
//				oAuth2User.getAttributes(),
//				"email"
//		);
		
		return oAuth2User;
	}
}
