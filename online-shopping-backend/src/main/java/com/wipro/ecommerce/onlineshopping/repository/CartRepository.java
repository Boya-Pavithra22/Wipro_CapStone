package com.wipro.ecommerce.onlineshopping.repository;

import com.wipro.ecommerce.onlineshopping.entity.Cart;
import com.wipro.ecommerce.onlineshopping.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUser(User user);
    
    Cart findByUserIdAndProductId(Long userId, Long productId);

}
