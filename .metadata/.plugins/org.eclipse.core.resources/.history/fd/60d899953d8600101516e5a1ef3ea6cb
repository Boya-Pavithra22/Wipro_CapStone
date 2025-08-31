package com.wipro.ecommerce.onlineshopping.repository;

import com.wipro.ecommerce.onlineshopping.entity.Order;
import com.wipro.ecommerce.onlineshopping.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}
