package com.financetracker.backend.service;

import com.financetracker.backend.dto.UserSettingsDTO;
import com.financetracker.backend.mapper.UserSettingsMapper;
import com.financetracker.backend.model.Transaction;
import com.financetracker.backend.model.User;
import com.financetracker.backend.model.UserSettings;
import com.financetracker.backend.repository.TransactionRepository;
import com.financetracker.backend.repository.UserRepository;
import com.financetracker.backend.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for managing user settings and preferences.
 * 
 * <p>
 * This service handles UI preferences, currency selection, and language
 * settings.
 * It ensures that currency changes trigger transaction conversions while
 * language
 * changes remain independent UI-only updates.
 * </p>
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class UserSettingsService {

    private final UserSettingsRepository userSettingsRepository;
    private final UserRepository userRepository;
    private final UserSettingsMapper userSettingsMapper;
    private final CurrencyConversionService currencyConversionService;
    private final TransactionRepository transactionRepository;
    private final LanguageService languageService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Retrieves the settings for the current user.
     */
    public UserSettingsDTO getSettings() {
        User user = getCurrentUser();
        log.trace("Fetching settings for user: {}", user.getEmail());
        UserSettings settings = userSettingsRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Settings not found"));
        return userSettingsMapper.toDto(settings);
    }

    /**
     * Updates user settings based on the provided DTO.
     * 
     * <p>
     * <b>Surgical Fix:</b> This method now handles partial updates correctly.
     * It only modifies fields that are explicitly provided (non-null) in the DTO.
     * </p>
     * 
     * @param dto update request containing one or more fields to change
     * @return updated settings
     */
    @Transactional
    public UserSettingsDTO updateSettings(UserSettingsDTO dto) {
        User user = getCurrentUser();
        UserSettings settings = userSettingsRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Settings not found"));

        boolean modified = false;

        // Handle Theme
        if (dto.getTheme() != null && !dto.getTheme().equals(settings.getTheme())) {
            settings.setTheme(dto.getTheme());
            modified = true;
        }

        // Handle Currency (Independent)
        if (dto.getCurrency() != null && !dto.getCurrency().equals(settings.getCurrency())) {
            updateCurrencyInternal(user, settings, dto.getCurrency());
            modified = true;
        }

        // Handle Language (Independent)
        if (dto.getLanguage() != null && !dto.getLanguage().equals(settings.getLanguage())) {
            updateLanguageInternal(user, settings, dto.getLanguage());
            modified = true;
        }

        // Handle RTL manually if requested (though usually synced in @PreUpdate)
        if (dto.isRtl() != settings.isRtl()) {
            settings.setRtl(dto.isRtl());
            modified = true;
        }

        if (modified) {
            settings = userSettingsRepository.save(settings);
            log.info("Settings updated for user: {}", user.getEmail());
        }

        return userSettingsMapper.toDto(settings);
    }

    /**
     * Public method to update ONLY currency.
     */
    @Transactional
    public UserSettingsDTO updateCurrency(String newCurrency) {
        User user = getCurrentUser();
        UserSettings settings = userSettingsRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Settings not found"));

        if (!newCurrency.equals(settings.getCurrency())) {
            updateCurrencyInternal(user, settings, newCurrency);
            settings = userSettingsRepository.save(settings);
        }

        return userSettingsMapper.toDto(settings);
    }

    /**
     * Public method to update ONLY language.
     */
    @Transactional
    public UserSettingsDTO updateLanguage(String newLanguage) {
        User user = getCurrentUser();
        UserSettings settings = userSettingsRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Settings not found"));

        String normalized = languageService.validateAndNormalize(newLanguage);
        if (!normalized.equals(settings.getLanguage())) {
            updateLanguageInternal(user, settings, normalized);
            settings = userSettingsRepository.save(settings);
        }

        return userSettingsMapper.toDto(settings);
    }

    private void updateCurrencyInternal(User user, UserSettings settings, String newCurrency) {
        String oldCurrency = settings.getCurrency();
        log.info("Currency changed from {} to {} for user {}. Converting transactions...",
                oldCurrency, newCurrency, user.getEmail());

        convertUserTransactions(user.getId(), oldCurrency, newCurrency);
        settings.setCurrency(newCurrency);
    }

    private void updateLanguageInternal(User user, UserSettings settings, String newLanguage) {
        String normalized = languageService.validateAndNormalize(newLanguage);
        log.info("Language changed to {} for user {}", normalized, user.getEmail());
        settings.setLanguage(normalized);
        settings.setRtl(languageService.isRtl(normalized));
    }

    private void convertUserTransactions(Long userId, String fromCurrency, String toCurrency) {
        List<Transaction> transactions = transactionRepository.findByUserId(userId);
        int convertedCount = 0;

        for (Transaction transaction : transactions) {
            // Only convert if transaction currency matches the old currency
            if (fromCurrency.equalsIgnoreCase(transaction.getCurrency())) {
                transaction.setAmount(
                        currencyConversionService.convert(
                                transaction.getAmount(),
                                fromCurrency,
                                toCurrency));
                transaction.setCurrency(toCurrency);
                convertedCount++;
            }
        }

        if (convertedCount > 0) {
            transactionRepository.saveAll(transactions);
            log.info("Converted {} transactions from {} to {} for user {}",
                    convertedCount, fromCurrency, toCurrency, userId);
        }
    }
}
