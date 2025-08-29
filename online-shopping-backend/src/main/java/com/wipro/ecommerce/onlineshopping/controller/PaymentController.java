package com.wipro.ecommerce.onlineshopping.controller;

import com.wipro.ecommerce.onlineshopping.dto.PaymentRequest;
import com.wipro.ecommerce.onlineshopping.entity.Payment;
import com.wipro.ecommerce.onlineshopping.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<Payment> processPayment(@RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.processPayment(request));
    }
}
