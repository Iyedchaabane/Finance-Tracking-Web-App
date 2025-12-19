package com.financetracker.backend.service;

import com.financetracker.backend.dto.AuthDTO;
import com.financetracker.backend.exception.EmailAlreadyUsedException;
import com.financetracker.backend.model.Role;
import com.financetracker.backend.model.User;
import com.financetracker.backend.model.UserSettings;
import com.financetracker.backend.repository.UserRepository;
import com.financetracker.backend.repository.UserSettingsRepository;
import com.financetracker.backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service responsible for user authentication and security operations.
 * Handles login authentication, JWT token generation, and new user
 * registration.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

        private final AuthenticationManager authenticationManager;

        private final UserRepository userRepository;

        private final UserSettingsRepository userSettingsRepository;

        private final PasswordEncoder encoder;

        private final JwtUtils jwtUtils;

        /**
         * Authenticates a user with email and password and generates a JWT token.
         * 
         * @param loginRequest DTO containing credentials
         * @return AuthResponse containing the JWT token and user profile details
         */
        public AuthDTO.AuthResponse authenticateUser(AuthDTO.LoginRequest loginRequest) {
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
                                                loginRequest.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = jwtUtils.generateJwtToken(authentication);

                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

                log.info("User logged in: {}", user.getEmail());

                return AuthDTO.AuthResponse.builder()
                                .token(jwt)
                                .type("Bearer")
                                .id(user.getId())
                                .email(user.getEmail())
                                .role(Role.USER)
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .build();
        }

        /**
         * Registers a new user and creates their default settings.
         * 
         * @param signUpRequest DTO containing registration details
         * @throws EmailAlreadyUsedException if the email is already registered
         */
        @Transactional
        public void registerUser(AuthDTO.RegisterRequest signUpRequest) {
                log.info("Registering user: {}", signUpRequest.getEmail());
                if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                        log.warn("Registration failed. Email already in use: {}", signUpRequest.getEmail());
                        throw new EmailAlreadyUsedException(
                                        "Error: Email is already in use!" + signUpRequest.getEmail());
                }

                // Create new user's account
                User user = User.builder()
                                .firstName(signUpRequest.getFirstName())
                                .lastName(signUpRequest.getLastName())
                                .email(signUpRequest.getEmail())
                                .password(encoder.encode(signUpRequest.getPassword()))
                                .role(Role.USER)
                                .build();

                user = userRepository.save(user);

                // Create default settings
                UserSettings settings = UserSettings.builder()
                                .user(user)
                                .build();

                userSettingsRepository.save(settings);
                log.info("User registered successfully: {}", user.getEmail());
        }
}
