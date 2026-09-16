package com.financetracker.modules.goal.service;

import com.financetracker.modules.auth.entity.User;
import com.financetracker.modules.auth.repository.UserRepository;
import com.financetracker.modules.goal.dto.*;
import com.financetracker.modules.goal.entity.Goal;
import com.financetracker.modules.goal.entity.GoalCategory;
import com.financetracker.modules.goal.entity.GoalDeposit;
import com.financetracker.modules.goal.entity.GoalStatus;
import com.financetracker.modules.goal.repository.GoalDepositRepository;
import com.financetracker.modules.goal.repository.GoalRepository;
import com.financetracker.shared.exception.BadRequestException;
import com.financetracker.shared.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final GoalDepositRepository goalDepositRepository;
    private final UserRepository userRepository;

    @Transactional
    public GoalResponse createGoal(UUID userId, CreateGoalRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        if (request.getCategory() == GoalCategory.SAVING && (request.getTargetAmount() == null || request.getTargetAmount().signum() <= 0)) {
            throw new BadRequestException("Для цели накопления необходимо указать целевую сумму");
        }

        Goal goal = Goal.builder()
                .user(user)
                .title(request.getTitle().trim())
                .category(request.getCategory())
                .status(request.getStatus() != null ? request.getStatus() : GoalStatus.PLANNED)
                .targetAmount(request.getTargetAmount())
                .currentAmount(request.getCurrentAmount() != null ? request.getCurrentAmount() : java.math.BigDecimal.ZERO)
                .dueDate(request.getDueDate())
                .color(request.getColor())
                .build();

        Goal saved = goalRepository.save(goal);
        return GoalResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<GoalResponse> getGoals(UUID userId, GoalCategory category) {
        return goalRepository.findByUserIdAndOptionalCategory(userId, category)
                .stream()
                .map(GoalResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public GoalResponse updateGoalStatus(UUID userId, UUID goalId, UpdateGoalStatusRequest request) {
        Goal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new NotFoundException("Цель не найдена или нет прав на изменение"));

        goal.setStatus(request.getStatus());
        if (request.getSortOrder() != null) {
            goal.setSortOrder(request.getSortOrder());
        }

        Goal updated = goalRepository.save(goal);
        return GoalResponse.fromEntity(updated);
    }

    @Transactional
    public GoalResponse addDeposit(UUID userId, UUID goalId, AddDepositRequest request) {
        Goal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new NotFoundException("Цель не найдена"));

        if (goal.getCategory() != GoalCategory.SAVING) {
            throw new BadRequestException("Пополнение возможно только для целей типа SAVING");
        }

        GoalDeposit deposit = GoalDeposit.builder()
                .goal(goal)
                .amount(request.getAmount())
                .comment(request.getComment())
                .build();

        goalDepositRepository.save(deposit);

        goal.setCurrentAmount(goal.getCurrentAmount().add(request.getAmount()));
        if (goal.getTargetAmount() != null && goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus(GoalStatus.DONE);
        } else if (goal.getStatus() == GoalStatus.PLANNED) {
            goal.setStatus(GoalStatus.IN_PROGRESS);
        }

        Goal updated = goalRepository.save(goal);
        return GoalResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<GoalDepositResponse> getDeposits(UUID userId, UUID goalId) {
        Goal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new NotFoundException("Цель не найдена"));

        return goalDepositRepository.findByGoalIdOrderByDepositedAtDesc(goal.getId())
                .stream()
                .map(GoalDepositResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GoalResponse> getTopSavings(UUID userId) {
        return goalRepository.findTopActiveSavings(userId)
                .stream()
                .limit(5)
                .map(GoalResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GoalResponse> getUpcomingReminders(UUID userId) {
        LocalDate today = LocalDate.now();
        LocalDate nextWeek = today.plusDays(7);
        return goalRepository.findUpcomingReminders(userId, today, nextWeek)
                .stream()
                .map(GoalResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteGoal(UUID userId, UUID goalId) {
        Goal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new NotFoundException("Цель не найдена или нет прав на удаление"));

        goalRepository.delete(goal);
    }
}
