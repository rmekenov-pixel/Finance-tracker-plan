package com.financetracker.modules.goal.dto;

import com.financetracker.modules.goal.entity.GoalCategory;
import com.financetracker.modules.goal.entity.GoalStatus;
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
public class CreateGoalRequest {

    @NotBlank(message = "Заголовок обязателен")
    private String title;

    @NotNull(message = "Категория обязательна (SAVING, TASK, REMINDER)")
    private GoalCategory category;

    @Builder.Default
    private GoalStatus status = GoalStatus.PLANNED;

    private BigDecimal targetAmount;

    @Builder.Default
    private BigDecimal currentAmount = BigDecimal.ZERO;

    private LocalDate dueDate;

    private String color;
}
