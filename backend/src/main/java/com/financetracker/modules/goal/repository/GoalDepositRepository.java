package com.financetracker.modules.goal.repository;

import com.financetracker.modules.goal.entity.GoalDeposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GoalDepositRepository extends JpaRepository<GoalDeposit, UUID> {
    List<GoalDeposit> findByGoalIdOrderByDepositedAtDesc(UUID goalId);
}
