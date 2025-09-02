package com.wipro.ecommerce.onlineshopping;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "Online Shopping Backend API",
        version = "1.0",
        description = "REST API for authentication and online shopping operations",
        contact = @Contact(name = "Wipro E-Commerce Team", email = "support@wipro.com")
    )
)
public class OnlineShoppingBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(OnlineShoppingBackendApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowCredentials(true);
            }
        };
    }
}


// http://localhost:9080/api/swagger-ui/index.html#/   --- Swagger UI
// http://localhost:9080/api/v3/api-docs ---- Api -docs
