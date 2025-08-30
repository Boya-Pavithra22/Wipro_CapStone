package com.wipro.ecommerce.onlineshopping.controller;

import com.wipro.ecommerce.onlineshopping.entity.Cart;
import com.wipro.ecommerce.onlineshopping.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // POST /api/cart → Add item to cart
    @PostMapping
    public ResponseEntity<Cart> addItem(@RequestParam Long userId,
                                        @RequestParam Long productId,
                                        @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.addItem(userId, productId, quantity));
    }

    // GET /api/cart/{userId} → View user’s cart
    @GetMapping("/{userId}")
    public ResponseEntity<List<Cart>> getUserCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getUserCart(userId));
    }
    
 // Update quantity of a cart item
    @PutMapping("/{cartId}")
    public ResponseEntity<Cart> updateQuantity(@PathVariable Long cartId,
                                               @RequestParam Integer quantity) {
        Cart updatedCart = cartService.updateQuantity(cartId, quantity);
        return ResponseEntity.ok(updatedCart);
    }


    // DELETE /api/cart/{id} → Remove item
    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeItem(@PathVariable Long id) {
        cartService.removeItem(id);
        return ResponseEntity.ok("Item removed from cart");
    }
}
