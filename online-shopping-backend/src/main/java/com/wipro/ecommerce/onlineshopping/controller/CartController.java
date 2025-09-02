package com.wipro.ecommerce.onlineshopping.controller;

import com.wipro.ecommerce.onlineshopping.entity.Cart;
import com.wipro.ecommerce.onlineshopping.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@Tag(name = "Cart", description = "Manage shopping cart operations")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @Operation(
        summary = "Add item to cart",
        description = "Adds a product to the user's cart. If product already exists in cart, increments the quantity."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Item added to cart successfully",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = Cart.class))
    )
    @PostMapping
    public ResponseEntity<Cart> addItem(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.addItem(userId, productId, quantity));
    }

    @Operation(
        summary = "Get user cart",
        description = "Retrieves all items in the user's cart."
    )
    @ApiResponse(
        responseCode = "200",
        description = "User cart retrieved successfully",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = Cart.class))
    )
    @GetMapping("/{userId}")
    public ResponseEntity<List<Cart>> getUserCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getUserCart(userId));
    }

    @Operation(
        summary = "Update quantity",
        description = "Updates the quantity of a cart item."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Cart item updated successfully",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = Cart.class))
    )
    @PutMapping("/{cartId}")
    public ResponseEntity<Cart> updateQuantity(
            @PathVariable Long cartId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(cartId, quantity));
    }

    @Operation(
        summary = "Remove item",
        description = "Removes an item from the cart."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Item removed successfully",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = String.class))
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeItem(@PathVariable Long id) {
        cartService.removeItem(id);
        return ResponseEntity.ok("Item removed from cart");
    }
}
