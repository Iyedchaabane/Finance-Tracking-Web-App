package com.financetracker.backend.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // --- 1. Gestion des erreurs de Validation (@Valid) ---
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponse errorResponse = buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Validation Failed",
                request,
                errors
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // --- 2. Gestion des Ressources Non Trouvées (404) ---
    @ExceptionHandler({ResourceNotFoundException.class, UserNotFoundException.class})
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(RuntimeException ex, WebRequest request) {
        return buildResponseEntity(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    // --- 3. Gestion des Conflits de données (409) ---
    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<ErrorResponse> handleConflictException(EmailAlreadyUsedException ex, WebRequest request) {
        return buildResponseEntity(HttpStatus.CONFLICT, ex.getMessage(), request);
    }

    // --- 4. Gestion des Mauvaises Requêtes métier (400) ---
    @ExceptionHandler({BadRequestException.class, CurrencyException.class})
    public ResponseEntity<ErrorResponse> handleBadRequestException(RuntimeException ex, WebRequest request) {
        return buildResponseEntity(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    // --- 5. Gestion des erreurs externes/API tiers (502) ---
    @ExceptionHandler(ExchangeRateApiException.class)
    public ResponseEntity<ErrorResponse> handleExternalApiException(ExchangeRateApiException ex, WebRequest request) {
        // 502 Bad Gateway est approprié quand une API upstream échoue
        return buildResponseEntity(HttpStatus.BAD_GATEWAY, "External service error: " + ex.getMessage(), request);
    }

    // --- 6. Gestion Globale (Fallback 500) ---
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, WebRequest request) {
        // En prod, on log l'erreur réelle (ex) mais on retourne un message générique pour la sécurité
        // log.error("Unhandled exception occurred", ex);

        return buildResponseEntity(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected internal error occurred. Please contact support.",
                request
        );
    }

    // --- Méthodes Utilitaires pour éviter la duplication ---

    private ResponseEntity<ErrorResponse> buildResponseEntity(HttpStatus status, String message, WebRequest request) {
        ErrorResponse errorResponse = buildErrorResponse(status, message, request, null);
        return new ResponseEntity<>(errorResponse, status);
    }

    private ErrorResponse buildErrorResponse(HttpStatus status, String message, WebRequest request, Map<String, String> validationErrors) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(request.getDescription(false).replace("uri=", ""))
                .validationErrors(validationErrors)
                .build();
    }
}