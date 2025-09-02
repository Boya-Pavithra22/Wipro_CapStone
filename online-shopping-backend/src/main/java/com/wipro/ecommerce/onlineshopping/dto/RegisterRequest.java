package com.wipro.ecommerce.onlineshopping.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request object for user registration")
public class RegisterRequest {

    @Schema(description = "Full name of the user", example = "John Doe")
    private String name;

    @Schema(description = "Email address of the user", example = "john.doe@example.com")
    private String email;

    @Schema(description = "Password of the user (will be encrypted)", example = "password123")
    private String password;

    @Schema(description = "Address of the user", example = "123, MG Road, Bangalore")
    private String address;

    @Schema(description = "Phone number of the user", example = "+91-9876543210")
    private String phoneNumber;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
}
