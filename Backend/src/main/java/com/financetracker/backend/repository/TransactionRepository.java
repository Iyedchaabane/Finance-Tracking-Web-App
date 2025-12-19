package com.financetracker.backend.repository;

import com.financetracker.backend.model.Transaction;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserId(Long userId);

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId ORDER BY t.date DESC")
    List<Transaction> findAllByUserIdOrderByDateDesc(@Param("userId") Long userId);

    Page<Transaction> findAllByUserId(Long userId,
            Pageable pageable);

    List<Transaction> findByCategoryId(Long categoryId);
}
