package com.financetracker.modules.transaction.controller;

import com.financetracker.modules.transaction.dto.CreateTransactionRequest;
import com.financetracker.modules.transaction.dto.TransactionResponse;
import com.financetracker.modules.transaction.dto.TransactionSummaryResponse;
import com.financetracker.modules.transaction.entity.TransactionType;
import com.financetracker.modules.transaction.service.TransactionService;
import com.financetracker.shared.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody CreateTransactionRequest request
    ) {
        UUID userId = SecurityUtils.getCurrentUserId();
        TransactionResponse response = transactionService.createTransaction(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<TransactionResponse>> getTransactions(
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        UUID userId = SecurityUtils.getCurrentUserId();
        Page<TransactionResponse> page = transactionService.getTransactions(userId, type, category, dateFrom, dateTo, pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/summary")
    public ResponseEntity<TransactionSummaryResponse> getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo
    ) {
        UUID userId = SecurityUtils.getCurrentUserId();
        TransactionSummaryResponse summary = transactionService.getTransactionSummary(userId, dateFrom, dateTo);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<TransactionResponse>> getRecentTransactions() {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<TransactionResponse> recent = transactionService.getRecentTransactions(userId);
        return ResponseEntity.ok(recent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTransaction(@PathVariable UUID id) {
        UUID userId = SecurityUtils.getCurrentUserId();
        transactionService.deleteTransaction(userId, id);
        return ResponseEntity.ok(Map.of("message", "Транзакция успешно удалена"));
    }
}
