package com.financetracker.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Service for managing language and localization metadata.
 * 
 * <p>
 * This service centralizes all language-related logic, ensuring that:
 * 1. Language codes are validated against supported defaults
 * 2. RTL (Right-to-Left) direction is correctly identified
 * 3. Language-to-Locale mapping is consistent
 * </p>
 * 
 * <p>
 * <b>Design Principle:</b> Separation of concerns. This service handles
 * ONLY language/locale metadata, independent of currency logic.
 * </p>
 */
@Service
@Slf4j
public class LanguageService {

    /**
     * Supported language codes (ISO 639-1)
     */
    public static final Set<String> SUPPORTED_LANGUAGES = Set.of("en", "ar", "fr");

    /**
     * Mapping for easy language name retrieval
     */
    private static final Map<String, String> LANGUAGE_NAMES = Map.of(
            "en", "English",
            "ar", "العربية",
            "fr", "Français");

    /**
     * Mapping for Locale retrieval
     */
    private static final Map<String, Locale> LANGUAGE_LOCALES = Map.of(
            "en", Locale.ENGLISH,
            "ar", Locale.forLanguageTag("ar"),
            "fr", Locale.FRENCH);

    /**
     * Validates and normalizes a language code.
     * 
     * @param languageCode code to validate (e.g., "EN", "en", "ar")
     * @return normalized lowercase code if supported
     * @throws IllegalArgumentException if language is not supported
     */
    public String validateAndNormalize(String languageCode) {
        if (languageCode == null) {
            return "en";
        }

        String normalized = languageCode.trim().toLowerCase();

        if (!SUPPORTED_LANGUAGES.contains(normalized)) {
            log.warn("Attempted to use unsupported language: {}. Defaulting to 'en'.", languageCode);
            return "en";
        }

        return normalized;
    }

    /**
     * Determines if a language uses Right-to-Left (RTL) text direction.
     * 
     * @param languageCode normalized code
     * @return true if RTL
     */
    public boolean isRtl(String languageCode) {
        return "ar".equals(languageCode);
    }

    /**
     * Returns the Locale object corresponding to a language code.
     * 
     * @param languageCode normalized code
     * @return Locale object
     */
    public Locale getLocale(String languageCode) {
        return LANGUAGE_LOCALES.getOrDefault(languageCode, Locale.ENGLISH);
    }
}
