package com.financetracker.backend.service;

import com.financetracker.backend.dto.TransactionDTO;
import com.financetracker.backend.mapper.TransactionMapper;
import com.financetracker.backend.model.Category;
import com.financetracker.backend.model.Transaction;
import com.financetracker.backend.model.User;
import com.financetracker.backend.repository.CategoryRepository;
import com.financetracker.backend.repository.TransactionRepository;
import com.financetracker.backend.repository.UserSettingsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Service responsible for managing user transactions.
 * Handles CRUD operations, category assignment, and currency-aware amount
 * calculations.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    private final CategoryRepository categoryRepository;

    private final TransactionMapper transactionMapper;
    private final CurrencyConversionService currencyConversionService;
    private final CurrentUserProvider currentUserProvider;
    private final UserSettingsRepository userSettingsRepository;

    public org.springframework.data.domain.Page<TransactionDTO> getAllTransactions(
            org.springframework.data.domain.Pageable pageable) {
        User user = currentUserProvider.getCurrentUser();
        return transactionRepository.findAllByUserId(user.getId(), pageable)
                .map(transactionMapper::toDto);
    }

    public TransactionDTO createTransaction(TransactionDTO dto) {
        User user = currentUserProvider.getCurrentUser();
        Transaction transaction = transactionMapper.toEntity(dto);
        transaction.setUser(user);

        if (dto.getCurrency() == null) {
            String userCurrency = userSettingsRepository.findByUserId(user.getId())
                    .map(com.financetracker.backend.model.UserSettings::getCurrency)
                    .orElse("USD");
            transaction.setCurrency(userCurrency);
        }

        if (dto.getTransactionCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getTransactionCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            transaction.setCategory(category);
        }

        transaction = transactionRepository.save(transaction);
        log.info("Transaction created with ID: {}", transaction.getId());
        return transactionMapper.toDto(transaction);
    }

    public TransactionDTO updateTransaction(Long id, TransactionDTO dto) {
        User user = currentUserProvider.getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to update this transaction");
        }

        transaction.setAmount(dto.getAmount());
        transaction.setDescription(dto.getDescription());
        transaction.setDate(dto.getDate());
        transaction.setType(dto.getType());

        if (dto.getCurrency() != null) {
            transaction.setCurrency(dto.getCurrency());
        }

        if (dto.getTransactionCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getTransactionCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            transaction.setCategory(category);
        }

        transaction = transactionRepository.save(transaction);
        log.info("Transaction updated with ID: {}", transaction.getId());
        return transactionMapper.toDto(transaction);
    }

    public void deleteTransaction(Long id) {
        User user = currentUserProvider.getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this transaction");
        }

        transactionRepository.delete(transaction);
    }

    public BigDecimal getConvertedAmount(Long id, String targetCurrency) {
        User user = currentUserProvider.getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to access this transaction");
        }

        return currencyConversionService.convert(transaction.getAmount(), transaction.getCurrency(), targetCurrency);
    }
}
