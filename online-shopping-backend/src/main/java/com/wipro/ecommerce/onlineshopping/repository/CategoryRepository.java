package com.wipro.ecommerce.onlineshopping.repository;
import com.wipro.ecommerce.onlineshopping.entity.Category;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
	
	Optional<Category> findByName(String name);

}