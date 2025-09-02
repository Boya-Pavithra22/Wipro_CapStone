package com.wipro.ecommerce.onlineshopping.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response object returned after successful login")
public class JwtResponse {

    @Schema(description = "JWT access token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    @Schema(description = "Role of the user", example = "CUSTOMER")
    private String role;

    @Schema(description = "Full name of the user", example = "John Doe")
    private String name;

    @Schema(description = "Email address of the user", example = "john.doe@example.com")
    private String email;

    @Schema(description = "Unique ID of the user", example = "101")
    private Long userId;

    @Schema(description = "Address of the user", example = "123, MG Road, Bangalore")
    private String address;

    public JwtResponse(String token, String role, String name, String email, Long userId, String address) {
        this.token = token;
        this.role = role;
        this.name = name;
        this.email = email;
        this.userId = userId;
        this.address = address;
    }

    // Getters & Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
