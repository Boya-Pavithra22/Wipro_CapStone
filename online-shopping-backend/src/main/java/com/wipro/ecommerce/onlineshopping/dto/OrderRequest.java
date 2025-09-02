package com.wipro.ecommerce.onlineshopping.dto;

import java.util.List;

public class OrderRequest {
    private Long userId;
    private List<OrderItemRequest> items; // Use DTO, not entity

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
}
