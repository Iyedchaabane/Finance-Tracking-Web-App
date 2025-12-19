package com.financetracker.backend.service;

import com.financetracker.backend.dto.DashboardDTO;
import com.financetracker.backend.model.Transaction;
import com.financetracker.backend.model.TransactionType;
import com.financetracker.backend.model.User;
import com.financetracker.backend.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service responsible for aggregating and analyzing financial data for the
 * dashboard.
 * Provides statistics, category-based expense breakdowns, and monthly trends.
 */
@Service
@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DashboardService {

        private final TransactionRepository transactionRepository;

        private final CurrentUserProvider currentUserProvider;

        public DashboardDTO.Stats getStats() {
                User user = currentUserProvider.getCurrentUser();
                List<Transaction> transactions = transactionRepository.findByUserId(user.getId());

                BigDecimal totalIncome = transactions.stream()
                                .filter(t -> t.getType() == TransactionType.INCOME)
                                .map(Transaction::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal totalExpense = transactions.stream()
                                .filter(t -> t.getType() == TransactionType.EXPENSE)
                                .map(Transaction::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal balance = totalIncome.subtract(totalExpense);

                return DashboardDTO.Stats.builder()
                                .totalIncome(totalIncome)
                                .totalExpense(totalExpense)
                                .balance(balance)
                                .build();
        }

        public List<DashboardDTO.CategoryData> getExpenseByCategory() {
                User user = currentUserProvider.getCurrentUser();
                // Fetch all transactions for the user
                List<Transaction> transactions = transactionRepository.findByUserId(user.getId());

                // Filter expenses
                List<Transaction> expenses = transactions.stream()
                                .filter(t -> t.getType() == TransactionType.EXPENSE)
                                .collect(Collectors.toList());

                // Group by Category Name
                Map<String, BigDecimal> expensesByCat = expenses.stream()
                                .collect(Collectors.groupingBy(
                                                t -> t.getCategory() != null ? t.getCategory().getName()
                                                                : "Uncategorized",
                                                Collectors.mapping(Transaction::getAmount,
                                                                Collectors.reducing(BigDecimal.ZERO,
                                                                                BigDecimal::add))));

                // Transform to DTOs
                return expensesByCat.entrySet().stream()
                                .map(entry -> {
                                        String categoryName = entry.getKey();
                                        String color = "#9CA3AF"; // Default Gray

                                        if (!"Uncategorized".equals(categoryName)) {
                                                // Attempt to find the color from the first matching transaction
                                                color = expenses.stream()
                                                                .filter(t -> t.getCategory() != null && categoryName
                                                                                .equals(t.getCategory().getName()))
                                                                .findFirst()
                                                                .map(t -> t.getCategory().getColor())
                                                                .orElse("#9CA3AF");
                                        }

                                        return DashboardDTO.CategoryData.builder()
                                                        .name(categoryName)
                                                        .value(entry.getValue())
                                                        .color(color)
                                                        .build();
                                })
                                .sorted(Comparator.comparing(DashboardDTO.CategoryData::getValue).reversed()) // Sort by
                                                                                                              // amount
                                                                                                              // desc
                                .collect(Collectors.toList());
        }

        public List<DashboardDTO.MonthlyData> getMonthlyAnalysis() {
                User user = currentUserProvider.getCurrentUser();
                // Use the same repository method as getStats for consistency
                List<Transaction> transactions = transactionRepository.findByUserId(user.getId());

                ZonedDateTime now = ZonedDateTime.now();
                YearMonth currentMonth = YearMonth.from(now);

                // Prepare the map for the last 6 months
                Map<YearMonth, DashboardDTO.MonthlyData> historyMap = new TreeMap<>();

                for (int i = 0; i < 6; i++) {
                        YearMonth ym = currentMonth.minusMonths(i);
                        historyMap.put(ym, DashboardDTO.MonthlyData.builder()
                                        .name(ym.getMonth().getDisplayName(java.time.format.TextStyle.SHORT,
                                                        Locale.ENGLISH))
                                        .year(ym.getYear())
                                        .month(ym.getMonthValue())
                                        .income(BigDecimal.ZERO)
                                        .expense(BigDecimal.ZERO)
                                        .build());
                }

                // Aggregate data
                for (Transaction t : transactions) {
                        YearMonth txMonth = YearMonth.from(t.getDate());

                        // Only process if this month is in our 6-month history map
                        if (historyMap.containsKey(txMonth)) {
                                DashboardDTO.MonthlyData stats = historyMap.get(txMonth);

                                if (t.getType() == TransactionType.INCOME) {
                                        stats.setIncome(stats.getIncome().add(t.getAmount()));
                                } else if (t.getType() == TransactionType.EXPENSE) {
                                        stats.setExpense(stats.getExpense().add(t.getAmount()));
                                }
                        }
                }

                // Return values sorted by YearMonth
                return new ArrayList<>(historyMap.values());
        }
}
