package com.wipro.ecommerce.onlineshopping.service;

import com.wipro.ecommerce.onlineshopping.dto.PaymentRequest;
import com.wipro.ecommerce.onlineshopping.entity.Order;
import com.wipro.ecommerce.onlineshopping.entity.Payment;
import com.wipro.ecommerce.onlineshopping.repository.OrderRepository;
import com.wipro.ecommerce.onlineshopping.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final OrderRepository orderRepo;

    public PaymentService(PaymentRepository paymentRepo, OrderRepository orderRepo) {
        this.paymentRepo = paymentRepo;
        this.orderRepo = orderRepo;
    }

    @Transactional
    public Payment processPayment(PaymentRequest request) {
        Order order = orderRepo.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String transactionId = UUID.randomUUID().toString();

        Payment payment = new Payment(order, transactionId);
        payment.setPaymentStatus(Payment.PaymentStatus.SUCCESS);
        return paymentRepo.save(payment);
    }
}
