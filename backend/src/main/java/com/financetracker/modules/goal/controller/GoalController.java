package com.financetracker.modules.goal.controller;

import com.financetracker.modules.goal.dto.*;
import com.financetracker.modules.goal.entity.GoalCategory;
import com.financetracker.modules.goal.service.GoalService;
import com.financetracker.shared.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(@Valid @RequestBody CreateGoalRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        GoalResponse response = goalService.createGoal(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<GoalResponse>> getGoals(
            @RequestParam(required = false) GoalCategory category
    ) {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<GoalResponse> goals = goalService.getGoals(userId, category);
        return ResponseEntity.ok(goals);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<GoalResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateGoalStatusRequest request
    ) {
        UUID userId = SecurityUtils.getCurrentUserId();
        GoalResponse updated = goalService.updateGoalStatus(userId, id, request);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/deposits")
    public ResponseEntity<GoalResponse> addDeposit(
            @PathVariable UUID id,
            @Valid @RequestBody AddDepositRequest request
    ) {
        UUID userId = SecurityUtils.getCurrentUserId();
        GoalResponse response = goalService.addDeposit(userId, id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/deposits")
    public ResponseEntity<List<GoalDepositResponse>> getDeposits(@PathVariable UUID id) {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<GoalDepositResponse> deposits = goalService.getDeposits(userId, id);
        return ResponseEntity.ok(deposits);
    }

    @GetMapping("/savings/top")
    public ResponseEntity<List<GoalResponse>> getTopSavings() {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<GoalResponse> savings = goalService.getTopSavings(userId);
        return ResponseEntity.ok(savings);
    }

    @GetMapping("/reminders/upcoming")
    public ResponseEntity<List<GoalResponse>> getUpcomingReminders() {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<GoalResponse> reminders = goalService.getUpcomingReminders(userId);
        return ResponseEntity.ok(reminders);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteGoal(@PathVariable UUID id) {
        UUID userId = SecurityUtils.getCurrentUserId();
        goalService.deleteGoal(userId, id);
        return ResponseEntity.ok(Map.of("message", "Цель успешно удалена"));
    }
}
