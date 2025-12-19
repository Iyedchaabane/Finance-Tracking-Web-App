package com.financetracker.backend.service;

import com.financetracker.backend.dto.response.ExchangeRateResponse;
import com.financetracker.backend.exception.CurrencyException;
import com.financetracker.backend.exception.ExchangeRateApiException;
import com.financetracker.backend.exception.InvalidCurrencyException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@Slf4j
@RequiredArgsConstructor
public class CurrencyConversionService {

    @Value("${exchange-rate.api.base-url}")
    private String baseUrl;

    @Value("${exchange-rate.api.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency) {
        validateInputs(amount, fromCurrency, toCurrency);

        if (fromCurrency.equalsIgnoreCase(toCurrency)) {
            return amount;
        }

        BigDecimal rate = getExchangeRate(fromCurrency, toCurrency);
        return amount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal getExchangeRate(String fromCurrency, String toCurrency) {
        String url = String.format("%s/%s/latest/%s", baseUrl, apiKey, fromCurrency.toUpperCase());

        try {
            // Utilisation de getForEntity pour inspecter le statut HTTP si nécessaire
            ExchangeRateResponse response = restTemplate.getForObject(url, ExchangeRateResponse.class);

            // 1. Vérification de la réponse brute
            if (response == null) {
                throw new ExchangeRateApiException("L'API a retourné une réponse vide");
            }

            // 2. Gestion des erreurs renvoyées par le corps JSON de l'API v6
            if ("error".equals(response.result())) {
                String errorType = response.errorType();
                log.error("API ExchangeRate error: {}", errorType);

                // On mappe l'erreur API vers la bonne exception métier
                if ("unsupported-code".equals(errorType)) {
                    throw new InvalidCurrencyException("Devise non supportée par l'API: " + fromCurrency);
                }
                throw new ExchangeRateApiException("Erreur API externe: " + errorType);
            }

            // 3. Extraction du taux
            Double rate = response.conversionRates().get(toCurrency.toUpperCase());

            if (rate == null) {
                throw new InvalidCurrencyException("La devise de destination '" + toCurrency + "' est introuvable.");
            }

            return BigDecimal.valueOf(rate);

        } catch (InvalidCurrencyException | ExchangeRateApiException e) {
            // On laisse remonter nos exceptions métier
            throw e;
        } catch (RestClientException e) {
            // On capture les erreurs techniques (Timeout, Réseau, 4xx, 5xx)
            log.error("Erreur réseau/HTTP lors de l'appel API: {}", e.getMessage());
            throw new ExchangeRateApiException("Le service de conversion est temporairement indisponible.");
        } catch (Exception e) {
            // Sécurité pour les erreurs imprévues
            log.error("Erreur inattendue: ", e);
            throw new CurrencyException("Une erreur interne est survenue lors de la conversion.");
        }
    }

    private void validateInputs(BigDecimal amount, String from, String to) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidCurrencyException("Le montant doit être positif");
        }
        if (!isValidCurrencyCode(from)) {
            throw new InvalidCurrencyException("Format de devise source invalide: " + from);
        }
        if (!isValidCurrencyCode(to)) {
            throw new InvalidCurrencyException("Format de devise cible invalide: " + to);
        }
    }

    private boolean isValidCurrencyCode(String code) {
        return code != null && code.matches("^[A-Z]{3}$");
    }
}
