package com.financetracker.modules.transaction.dto;

import com.financetracker.modules.transaction.entity.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionRequest {

    @NotNull(message = "Сумма обязательна")
    @DecimalMin(value = "0.01", message = "Сумма должна быть больше 0")
    private BigDecimal amount;

    @NotNull(message = "Тип транзакции обязателен (INCOME или EXPENSE)")
    private TransactionType type;

    @NotBlank(message = "Категория обязательна")
    private String category;

    private String description;

    @NotNull(message = "Дата обязательна")
    private LocalDate date;
}
