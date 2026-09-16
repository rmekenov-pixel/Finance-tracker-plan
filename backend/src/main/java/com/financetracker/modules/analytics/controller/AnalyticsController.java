package com.financetracker.modules.analytics.controller;

import com.financetracker.modules.analytics.dto.BalanceTrendPoint;
import com.financetracker.modules.analytics.dto.CategoryExpensePoint;
import com.financetracker.modules.analytics.dto.IncomeExpensePoint;
import com.financetracker.modules.analytics.service.AnalyticsService;
import com.financetracker.shared.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/income-expense")
    public ResponseEntity<List<IncomeExpensePoint>> getIncomeExpense(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo
    ) {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<IncomeExpensePoint> points = analyticsService.getIncomeExpenseMonthly(userId, dateFrom, dateTo);
        return ResponseEntity.ok(points);
    }

    @GetMapping("/by-category")
    public ResponseEntity<List<CategoryExpensePoint>> getByCategory(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo
    ) {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<CategoryExpensePoint> points = analyticsService.getExpensesByCategory(userId, dateFrom, dateTo);
        return ResponseEntity.ok(points);
    }

    @GetMapping("/balance-trend")
    public ResponseEntity<List<BalanceTrendPoint>> getBalanceTrend(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo
    ) {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<BalanceTrendPoint> points = analyticsService.getBalanceTrend(userId, dateFrom, dateTo);
        return ResponseEntity.ok(points);
    }
}
