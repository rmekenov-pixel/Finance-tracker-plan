package com.financetracker.modules.analytics;

import com.financetracker.modules.analytics.dto.CategoryExpensePoint;
import com.financetracker.modules.analytics.dto.IncomeExpensePoint;
import com.financetracker.modules.analytics.service.AnalyticsService;
import com.financetracker.modules.auth.dto.AuthResponse;
import com.financetracker.modules.auth.dto.RegisterRequest;
import com.financetracker.modules.auth.service.AuthService;
import com.financetracker.modules.transaction.dto.CreateTransactionRequest;
import com.financetracker.modules.transaction.entity.TransactionType;
import com.financetracker.modules.transaction.service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AnalyticsServiceTest {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private AuthService authService;

    private UUID testUserId;

    @BeforeEach
    void setUp() {
        RegisterRequest req = RegisterRequest.builder()
                .email("analytics_user_" + UUID.randomUUID() + "@test.com")
                .password("password123")
                .name("Analytics Tester")
                .currency("KZT")
                .build();
        AuthResponse auth = authService.register(req);
        testUserId = auth.getUser().getId();
    }

    @Test
    void testAnalyticsAggregation_Success() {
        // Income
        transactionService.createTransaction(testUserId, CreateTransactionRequest.builder()
                .amount(new BigDecimal("600000.00"))
                .type(TransactionType.INCOME)
                .category("Зарплата")
                .date(LocalDate.now())
                .build());

        // Expense 1
        transactionService.createTransaction(testUserId, CreateTransactionRequest.builder()
                .amount(new BigDecimal("150000.00"))
                .type(TransactionType.EXPENSE)
                .category("Продукты")
                .date(LocalDate.now())
                .build());

        // Expense 2
        transactionService.createTransaction(testUserId, CreateTransactionRequest.builder()
                .amount(new BigDecimal("50000.00"))
                .type(TransactionType.EXPENSE)
                .category("Транспорт")
                .date(LocalDate.now())
                .build());

        // Monthly Income vs Expense
        List<IncomeExpensePoint> monthly = analyticsService.getIncomeExpenseMonthly(testUserId, null, null);
        assertFalse(monthly.isEmpty());
        assertTrue(monthly.get(0).getIncome().compareTo(BigDecimal.ZERO) > 0);
        assertTrue(monthly.get(0).getExpense().compareTo(BigDecimal.ZERO) > 0);

        // Category breakdown
        List<CategoryExpensePoint> byCategory = analyticsService.getExpensesByCategory(testUserId, null, null);
        assertEquals(2, byCategory.size());
        assertEquals("Продукты", byCategory.get(0).getCategory());
        assertEquals(75.0, byCategory.get(0).getPercentage()); // 150k out of 200k = 75%
    }
}
