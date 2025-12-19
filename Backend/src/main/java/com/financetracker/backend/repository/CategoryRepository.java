package com.financetracker.backend.repository;

import com.financetracker.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserId(Long userId);

    List<Category> findByUserIdAndIsDeletedFalse(Long userId);

    java.util.Optional<Category> findByUserIdAndName(Long userId, String name);
}
