package com.financetracker.backend.repository;

import com.financetracker.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserId(Long userId);

    List<Category> findByUserIdAndIsDeletedFalse(Long userId);

    Optional<Category> findByUserIdAndName(Long userId, String name);

    @Query("""
           SELECT c
           FROM Category c
           WHERE c.isDeleted = false
             AND (c.isGlobal = true OR c.user.id = :userId)
           """)
    List<Category> findVisibleCategoriesForUser(@Param("userId") Long userId);
}
