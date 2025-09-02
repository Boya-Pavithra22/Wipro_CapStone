package com.wipro.ecommerce.onlineshopping.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request object for user login")
public class LoginRequest {

    @Schema(description = "Email address of the user", example = "john.doe@example.com")
    private String email;

    @Schema(description = "Password of the user", example = "password123")
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
