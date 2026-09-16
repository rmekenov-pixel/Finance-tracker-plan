package com.financetracker.modules.transaction;

import com.financetracker.modules.auth.dto.AuthResponse;
import com.financetracker.modules.auth.dto.RegisterRequest;
import com.financetracker.modules.auth.service.AuthService;
import com.financetracker.modules.transaction.dto.CreateTransactionRequest;
import com.financetracker.modules.transaction.dto.TransactionResponse;
import com.financetracker.modules.transaction.dto.TransactionSummaryResponse;
import com.financetracker.modules.transaction.entity.TransactionType;
import com.financetracker.modules.transaction.service.TransactionService;
import com.financetracker.shared.exception.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class TransactionServiceTest {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private AuthService authService;

    private UUID testUserId;

    @BeforeEach
    void setUp() {
        RegisterRequest req = RegisterRequest.builder()
                .email("user_" + UUID.randomUUID() + "@test.com")
                .password("password123")
                .name("Финансовый Пользователь")
                .currency("KZT")
                .build();
        AuthResponse auth = authService.register(req);
        testUserId = auth.getUser().getId();
    }

    @Test
    void createAndGetTransactions_Success() {
        CreateTransactionRequest incomeReq = CreateTransactionRequest.builder()
                .amount(new BigDecimal("500000.00"))
                .type(TransactionType.INCOME)
                .category("Зарплата")
                .description("Аванс")
                .date(LocalDate.now())
                .build();

        TransactionResponse createdIncome = transactionService.createTransaction(testUserId, incomeReq);
        assertNotNull(createdIncome.getId());
        assertEquals(new BigDecimal("500000.00"), createdIncome.getAmount());
        assertEquals(TransactionType.INCOME, createdIncome.getType());

        CreateTransactionRequest expenseReq = CreateTransactionRequest.builder()
                .amount(new BigDecimal("50000.00"))
                .type(TransactionType.EXPENSE)
                .category("Продукты")
                .description("Покупки на неделю")
                .date(LocalDate.now())
                .build();

        transactionService.createTransaction(testUserId, expenseReq);

        Page<TransactionResponse> page = transactionService.getTransactions(
                testUserId, null, null, null, null, PageRequest.of(0, 10)
        );
        assertEquals(2, page.getTotalElements());

        TransactionSummaryResponse summary = transactionService.getTransactionSummary(testUserId, null, null);
        assertEquals(new BigDecimal("500000.00"), summary.getTotalIncome());
        assertEquals(new BigDecimal("50000.00"), summary.getTotalExpense());
        assertEquals(new BigDecimal("450000.00"), summary.getBalance());
    }

    @Test
    void deleteTransaction_SuccessAndIdorProtection() {
        CreateTransactionRequest req = CreateTransactionRequest.builder()
                .amount(new BigDecimal("1000.00"))
                .type(TransactionType.EXPENSE)
                .category("Кофе")
                .date(LocalDate.now())
                .build();

        TransactionResponse created = transactionService.createTransaction(testUserId, req);

        // Another user trying to delete should fail
        UUID alienUserId = UUID.randomUUID();
        assertThrows(NotFoundException.class, () -> transactionService.deleteTransaction(alienUserId, created.getId()));

        // Owner can delete
        transactionService.deleteTransaction(testUserId, created.getId());
        Page<TransactionResponse> page = transactionService.getTransactions(
                testUserId, null, null, null, null, PageRequest.of(0, 10)
        );
        assertEquals(0, page.getTotalElements());
    }
}
