package com.financetracker.backend.controller;

import com.financetracker.backend.dto.DashboardDTO;
import com.financetracker.backend.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST Controller for the finance dashboard.
 * Provides aggregated financial data for visualization and overview.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Endpoints for Dashboard Analytics")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "Get overall statistics (Income, Expense, Balance)")
    public ResponseEntity<DashboardDTO.Stats> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    @GetMapping("/expense-by-category")
    @Operation(summary = "Get total expenses grouped by category")
    public ResponseEntity<List<DashboardDTO.CategoryData>> getExpenseByCategory() {
        return ResponseEntity.ok(dashboardService.getExpenseByCategory());
    }

    @GetMapping("/monthly-analysis")
    @Operation(summary = "Get monthly income and expense analysis for the last 6 months")
    public ResponseEntity<List<DashboardDTO.MonthlyData>> getMonthlyAnalysis() {
        return ResponseEntity.ok(dashboardService.getMonthlyAnalysis());
    }
}
