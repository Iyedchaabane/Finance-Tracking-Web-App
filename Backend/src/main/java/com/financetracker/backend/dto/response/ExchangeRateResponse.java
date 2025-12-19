package com.financetracker.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public record ExchangeRateResponse(
        String result,
        @JsonProperty("documentation") String documentation,
        @JsonProperty("terms_of_use") String termsOfUse,
        @JsonProperty("time_last_update_unix") long timeLastUpdateUnix,
        @JsonProperty("base_code") String baseCode,
        @JsonProperty("conversion_rates") Map<String, Double> conversionRates,
        @JsonProperty("error-type") String errorType
) {}
