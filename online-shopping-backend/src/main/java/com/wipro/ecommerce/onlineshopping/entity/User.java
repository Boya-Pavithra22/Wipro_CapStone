package com.wipro.ecommerce.onlineshopping.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Schema(description = "Represents a user in the online shopping system")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier of the user", example = "101")
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Schema(description = "Full name of the user", example = "John Doe")
    private String name;

    @NotBlank
    @Email
    @Size(max = 100)
    @Column(unique = true)
    @Schema(description = "Email address of the user", example = "john.doe@example.com")
    private String email;

    @NotBlank
    @Size(max = 255)
    @JsonIgnore
    @Schema(description = "Hashed password of the user", example = "$2a$10$encryptedPasswordHash", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String password;

    @Enumerated(EnumType.STRING)
    @Schema(description = "Role of the user", example = "CUSTOMER")
    private Role role = Role.CUSTOMER;

    @Schema(description = "Residential address of the user", example = "123 MG Road, Bangalore")
    private String address;

    @Size(max = 20)
    @Schema(description = "Phone number of the user", example = "+91-9876543210")
    private String phone;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Schema(description = "List of cart items belonging to the user (ignored in API docs)")
    private Set<Cart> cartItems = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Schema(description = "List of orders placed by the user (ignored in API docs)")
    private Set<Order> orders = new HashSet<>();

    public User() {}

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Set<Cart> getCartItems() { return cartItems; }
    public void setCartItems(Set<Cart> cartItems) { this.cartItems = cartItems; }

    public Set<Order> getOrders() { return orders; }
    public void setOrders(Set<Order> orders) { this.orders = orders; }

    public enum Role {
        CUSTOMER, ADMIN
    }
}
