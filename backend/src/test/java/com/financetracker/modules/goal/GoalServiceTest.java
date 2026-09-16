package com.financetracker.modules.goal;

import com.financetracker.modules.auth.dto.AuthResponse;
import com.financetracker.modules.auth.dto.RegisterRequest;
import com.financetracker.modules.auth.service.AuthService;
import com.financetracker.modules.goal.dto.AddDepositRequest;
import com.financetracker.modules.goal.dto.CreateGoalRequest;
import com.financetracker.modules.goal.dto.GoalResponse;
import com.financetracker.modules.goal.dto.UpdateGoalStatusRequest;
import com.financetracker.modules.goal.entity.GoalCategory;
import com.financetracker.modules.goal.entity.GoalStatus;
import com.financetracker.modules.goal.service.GoalService;
import com.financetracker.shared.exception.BadRequestException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class GoalServiceTest {

    @Autowired
    private GoalService goalService;

    @Autowired
    private AuthService authService;

    private UUID testUserId;

    @BeforeEach
    void setUp() {
        RegisterRequest req = RegisterRequest.builder()
                .email("goal_user_" + UUID.randomUUID() + "@test.com")
                .password("password123")
                .name("Goal Tester")
                .currency("KZT")
                .build();
        AuthResponse auth = authService.register(req);
        testUserId = auth.getUser().getId();
    }

    @Test
    void createAndManageSavingsGoal_Success() {
        CreateGoalRequest savingReq = CreateGoalRequest.builder()
                .title("Новый ноутбук")
                .category(GoalCategory.SAVING)
                .targetAmount(new BigDecimal("500000.00"))
                .currentAmount(new BigDecimal("100000.00"))
                .dueDate(LocalDate.now().plusMonths(3))
                .build();

        GoalResponse goal = goalService.createGoal(testUserId, savingReq);
        assertNotNull(goal.getId());
        assertEquals(GoalStatus.PLANNED, goal.getStatus());
        assertEquals(new BigDecimal("100000.00"), goal.getCurrentAmount());

        // Add deposit
        AddDepositRequest depositReq = AddDepositRequest.builder()
                .amount(new BigDecimal("400000.00"))
                .comment("Премия")
                .build();

        GoalResponse afterDeposit = goalService.addDeposit(testUserId, goal.getId(), depositReq);
        assertEquals(new BigDecimal("500000.00"), afterDeposit.getCurrentAmount());
        assertEquals(GoalStatus.DONE, afterDeposit.getStatus()); // auto-completed because target reached
    }

    @Test
    void createReminderAndMoveStatus_Success() {
        CreateGoalRequest reminderReq = CreateGoalRequest.builder()
                .title("Оплата ЖКХ")
                .category(GoalCategory.REMINDER)
                .dueDate(LocalDate.now().plusDays(2))
                .build();

        GoalResponse reminder = goalService.createGoal(testUserId, reminderReq);
        assertEquals(GoalCategory.REMINDER, reminder.getCategory());
        assertEquals(GoalStatus.PLANNED, reminder.getStatus());

        // Move to IN_PROGRESS
        UpdateGoalStatusRequest updateReq = UpdateGoalStatusRequest.builder()
                .status(GoalStatus.IN_PROGRESS)
                .build();

        GoalResponse updated = goalService.updateGoalStatus(testUserId, reminder.getId(), updateReq);
        assertEquals(GoalStatus.IN_PROGRESS, updated.getStatus());

        List<GoalResponse> upcoming = goalService.getUpcomingReminders(testUserId);
        assertEquals(1, upcoming.size());
    }

    @Test
    void savingWithoutTargetAmount_ThrowsBadRequest() {
        CreateGoalRequest invalidReq = CreateGoalRequest.builder()
                .title("Невалидное накопление")
                .category(GoalCategory.SAVING)
                .targetAmount(null)
                .build();

        assertThrows(BadRequestException.class, () -> goalService.createGoal(testUserId, invalidReq));
    }
}
