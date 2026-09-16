package com.financetracker.modules.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryExpensePoint {
    private String category;
    private BigDecimal amount;
    private Double percentage;
    private String color;
}
