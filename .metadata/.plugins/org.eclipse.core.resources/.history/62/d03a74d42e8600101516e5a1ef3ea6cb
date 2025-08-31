package com.wipro.ecommerce.onlineshopping.service;

import com.wipro.ecommerce.onlineshopping.entity.*;
import com.wipro.ecommerce.onlineshopping.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    public OrderService(OrderRepository orderRepo, UserRepository userRepo, ProductRepository productRepo) {
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }

    // Place order
    public Order placeOrder(Long userId, List<OrderItem> orderItems) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BigDecimal total = BigDecimal.ZERO;
        Set<OrderItem> items = new HashSet<>();

        for (OrderItem item : orderItems) {
            Product product = productRepo.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // calculate total = price * qty
            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(lineTotal);

            item.setOrder(null); // will be set after order is created
            item.setProduct(product);
            items.add(item);
        }

        Order order = new Order(user, total);
        order.setOrderItems(items);

        // Link back orderItems -> order
        for (OrderItem item : items) {
            item.setOrder(order);
        }

        return orderRepo.save(order);
    }

    // Get all orders of a user
    public List<Order> getUserOrders(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepo.findByUser(user);
    }

    // Get all orders (admin)
    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }
}
