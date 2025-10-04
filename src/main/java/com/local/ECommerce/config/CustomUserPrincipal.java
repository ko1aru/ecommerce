package com.local.ECommerce.config;

import java.util.Collections;
import java.util.Map;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import com.local.ECommerce.model.User;

import lombok.Getter;

@Getter
public class CustomUserPrincipal extends DefaultOAuth2User {
	private final User user;

    public CustomUserPrincipal(User user, Map<String, Object> attributes) {
        super(Collections.singleton(new SimpleGrantedAuthority(
        		"ROLE_" + user.getRole())),
        		attributes,
        		"email");
        this.user = user;
    }

    @Override
    public String getName() {
        return user.getUsername(); // or user.getEmail()
    }
}
