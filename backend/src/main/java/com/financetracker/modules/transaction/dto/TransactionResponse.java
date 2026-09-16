package com.financetracker.modules.transaction.dto;

import com.financetracker.modules.transaction.entity.Transaction;
import com.financetracker.modules.transaction.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private UUID id;
    private UUID userId;
    private BigDecimal amount;
    private TransactionType type;
    private String category;
    private String description;
    private LocalDate date;
    private Instant createdAt;

    public static TransactionResponse fromEntity(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .userId(t.getUser().getId())
                .amount(t.getAmount())
                .type(t.getType())
                .category(t.getCategory())
                .description(t.getDescription())
                .date(t.getDate())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
