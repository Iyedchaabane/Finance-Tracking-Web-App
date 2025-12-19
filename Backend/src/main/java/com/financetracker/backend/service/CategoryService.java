package com.financetracker.backend.service;

import com.financetracker.backend.dto.CategoryDTO;
import com.financetracker.backend.mapper.CategoryMapper;
import com.financetracker.backend.model.Category;
import com.financetracker.backend.model.User;
import com.financetracker.backend.repository.CategoryRepository;
import com.financetracker.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing transaction categories.
 * 
 * <p>
 * This service handles category CRUD operations and implements a soft deletion
 * strategy.
 * When a category is deleted, all its transactions are moved to a system
 * "Archived Transactions"
 * category to preserve data integrity and historical reporting.
 * </p>
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final TransactionRepository transactionRepository;
    private final CurrentUserProvider currentUserProvider;

    /**
     * Retrieves all active (non-deleted) categories for the current user.
     */
    public List<CategoryDTO> getAllCategories() {
        User user = currentUserProvider.getCurrentUser();
        return categoryRepository.findByUserIdAndIsDeletedFalse(user.getId()).stream()
                .map(categoryMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Creates a new category for the current user.
     */
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        User user = currentUserProvider.getCurrentUser();
        Category category = categoryMapper.toEntity(categoryDTO);
        category.setUser(user);
        category = categoryRepository.save(category);
        log.info("Category created with ID: {}", category.getId());
        return categoryMapper.toDto(category);
    }

    /**
     * Soft-deletes a category and reassigns its transactions to an archive
     * category.
     * 
     * @param id The ID of the category to delete.
     * @return Map with success status and count of reassigned transactions.
     * @throws RuntimeException if category not found or unauthorized.
     */
    @Transactional
    public java.util.Map<String, Object> deleteCategory(Long id) {
        User user = currentUserProvider.getCurrentUser();
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getUser().getId().equals(user.getId())) {
            log.error("Unauthorized attempt to delete category {} by user {}", id, user.getEmail());
            throw new RuntimeException("Not authorized to delete this category");
        }

        // Find or create the "Archived Transactions" category
        Category archivedCategory = categoryRepository.findByUserIdAndName(user.getId(), "Archived Transactions")
                .orElseGet(() -> {
                    log.info("Creating system 'Archived Transactions' category for user {}", user.getEmail());
                    Category newCat = Category.builder()
                            .user(user)
                            .name("Archived Transactions")
                            .icon("📦")
                            .color("bg-gray-100 text-gray-600")
                            .type(category.getType())
                            .isDeleted(false)
                            .build();
                    return categoryRepository.save(newCat);
                });

        // Prevention check: Cannot delete the archive category itself
        if (category.getId().equals(archivedCategory.getId())) {
            throw new RuntimeException("Cannot delete the system archive category");
        }

        // Reassign transactions from deleted category to archive
        List<com.financetracker.backend.model.Transaction> transactions = transactionRepository
                .findByCategoryId(category.getId());
        int reassignedCount = transactions.size();

        for (com.financetracker.backend.model.Transaction t : transactions) {
            t.setCategory(archivedCategory);
        }
        transactionRepository.saveAll(transactions);

        // Soft delete the category
        category.setDeleted(true);
        categoryRepository.save(category);

        log.info("Category {} soft-deleted. {} transactions reassigned to archive.", id, reassignedCount);

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("message", "Category deleted successfully");
        response.put("reassignedTransactions", reassignedCount);
        response.put("archivedCategory", archivedCategory.getName());
        return response;
    }
}
