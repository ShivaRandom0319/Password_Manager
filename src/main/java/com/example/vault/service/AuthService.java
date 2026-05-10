package com.example.vault.service;

import com.example.vault.dto.AuthResponse;
import com.example.vault.dto.LoginRequest;
import com.example.vault.dto.RegisterRequest;
import com.example.vault.entity.User;
import com.example.vault.exception.BadRequestException;
import com.example.vault.repository.UserRepository;
import com.example.vault.security.JwtUtil;
import java.util.regex.Pattern;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Pattern PASSWORD_POLICY =
            Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9\\s]).{8,}$");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        String username = resolveUsername(request.getUsername(), request.getEmail());

        if (isBlank(username)) {
            throw new BadRequestException("Email or username is required");
        }

        if (isBlank(request.getPassword())) {
            throw new BadRequestException("Password is required");
        }

        if (isBlank(request.getConfirmPassword())) {
            throw new BadRequestException("Confirm password is required");
        }

        if (userRepository.existsByUsername(username)) {
            throw new BadRequestException("Username is already taken");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password must match");
        }

        if (!PASSWORD_POLICY.matcher(request.getPassword()).matches()) {
            throw new BadRequestException(
                    "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
            );
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername());
    }

    public AuthResponse login(LoginRequest request) {
        String username = resolveUsername(request.getUsername(), request.getEmail());

        if (isBlank(username)) {
            throw new BadRequestException("Email or username is required");
        }

        if (isBlank(request.getPassword())) {
            throw new BadRequestException("Password is required");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, request.getPassword())
        );

        String token = jwtUtil.generateToken(username);
        return new AuthResponse(token, username);
    }

    private String resolveUsername(String username, String email) {
        if (!isBlank(username)) {
            return username.trim();
        }

        if (!isBlank(email)) {
            return email.trim();
        }

        return "";
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
