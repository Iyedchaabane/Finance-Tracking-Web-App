package com.financetracker.backend.controller;

import com.financetracker.backend.dto.UserSettingsDTO;
import com.financetracker.backend.service.UserSettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing user settings and preferences.
 * Handles updates for theme, currency, and language settings.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/settings")
@Tag(name = "Settings", description = "Endpoints for User Settings")
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    @GetMapping
    @Operation(summary = "Get user settings")
    public ResponseEntity<UserSettingsDTO> getSettings() {
        return ResponseEntity.ok(userSettingsService.getSettings());
    }

    @PutMapping
    @Operation(summary = "Update user settings")
    public ResponseEntity<UserSettingsDTO> updateSettings(
            @Valid @RequestBody UserSettingsDTO settingsDTO) {
        return ResponseEntity.ok(userSettingsService.updateSettings(settingsDTO));
    }
}
