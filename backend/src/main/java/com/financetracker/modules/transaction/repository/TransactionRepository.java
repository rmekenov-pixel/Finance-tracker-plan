package com.financetracker.modules.transaction.repository;

import com.financetracker.modules.transaction.entity.Transaction;
import com.financetracker.modules.transaction.entity.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
           "AND (:type IS NULL OR t.type = :type) " +
           "AND (:category IS NULL OR LOWER(t.category) = LOWER(:category)) " +
           "AND (:dateFrom IS NULL OR t.date >= :dateFrom) " +
           "AND (:dateTo IS NULL OR t.date <= :dateTo) " +
           "ORDER BY t.date DESC, t.createdAt DESC")
    Page<Transaction> findFilteredTransactions(
            @Param("userId") UUID userId,
            @Param("type") TransactionType type,
            @Param("category") String category,
            @Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = :type " +
           "AND (:dateFrom IS NULL OR t.date >= :dateFrom) " +
           "AND (:dateTo IS NULL OR t.date <= :dateTo)")
    BigDecimal calculateSumByTypeAndPeriod(
            @Param("userId") UUID userId,
            @Param("type") TransactionType type,
            @Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo
    );

    List<Transaction> findTop5ByUserIdOrderByDateDescCreatedAtDesc(UUID userId);

    Optional<Transaction> findByIdAndUserId(UUID id, UUID userId);
}
