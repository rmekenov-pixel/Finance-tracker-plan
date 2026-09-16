package com.financetracker.modules.goal.dto;

import com.financetracker.modules.goal.entity.GoalDeposit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoalDepositResponse {
    private UUID id;
    private UUID goalId;
    private BigDecimal amount;
    private String comment;
    private Instant depositedAt;

    public static GoalDepositResponse fromEntity(GoalDeposit d) {
        return GoalDepositResponse.builder()
                .id(d.getId())
                .goalId(d.getGoal().getId())
                .amount(d.getAmount())
                .comment(d.getComment())
                .depositedAt(d.getDepositedAt())
                .build();
    }
}
