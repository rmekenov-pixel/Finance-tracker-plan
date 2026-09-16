package com.financetracker.modules.goal.repository;

import com.financetracker.modules.goal.entity.Goal;
import com.financetracker.modules.goal.entity.GoalCategory;
import com.financetracker.modules.goal.entity.GoalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GoalRepository extends JpaRepository<Goal, UUID> {

    @Query("SELECT g FROM Goal g WHERE g.user.id = :userId " +
           "AND (:category IS NULL OR g.category = :category) " +
           "ORDER BY g.sortOrder ASC, g.createdAt DESC")
    List<Goal> findByUserIdAndOptionalCategory(
            @Param("userId") UUID userId,
            @Param("category") GoalCategory category
    );

    Optional<Goal> findByIdAndUserId(UUID id, UUID userId);

    @Query("SELECT g FROM Goal g WHERE g.user.id = :userId AND g.category = 'SAVING' AND g.status != 'DONE' " +
           "ORDER BY (g.currentAmount / NULLIF(g.targetAmount, 0)) DESC, g.createdAt DESC")
    List<Goal> findTopActiveSavings(@Param("userId") UUID userId);

    @Query("SELECT g FROM Goal g WHERE g.user.id = :userId AND g.category = 'REMINDER' AND g.status != 'DONE' " +
           "AND g.dueDate BETWEEN :today AND :maxDate ORDER BY g.dueDate ASC")
    List<Goal> findUpcomingReminders(
            @Param("userId") UUID userId,
            @Param("today") LocalDate today,
            @Param("maxDate") LocalDate maxDate
    );
}
