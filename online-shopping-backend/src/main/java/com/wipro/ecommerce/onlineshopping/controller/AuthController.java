package com.wipro.ecommerce.onlineshopping.controller;

import com.wipro.ecommerce.onlineshopping.dto.*;
import com.wipro.ecommerce.onlineshopping.entity.User;
import com.wipro.ecommerce.onlineshopping.repository.UserRepository;
import com.wipro.ecommerce.onlineshopping.security.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "APIs for user registration and login")
public class AuthController {

    @Autowired private AuthenticationManager authManager;
    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtils jwtUtils;

    @PostMapping("/register-customer")
    @Operation(summary = "Register a new customer", description = "Registers a new customer with basic details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Customer registered successfully"),
        @ApiResponse(responseCode = "400", description = "Email already exists")
    })
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setAddress(req.getAddress());
        user.setPhone(req.getPhoneNumber());
        user.setRole(User.Role.CUSTOMER);

        userRepo.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/register-admin")
    @Operation(summary = "Register a new admin", description = "Registers a new admin account")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Admin registered successfully"),
        @ApiResponse(responseCode = "400", description = "Email already exists")
    })
    public ResponseEntity<?> registerAdmin(@RequestBody RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(User.Role.ADMIN);

        userRepo.save(user);
        return ResponseEntity.ok("Admin registered successfully");
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticate user and return JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "401", description = "Invalid email or password")
    })
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        // Generate JWT
        String jwt = jwtUtils.generateToken(req.getEmail());

        // Fetch user to get role, name, email
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Return token + role + user details
        return ResponseEntity.ok(
                new JwtResponse(jwt, user.getRole().name(), user.getName(),
                        user.getEmail(), user.getId(), user.getAddress())
        );
    }
}
