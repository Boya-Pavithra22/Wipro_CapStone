package com.wipro.ecommerce.onlineshopping.repository;

import com.wipro.ecommerce.onlineshopping.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionId(String transactionId);
}
