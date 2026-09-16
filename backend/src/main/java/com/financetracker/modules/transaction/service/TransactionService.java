package com.financetracker.modules.transaction.service;

import com.financetracker.modules.auth.entity.User;
import com.financetracker.modules.auth.repository.UserRepository;
import com.financetracker.modules.transaction.dto.CreateTransactionRequest;
import com.financetracker.modules.transaction.dto.TransactionResponse;
import com.financetracker.modules.transaction.dto.TransactionSummaryResponse;
import com.financetracker.modules.transaction.entity.Transaction;
import com.financetracker.modules.transaction.entity.TransactionType;
import com.financetracker.modules.transaction.repository.TransactionRepository;
import com.financetracker.shared.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Transactional
    public TransactionResponse createTransaction(UUID userId, CreateTransactionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        Transaction transaction = Transaction.builder()
                .user(user)
                .amount(request.getAmount())
                .type(request.getType())
                .category(request.getCategory().trim())
                .description(request.getDescription())
                .date(request.getDate())
                .build();

        Transaction saved = transactionRepository.save(transaction);
        return TransactionResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getTransactions(
            UUID userId,
            TransactionType type,
            String category,
            LocalDate dateFrom,
            LocalDate dateTo,
            Pageable pageable
    ) {
        return transactionRepository.findFilteredTransactions(userId, type, category, dateFrom, dateTo, pageable)
                .map(TransactionResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public TransactionSummaryResponse getTransactionSummary(UUID userId, LocalDate dateFrom, LocalDate dateTo) {
        BigDecimal totalIncome = transactionRepository.calculateSumByTypeAndPeriod(userId, TransactionType.INCOME, dateFrom, dateTo);
        BigDecimal totalExpense = transactionRepository.calculateSumByTypeAndPeriod(userId, TransactionType.EXPENSE, dateFrom, dateTo);
        BigDecimal balance = totalIncome.subtract(totalExpense);

        return TransactionSummaryResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(balance)
                .build();
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getRecentTransactions(UUID userId) {
        return transactionRepository.findTop5ByUserIdOrderByDateDescCreatedAtDesc(userId)
                .stream()
                .map(TransactionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteTransaction(UUID userId, UUID transactionId) {
        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new NotFoundException("Транзакция не найдена или у вас нет прав на её удаление"));

        transactionRepository.delete(transaction);
    }
}
