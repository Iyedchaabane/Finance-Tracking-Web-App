package com.financetracker.backend.dto;

import com.financetracker.backend.model.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Stats {
        private BigDecimal totalIncome;
        private BigDecimal totalExpense;
        private BigDecimal balance;
    }

    // Matches Pie Chart requirements exactly
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryData {
        private String name; // Legend label
        private BigDecimal value; // Slice size
        private String color; // Slice color
    }

    // Matches Line Chart requirements exactly
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyData {
        private String name; // X-Axis label (e.g. "Jan")
        private BigDecimal income;
        private BigDecimal expense;
        private int year; // Kept for sorting if needed
        private int month; // Kept for sorting if needed
    }
}
