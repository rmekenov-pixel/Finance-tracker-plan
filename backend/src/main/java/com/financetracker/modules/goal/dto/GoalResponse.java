package com.financetracker.modules.goal.dto;

import com.financetracker.modules.goal.entity.Goal;
import com.financetracker.modules.goal.entity.GoalCategory;
import com.financetracker.modules.goal.entity.GoalStatus;
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
public class GoalResponse {
    private UUID id;
    private UUID userId;
    private String title;
    private GoalCategory category;
    private GoalStatus status;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private LocalDate dueDate;
    private Integer sortOrder;
    private String color;
    private Instant createdAt;

    public static GoalResponse fromEntity(Goal g) {
        return GoalResponse.builder()
                .id(g.getId())
                .userId(g.getUser().getId())
                .title(g.getTitle())
                .category(g.getCategory())
                .status(g.getStatus())
                .targetAmount(g.getTargetAmount())
                .currentAmount(g.getCurrentAmount())
                .dueDate(g.getDueDate())
                .sortOrder(g.getSortOrder())
                .color(g.getColor())
                .createdAt(g.getCreatedAt())
                .build();
    }
}
