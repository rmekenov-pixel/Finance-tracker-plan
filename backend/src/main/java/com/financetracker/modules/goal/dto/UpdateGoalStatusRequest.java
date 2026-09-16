package com.financetracker.modules.goal.dto;

import com.financetracker.modules.goal.entity.GoalStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateGoalStatusRequest {

    @NotNull(message = "Статус обязателен")
    private GoalStatus status;

    private Integer sortOrder;
}
