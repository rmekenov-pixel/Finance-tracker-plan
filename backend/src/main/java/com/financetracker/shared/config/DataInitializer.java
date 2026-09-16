package com.financetracker.shared.config;

import com.financetracker.modules.auth.entity.User;
import com.financetracker.modules.auth.repository.UserRepository;
import com.financetracker.modules.goal.entity.Goal;
import com.financetracker.modules.goal.entity.GoalCategory;
import com.financetracker.modules.goal.entity.GoalStatus;
import com.financetracker.modules.goal.repository.GoalRepository;
import com.financetracker.modules.note.entity.Note;
import com.financetracker.modules.note.entity.NoteEntityType;
import com.financetracker.modules.note.repository.NoteRepository;
import com.financetracker.modules.transaction.entity.Transaction;
import com.financetracker.modules.transaction.entity.TransactionType;
import com.financetracker.modules.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final GoalRepository goalRepository;
    private final NoteRepository noteRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        String demoEmail = "demo@financetracker.com";
        if (userRepository.findByEmail(demoEmail).isPresent()) {
            return;
        }

        log.info("Seeding demo account data: {}", demoEmail);

        User demoUser = User.builder()
                .email(demoEmail)
                .passwordHash(passwordEncoder.encode("password123"))
                .name("Демо Пользователь")
                .currency("KZT")
                .build();

        User savedUser = userRepository.save(demoUser);

        // Seed transactions
        LocalDate now = LocalDate.now();
        List<Transaction> transactions = List.of(
                Transaction.builder()
                        .user(savedUser)
                        .type(TransactionType.INCOME)
                        .category("Зарплата")
                        .amount(BigDecimal.valueOf(450000.00))
                        .description("Основная выплата за месяц")
                        .date(now.minusDays(5))
                        .build(),
                Transaction.builder()
                        .user(savedUser)
                        .type(TransactionType.INCOME)
                        .category("Фриланс")
                        .amount(BigDecimal.valueOf(120000.00))
                        .description("Дизайн мобильного приложения")
                        .date(now.minusDays(2))
                        .build(),
                Transaction.builder()
                        .user(savedUser)
                        .type(TransactionType.EXPENSE)
                        .category("Супермаркет")
                        .amount(BigDecimal.valueOf(35000.00))
                        .description("Продукты на неделю")
                        .date(now.minusDays(4))
                        .build(),
                Transaction.builder()
                        .user(savedUser)
                        .type(TransactionType.EXPENSE)
                        .category("Транспорт")
                        .amount(BigDecimal.valueOf(12000.00))
                        .description("Заправка автомобиля и проезд")
                        .date(now.minusDays(3))
                        .build(),
                Transaction.builder()
                        .user(savedUser)
                        .type(TransactionType.EXPENSE)
                        .category("Кафе и рестораны")
                        .amount(BigDecimal.valueOf(18500.00))
                        .description("Ужин с друзьями")
                        .date(now.minusDays(1))
                        .build(),
                Transaction.builder()
                        .user(savedUser)
                        .type(TransactionType.EXPENSE)
                        .category("Коммунальные услуги")
                        .amount(BigDecimal.valueOf(24000.00))
                        .description("Квартплата и интернет")
                        .date(now.minusDays(6))
                        .build()
        );
        transactionRepository.saveAll(transactions);

        // Seed goals
        List<Goal> goals = List.of(
                Goal.builder()
                        .user(savedUser)
                        .title("Подушка безопасности")
                        .category(GoalCategory.SAVING)
                        .status(GoalStatus.IN_PROGRESS)
                        .targetAmount(BigDecimal.valueOf(1000000.00))
                        .currentAmount(BigDecimal.valueOf(450000.00))
                        .dueDate(now.plusMonths(6))
                        .sortOrder(0)
                        .build(),
                Goal.builder()
                        .user(savedUser)
                        .title("Купить ноутбук для работы")
                        .category(GoalCategory.SAVING)
                        .status(GoalStatus.IN_PROGRESS)
                        .targetAmount(BigDecimal.valueOf(850000.00))
                        .currentAmount(BigDecimal.valueOf(340000.00))
                        .dueDate(now.plusMonths(3))
                        .sortOrder(1)
                        .build(),
                Goal.builder()
                        .user(savedUser)
                        .title("Продлить страховку на автомобиль")
                        .category(GoalCategory.REMINDER)
                        .status(GoalStatus.DONE)
                        .targetAmount(BigDecimal.valueOf(65000.00))
                        .currentAmount(BigDecimal.valueOf(65000.00))
                        .dueDate(now.minusDays(5))
                        .sortOrder(0)
                        .build(),
                Goal.builder()
                        .user(savedUser)
                        .title("Пройти курс по инвестициям")
                        .category(GoalCategory.TASK)
                        .status(GoalStatus.PLANNED)
                        .targetAmount(BigDecimal.valueOf(150000.00))
                        .currentAmount(BigDecimal.ZERO)
                        .dueDate(now.plusMonths(2))
                        .sortOrder(0)
                        .build()
        );
        goalRepository.saveAll(goals);

        // Seed notes
        List<Note> notes = List.of(
                Note.builder()
                        .user(savedUser)
                        .content("Не забыть оплатить интернет и коммунальные до 20-го числа.")
                        .entityType(NoteEntityType.GENERAL)
                        .build(),
                Note.builder()
                        .user(savedUser)
                        .content("Сверить баланс накопительного счёта перед планированием отпуска.")
                        .entityType(NoteEntityType.GENERAL)
                        .build()
        );
        noteRepository.saveAll(notes);

        log.info("Demo account seeded successfully!");
    }
}
