# 💰 Finance Tracker — Fullstack Financial Assistant

Современное full-stack веб-приложение для управления личными финансами, финансовыми целями и накоплениями, задачами с канбан-доской, полиморфными заметками и глубокой интерактивной аналитикой.

---

## 🚀 Стек технологий

### Backend
- **Java 21 LTS** + **Spring Boot 3.3.3**
- **Spring Security** (Stateless JWT авторизация с Bearer tokens)
- **Spring Data JPA** + **Hibernate ORM**
- **PostgreSQL 17** (production / docker) / **H2** (zero-setup быстрый local dev)
- **Flyway** (версионирование и миграции базы данных `V1`..`V5`)
- **Redis 7** (кэширование и blacklist токенов)
- **JUnit 5 + Mockito** (14/14 интеграционных и сервисных тестов)

### Frontend
- **React 19** + **TypeScript 5.8** + **Vite 6**
- **Tailwind CSS v4** (современная темная тема с акцентами emerald / slate)
- **Feature-Sliced Design (FSD)** модульная архитектура
- **Zustand** (глобальный стейт-менеджмент сессии и пользователя)
- **@hello-pangea/dnd** (плавный оптимистичный Drag-and-Drop канбан)
- **Recharts** (интерактивные диаграммы: структура расходов, доходы vs расходы, тренд баланса)
- **Lucide React** (лаконичные векторные иконки)

---

## 📂 Архитектура Monorepo

```text
finance-tracker/
├── backend/
│   ├── src/main/java/com/financetracker/
│   │   ├── config/             # SecurityConfig, RedisConfig, OpenApiConfig
│   │   ├── security/           # JwtService, JwtFilter, CustomUserDetailsService
│   │   └── modules/
│   │       ├── auth/           # Регистрация, логин, смена пароля, профиль
│   │       ├── transaction/    # Доходы, расходы, фильтрация, суммаризация
│   │       ├── goal/           # Цели, задачи, напоминания, депозиты с @Transactional
│   │       ├── note/           # Полиморфные заметки (GENERAL, TRANSACTION, GOAL)
│   │       └── analytics/      # Агрегация расходов по категориям, динамика баланса
│   ├── src/main/resources/
│   │   ├── db/migration/       # Flyway SQL migrations (V1 - V5)
│   │   ├── application.yml
│   │   ├── application-local.yml   # Встроенный H2 для мгновенного запуска
│   │   └── application-docker.yml  # PostgreSQL + Redis
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── app/                # Router, Providers, Global Styles
│   │   ├── pages/              # Dashboard, Transactions, Kanban, Notes, Analytics, Profile, Auth
│   │   ├── widgets/            # Sidebar, BottomNav, Modals, CategoryBreakdown, SummaryCards
│   │   ├── features/           # CreateTransactionModal, CreateGoalModal, AddDepositModal, CreateNoteModal
│   │   ├── entities/           # Transaction, Goal, Note, Analytics, User (API + Store)
│   │   └── shared/             # UI Components (Button, Input, Modal, Badge), API Client, Utilities
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml          # Запуск всей экосистемы в 1 команду
└── README.md
```

---

## ⚡ Быстрый запуск

### Вариант 1: Zero-Setup локальный запуск (Без Docker / H2 в памяти)

1. **Backend:**
   ```bash
   cd backend
   # Запуск с профилем local (автоматическая БД H2 в памяти, совместимая с Postgres)
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
   ```
   *Backend будет доступен по адресу:* `http://localhost:8080`

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend будет доступен по адресу:* `http://localhost:5173`

---

### Вариант 2: Полный запуск в Docker Compose (Production-ready)

Поднимает 4 контейнера: `PostgreSQL 17`, `Redis 7`, `Spring Boot Backend`, `Nginx + React Frontend`.

```bash
docker compose up --build -d
```

- **Frontend:** `http://localhost` (порт 80)
- **Backend API:** `http://localhost:8080`
- **PostgreSQL:** `localhost:5432`
- **Redis:** `localhost:6379`

---

## 🧪 Тестирование

### Backend Unit & Integration Tests (JUnit 5 / SpringBootTest)
```bash
cd backend
./mvnw clean test
```
Все 14 тестов покрывают:
- Безопасность и хэширование паролей BCrypt
- Расчет транзакций и проверку IDOR прав доступа
- Атомарное пополнение финансовых целей и автозавершение при 100%
- Полиморфную привязку заметок к целям и транзакциям
- Расчет аналитических срезов и процентных долей расходов

### Frontend Type Check & Production Build
```bash
cd frontend
npm run build
```

---

## 🔒 Безопасность и фичи

1. **JWT Stateless Authentication**: Хранение токенов в `localStorage`, передача в заголовке `Authorization: Bearer <token>`, валидация на каждом запросе через `JwtFilter`.
2. **Защита от IDOR (Insecure Direct Object Reference)**: Пользователь не может получить, изменить или удалить транзакции, цели или заметки другого пользователя.
3. **Атомарные финансовые транзакции**: Пополнение цели инкапсулировано в транзакцию базы данных (`@Transactional`), обновляя текущий баланс цели и сохраняя историю депозитов.
4. **Адаптивный дизайн**: Полноценная поддержка ПК (Sidebar) и мобильных устройств (BottomNav).
5. **Мультивалютность**: Поддержка KZT (₸), USD ($), EUR (€), RUB (₽).

