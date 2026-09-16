package com.financetracker.modules.analytics.service;

import com.financetracker.modules.analytics.dto.BalanceTrendPoint;
import com.financetracker.modules.analytics.dto.CategoryExpensePoint;
import com.financetracker.modules.analytics.dto.IncomeExpensePoint;
import com.financetracker.modules.transaction.entity.Transaction;
import com.financetracker.modules.transaction.entity.TransactionType;
import com.financetracker.modules.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final TransactionRepository transactionRepository;

    private static final String[] PALETTE = {
            "#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6",
            "#06b6d4", "#f97316", "#6366f1", "#14b8a6", "#64748b"
    };

    @Transactional(readOnly = true)
    public List<IncomeExpensePoint> getIncomeExpenseMonthly(UUID userId, LocalDate dateFrom, LocalDate dateTo) {
        if (dateFrom == null) {
            dateFrom = LocalDate.now().minusMonths(6).withDayOfMonth(1);
        }
        if (dateTo == null) {
            dateTo = LocalDate.now();
        }

        List<Transaction> transactions = transactionRepository.findFilteredTransactions(
                userId, null, null, dateFrom, dateTo, Pageable.unpaged()
        ).getContent();

        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("LLL yyyy", Locale.forLanguageTag("ru"));

        Map<String, Map<TransactionType, BigDecimal>> aggregated = new LinkedHashMap<>();

        // Group by month
        transactions.stream()
                .sorted(Comparator.comparing(Transaction::getDate))
                .forEach(tx -> {
                    String monthKey = tx.getDate().format(monthFormatter);
                    aggregated.putIfAbsent(monthKey, new EnumMap<>(TransactionType.class));
                    Map<TransactionType, BigDecimal> typeMap = aggregated.get(monthKey);
                    typeMap.merge(tx.getType(), tx.getAmount(), BigDecimal::add);
                });

        List<IncomeExpensePoint> result = new ArrayList<>();
        aggregated.forEach((period, typeMap) -> {
            result.add(IncomeExpensePoint.builder()
                    .period(period)
                    .income(typeMap.getOrDefault(TransactionType.INCOME, BigDecimal.ZERO))
                    .expense(typeMap.getOrDefault(TransactionType.EXPENSE, BigDecimal.ZERO))
                    .build());
        });

        return result;
    }

    @Transactional(readOnly = true)
    public List<CategoryExpensePoint> getExpensesByCategory(UUID userId, LocalDate dateFrom, LocalDate dateTo) {
        List<Transaction> transactions = transactionRepository.findFilteredTransactions(
                userId, TransactionType.EXPENSE, null, dateFrom, dateTo, Pageable.unpaged()
        ).getContent();

        BigDecimal totalExpense = transactions.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> byCategory = transactions.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ));

        List<CategoryExpensePoint> result = new ArrayList<>();
        int colorIdx = 0;

        for (Map.Entry<String, BigDecimal> entry : byCategory.entrySet()) {
            double percentage = totalExpense.signum() > 0
                    ? entry.getValue().divide(totalExpense, 4, RoundingMode.HALF_UP).doubleValue() * 100
                    : 0;

            result.add(CategoryExpensePoint.builder()
                    .category(entry.getKey())
                    .amount(entry.getValue())
                    .percentage(Math.round(percentage * 10.0) / 10.0)
                    .color(PALETTE[colorIdx % PALETTE.length])
                    .build());
            colorIdx++;
        }

        result.sort(Comparator.comparing(CategoryExpensePoint::getAmount).reversed());
        return result;
    }

    @Transactional(readOnly = true)
    public List<BalanceTrendPoint> getBalanceTrend(UUID userId, LocalDate dateFrom, LocalDate dateTo) {
        if (dateFrom == null) {
            dateFrom = LocalDate.now().minusDays(30);
        }
        if (dateTo == null) {
            dateTo = LocalDate.now();
        }

        List<Transaction> transactions = transactionRepository.findFilteredTransactions(
                userId, null, null, dateFrom, dateTo, Pageable.unpaged()
        ).getContent();

        // Sort ascending by date
        List<Transaction> sorted = transactions.stream()
                .sorted(Comparator.comparing(Transaction::getDate))
                .toList();

        Map<LocalDate, BigDecimal> dailyDelta = new TreeMap<>();
        for (Transaction tx : sorted) {
            BigDecimal delta = tx.getType() == TransactionType.INCOME ? tx.getAmount() : tx.getAmount().negate();
            dailyDelta.merge(tx.getDate(), delta, BigDecimal::add);
        }

        List<BalanceTrendPoint> trend = new ArrayList<>();
        BigDecimal runningBalance = BigDecimal.ZERO;

        for (Map.Entry<LocalDate, BigDecimal> entry : dailyDelta.entrySet()) {
            runningBalance = runningBalance.add(entry.getValue());
            trend.add(BalanceTrendPoint.builder()
                    .date(entry.getKey())
                    .balance(runningBalance)
                    .build());
        }

        return trend;
    }
}
