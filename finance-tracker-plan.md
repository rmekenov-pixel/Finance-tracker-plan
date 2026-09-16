# Finance Tracker — Полный план проекта

> Личный финансовый помощник с трекингом транзакций, канбан-доской целей,
> заметками, аналитикой и уведомлениями по коммунальным услугам.
> Стек: Spring Boot 3.3 + PostgreSQL 17 + React 19 + TypeScript + FSD.

---

## Содержание

1. [Резюме продукта](#1-резюме-продукта)
2. [Архитектура системы](#2-архитектура-системы)
3. [Модель данных](#3-модель-данных)
4. [Карта страниц и компонентов](#4-карта-страниц-и-компонентов)
5. [Tech Stack с обоснованием](#5-tech-stack-с-обоснованием)
6. [Структура репозитория](#6-структура-репозитория)
7. [Фазы разработки](#7-фазы-разработки)
8. [Подводные камни](#8-подводные-камни)

---

## 1. Резюме продукта

**Что это:** Мобайл-фёрст веб-приложение для личных финансов.

**Кто пользователи:** Несколько аккаунтов, каждый видит только свои данные.

**Ключевые модули:**

| Модуль | Суть |
|---|---|
| Транзакции | Ручной ввод доходов и расходов по категориям |
| Канбан / Цели | Финансовые цели, задачи и напоминания в виде доски |
| Заметки | Свободные записи, привязанные к любой сущности |
| Аналитика | Графики по категориям, периодам, динамика баланса |
| Уведомления | Напоминания по коммуналке — это карточки типа REMINDER на канбане |
| Профиль | Данные аккаунта, настройки, аватар |

**Ключевое архитектурное решение:**
`Savings` и `Kanban` — одна сущность `Goal` с тремя категориями: `SAVING`, `TASK`, `REMINDER`.
Пополнение накоплений — вручную через карточку (Вариант А).

---

## 2. Архитектура системы

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (React 19)                │
│  Vite · TypeScript · Tailwind v4 · FSD · Zustand   │
│  Axios interceptors → автоподстановка JWT           │
└───────────────────┬─────────────────────────────────┘
                    │ HTTPS / REST API
                    │ /api/v1/**
┌───────────────────▼─────────────────────────────────┐
│              BACKEND (Spring Boot 3.3)              │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │   Auth   │  │ Business │  │   Notification   │  │
│  │  Module  │  │  Modules │  │    Scheduler     │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│                                                     │
│  Spring Security (JWT) · Spring Data JPA · Flyway  │
└───────────┬──────────────────────────┬──────────────┘
            │                          │
┌───────────▼──────────┐  ┌───────────▼──────────────┐
│   PostgreSQL 17      │  │        Redis              │
│                      │  │                           │
│  Users               │  │  JWT blacklist            │
│  Transactions        │  │  Rate limiting            │
│  Goals               │  │  Session cache            │
│  Notes               │  │                           │
│  GoalDeposits        │  └───────────────────────────┘
└──────────────────────┘
```

**Паттерн:** Модульный монолит. Не микросервисы — для текущего масштаба это over-engineering. Каждый модуль (`auth`, `transaction`, `goal`, `note`) — изолированная папка со своими контроллером, сервисом, репозиторием и DTO. Разбить на микросервисы можно позже без переписывания логики.

---

## 3. Модель данных

### ERD (текстовое представление)

```
users
├── id (UUID)
├── email (unique)
├── password_hash
├── name
├── avatar_url
├── currency (default: 'KZT')
└── created_at

transactions
├── id (UUID)
├── user_id → users.id
├── amount (DECIMAL 15,2)
├── type (ENUM: INCOME / EXPENSE)
├── category (VARCHAR)
├── description (TEXT, nullable)
├── date (DATE)
└── created_at

goals
├── id (UUID)
├── user_id → users.id
├── title (VARCHAR)
├── category (ENUM: SAVING / TASK / REMINDER)
├── status (ENUM: PLANNED / IN_PROGRESS / DONE)
├── target_amount (DECIMAL, nullable — только для SAVING)
├── current_amount (DECIMAL, default 0 — только для SAVING)
├── due_date (DATE, nullable)
├── sort_order (INT — порядок карточек в колонке)
├── color (VARCHAR — цвет карточки, hex)
└── created_at

goal_deposits                   ← история пополнений цели
├── id (UUID)
├── goal_id → goals.id
├── amount (DECIMAL)
├── comment (TEXT, nullable)
└── deposited_at

notes
├── id (UUID)
├── user_id → users.id
├── content (TEXT)
├── entity_type (ENUM: TRANSACTION / GOAL / GENERAL)
├── entity_id (UUID, nullable — ID привязанной сущности)
└── created_at
```

### Решения по модели данных

**Почему UUID вместо LONG:**
UUID безопаснее при мультиюзерной системе — нельзя перебрать чужие ID по порядку (защита от IDOR).

**Почему `goal_deposits` отдельная таблица:**
Нужна история — "когда и сколько внёс". Если хранить только `current_amount`, историю не восстановить.

**Почему `notes.entity_type` + `notes.entity_id`:**
Полиморфная привязка. Одна таблица заметок работает для любой сущности без JOIN-таблиц на каждый случай.

---

## 4. Карта страниц и компонентов

### Роутинг

```
/                     → redirect → /app/dashboard (если залогинен)
                                → /auth/login (если нет)

/auth/login           → LoginPage
/auth/register        → RegisterPage

/app/dashboard        → DashboardPage
/app/transactions     → TransactionsPage
/app/kanban           → KanbanPage
/app/notes            → NotesPage
/app/analytics        → AnalyticsPage
/app/profile          → ProfilePage
```

---

### Описание каждой страницы

#### `/app/dashboard` — Главная / Сводка

**Что отображает:**
- Текущий баланс (доходы минус расходы за месяц)
- Последние 5 транзакций
- Прогресс активных целей-накоплений (топ 3)
- Ближайшие REMINDER-карточки (следующие 7 дней)
- Мини-график расходов за последние 30 дней

**Компоненты:**
```
DashboardPage
├── BalanceCard          — большой виджет с балансом и дельтой vs прошлый месяц
├── RecentTransactions   — список последних 5, кнопка "Все транзакции"
├── SavingsProgress      — прогресс-бары топ-3 целей
├── UpcomingReminders    — список ближайших напоминаний с датами
└── MiniSpendingChart    — линейный график расходов (Recharts)
```

---

#### `/app/transactions` — Транзакции

**Что отображает:**
- Список всех транзакций с пагинацией
- Фильтры: тип (доход/расход), категория, диапазон дат
- Сумма по фильтру вверху
- Кнопка добавить транзакцию

**Компоненты:**
```
TransactionsPage
├── TransactionFilters    — type, category, dateFrom, dateTo
├── TransactionSummary   — итоговые суммы по фильтру
├── TransactionList
│   └── TransactionCard  — карточка одной транзакции
│       └── NotesBadge   — индикатор наличия заметок
├── CreateTransactionModal
└── Pagination
```

---

#### `/app/kanban` — Канбан / Цели / Задачи

**Что отображает:**
Три колонки: `Запланировано`, `В процессе`, `Готово`.
Карточки делятся визуально по категории: SAVING (с прогресс-баром), TASK (чекбокс), REMINDER (дата + иконка колокола).

**Компоненты:**
```
KanbanPage
├── KanbanFilters         — фильтр по category: ALL / SAVING / TASK / REMINDER
├── KanbanBoard
│   ├── KanbanColumn (PLANNED)
│   │   └── GoalCard[]
│   ├── KanbanColumn (IN_PROGRESS)
│   │   └── GoalCard[]
│   └── KanbanColumn (DONE)
│       └── GoalCard[]
└── CreateGoalModal       — форма с выбором category
```

**GoalCard — внутренняя структура:**
```
GoalCard
├── Header (title + category badge + color dot)
├── [если SAVING]  ProgressBar + currentAmount / targetAmount
│                  кнопка "+ Пополнить"
├── [если REMINDER] дата дедлайна + иконка колокола
├── [если TASK]    чекбокс завершения
├── due_date (если задан)
├── NotesBadge     — клик открывает список заметок
└── Actions: переместить статус / удалить / редактировать
```

**Drag-and-drop:** карточки перетаскиваются между колонками.
Библиотека: `@hello-pangea/dnd` (форк dnd-kit, стабильнее для React 19).
При drop → PATCH `/api/v1/goals/{id}/status` обновляет статус в БД.

---

#### `/app/notes` — Заметки

**Что отображает:**
- Все заметки пользователя
- Фильтр по entity_type
- Клик на заметку → переход к привязанной сущности
- Свободная заметка (GENERAL) без привязки

**Компоненты:**
```
NotesPage
├── NotesFilter          — ALL / TRANSACTION / GOAL / GENERAL
├── NotesList
│   └── NoteCard         — контент + метаданные + ссылка на сущность
└── CreateNoteModal      — с выбором привязки
```

---

#### `/app/analytics` — Аналитика

**Что отображает:**
- Доходы vs расходы по месяцам (bar chart)
- Расходы по категориям (pie chart)
- Динамика баланса (line chart)
- Фильтр по периоду: неделя / месяц / квартал / год

**Компоненты:**
```
AnalyticsPage
├── PeriodSelector
├── IncomeExpenseChart   — Recharts BarChart
├── CategoryPieChart     — Recharts PieChart
└── BalanceTrendChart    — Recharts LineChart
```

---

#### `/app/profile` — Профиль

**Что отображает:**
- Аватар, имя, email
- Смена пароля
- Выбор валюты отображения
- Кнопка выйти

---

## 5. Tech Stack с обоснованием

### Backend

| Инструмент | Зачем |
|---|---|
| Java 17 + Spring Boot 3.3 | Типобезопасность, зрелая экосистема, стандарт энтерпрайз |
| Spring Security + JWT | Авторизация без сессий — подходит для SPA |
| Spring Data JPA | SQL без рутины, методы выборки из имени метода |
| Flyway | Версионированные миграции — никаких `ddl-auto=create` в продакшне |
| Lombok | Убирает геттеры/сеттеры/билдеры — меньше шума в коде |
| PostgreSQL 17 | JSONB для гибких полей, надёжность, бесплатно |
| Redis | JWT-блэклист при logout, rate limiting |
| Spring Scheduler | `@Scheduled` для проверки дедлайнов REMINDER-карточек |

### Frontend

| Инструмент | Зачем |
|---|---|
| React 19 + Vite | Быстрая сборка, HMR, современный стандарт |
| TypeScript | Типы синхронизированы с DTO бэкенда |
| Tailwind CSS v4 | Утилитарные стили, нет отдельных .css файлов |
| FSD | Масштабируемая архитектура папок |
| Zustand | Лёгкий стейт-менеджер (токен, юзер, UI-состояния) |
| Axios | Интерцепторы для JWT, обработка 401 |
| Recharts | Графики — простая интеграция с React |
| @hello-pangea/dnd | Drag-and-drop для канбана, стабильный форк |
| React Hook Form + Zod | Формы с валидацией, типобезопасные схемы |
| React Router v6 | Роутинг с защищёнными маршрутами |

---

## 6. Структура репозитория

```
finance-tracker/
│
├── backend/
│   ├── src/main/
│   │   ├── java/com/financetracker/
│   │   │   ├── Application.java
│   │   │   ├── shared/
│   │   │   │   ├── security/
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── JwtFilter.java
│   │   │   │   │   ├── JwtService.java
│   │   │   │   │   └── SecurityUtils.java
│   │   │   │   └── exception/
│   │   │   │       ├── GlobalExceptionHandler.java
│   │   │   │       ├── NotFoundException.java
│   │   │   │       └── ForbiddenException.java
│   │   │   └── modules/
│   │   │       ├── auth/
│   │   │       │   ├── controller/AuthController.java
│   │   │       │   ├── service/AuthService.java
│   │   │       │   ├── entity/User.java
│   │   │       │   ├── repository/UserRepository.java
│   │   │       │   └── dto/
│   │   │       │       ├── LoginRequest.java
│   │   │       │       ├── RegisterRequest.java
│   │   │       │       └── AuthResponse.java
│   │   │       ├── transaction/
│   │   │       │   ├── controller/TransactionController.java
│   │   │       │   ├── service/TransactionService.java
│   │   │       │   ├── entity/Transaction.java
│   │   │       │   ├── repository/TransactionRepository.java
│   │   │       │   └── dto/
│   │   │       │       ├── CreateTransactionRequest.java
│   │   │       │       └── TransactionResponse.java
│   │   │       ├── goal/
│   │   │       │   ├── controller/GoalController.java
│   │   │       │   ├── service/GoalService.java
│   │   │       │   ├── entity/Goal.java
│   │   │       │   ├── entity/GoalDeposit.java
│   │   │       │   ├── repository/GoalRepository.java
│   │   │       │   ├── repository/GoalDepositRepository.java
│   │   │       │   └── dto/
│   │   │       │       ├── CreateGoalRequest.java
│   │   │       │       ├── GoalResponse.java
│   │   │       │       ├── UpdateGoalStatusRequest.java
│   │   │       │       └── AddDepositRequest.java
│   │   │       └── note/
│   │   │           ├── controller/NoteController.java
│   │   │           ├── service/NoteService.java
│   │   │           ├── entity/Note.java
│   │   │           ├── repository/NoteRepository.java
│   │   │           └── dto/
│   │   │               ├── CreateNoteRequest.java
│   │   │               └── NoteResponse.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/
│   │           ├── V1__create_users_table.sql
│   │           ├── V2__create_transactions_table.sql
│   │           ├── V3__create_goals_table.sql
│   │           ├── V4__create_goal_deposits_table.sql
│   │           └── V5__create_notes_table.sql
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   ├── router.tsx
│       │   ├── providers/
│       │   │   ├── QueryProvider.tsx
│       │   │   └── RouterProvider.tsx
│       │   └── styles/index.css
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── LoginPage.tsx
│       │   │   └── RegisterPage.tsx
│       │   └── app/
│       │       ├── DashboardPage.tsx
│       │       ├── TransactionsPage.tsx
│       │       ├── KanbanPage.tsx
│       │       ├── NotesPage.tsx
│       │       ├── AnalyticsPage.tsx
│       │       └── ProfilePage.tsx
│       ├── widgets/
│       │   ├── Navbar/
│       │   ├── Sidebar/
│       │   ├── KanbanBoard/
│       │   ├── TransactionList/
│       │   └── AnalyticsCharts/
│       ├── features/
│       │   ├── auth-by-email/
│       │   ├── create-transaction/
│       │   ├── create-goal/
│       │   ├── add-deposit/
│       │   ├── move-goal-status/
│       │   └── create-note/
│       ├── entities/
│       │   ├── user/
│       │   │   ├── model/
│       │   │   │   ├── userStore.ts
│       │   │   │   └── types.ts
│       │   │   └── api/userApi.ts
│       │   ├── transaction/
│       │   │   ├── ui/TransactionCard.tsx
│       │   │   ├── model/types.ts
│       │   │   └── api/transactionApi.ts
│       │   ├── goal/
│       │   │   ├── ui/
│       │   │   │   ├── GoalCard.tsx
│       │   │   │   └── ProgressBar.tsx
│       │   │   ├── model/types.ts
│       │   │   └── api/goalApi.ts
│       │   └── note/
│       │       ├── ui/NoteCard.tsx
│       │       ├── model/types.ts
│       │       └── api/noteApi.ts
│       └── shared/
│           ├── api/apiClient.ts
│           ├── ui/
│           │   ├── Button.tsx
│           │   ├── Input.tsx
│           │   ├── Modal.tsx
│           │   ├── Badge.tsx
│           │   └── ProgressBar.tsx
│           └── lib/
│               ├── formatCurrency.ts
│               └── formatDate.ts
│
├── .gitignore
└── README.md
```

---

## 7. Фазы разработки

### Фаза 0 — Подготовка окружения (1–2 дня)

**Цель:** Инфраструктура готова, первый запрос проходит сквозь весь стек.

- [ ] Инициализировать монорепозиторий
- [ ] Создать Spring Boot проект через [start.spring.io](https://start.spring.io) с зависимостями: Web, Security, JPA, PostgreSQL, Redis, Flyway, Lombok
- [ ] Создать React + Vite + TypeScript проект
- [ ] Настроить PostgreSQL локально (Docker Compose)
- [ ] Написать `V1__create_users_table.sql`, убедиться что Flyway применяет миграцию
- [ ] Настроить CORS в Spring Boot
- [ ] Настроить Axios с базовым URL и интерцептором
- [ ] Проверить: фронтенд делает запрос к бэку, бэк отвечает 200

**Docker Compose для локальной разработки:**
```yaml
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_DB: financetracker
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
    ports:
      - "5432:5432"
  redis:
    image: redis:7
    ports:
      - "6379:6379"
```

---

### Фаза 1 — Auth (3–4 дня)

**Цель:** Пользователь может зарегистрироваться, войти, получить JWT, выйти.

**Backend:**
- [ ] `User` entity + `V1__create_users_table.sql`
- [ ] `AuthController`: POST `/api/v1/auth/register`, POST `/api/v1/auth/login`
- [ ] `AuthService`: BCrypt пароль, генерация JWT
- [ ] `JwtFilter`: перехват запросов, валидация токена
- [ ] `SecurityConfig`: публичные роуты (`/auth/**`), остальное — закрыто
- [ ] Logout через Redis blacklist

**Frontend:**
- [ ] `LoginPage` + `RegisterPage`
- [ ] `userStore` (Zustand): хранение токена и данных юзера
- [ ] Axios интерцептор: подставляет `Authorization: Bearer <token>`
- [ ] `PrivateRoute`: редирект на `/auth/login` если нет токена
- [ ] После логина → редирект на `/app/dashboard`

**Готово когда:** Токен сохраняется, закрытые роуты недоступны без него, logout инвалидирует токен.

---

### Фаза 2 — Транзакции (3–4 дня)

**Цель:** Полный CRUD транзакций, список с фильтрами.

**Backend:**
- [ ] `V2__create_transactions_table.sql`
- [ ] `Transaction` entity с `@ManyToOne` к `User`
- [ ] `TransactionRepository`: `findAllByUserIdOrderByDateDesc`, фильтры по типу и датам
- [ ] `TransactionService`: CRUD + проверка владения (IDOR защита)
- [ ] `TransactionController`:
  - `GET /api/v1/transactions` — список с фильтрами (query params)
  - `POST /api/v1/transactions` — создать
  - `DELETE /api/v1/transactions/{id}` — удалить
  - `GET /api/v1/transactions/summary` — сумма доходов и расходов

**Frontend:**
- [ ] `TransactionPage` с фильтрами
- [ ] `CreateTransactionModal` (React Hook Form + Zod)
- [ ] `TransactionCard` — доходы зелёным, расходы красным
- [ ] `transactionApi.ts` — все запросы через apiClient

**Готово когда:** Транзакция создаётся через форму, сохраняется в PostgreSQL, появляется в списке.

---

### Фаза 3 — Канбан / Цели (4–5 дней)

**Цель:** Канбан-доска с тремя типами карточек, drag-and-drop, пополнение накоплений.

**Backend:**
- [ ] `V3__create_goals_table.sql` + `V4__create_goal_deposits_table.sql`
- [ ] `Goal` entity, `GoalDeposit` entity
- [ ] `GoalRepository`: `findAllByUserIdOrderBySortOrder`
- [ ] `GoalService`: CRUD + смена статуса + добавление депозита + пересчёт `currentAmount`
- [ ] `GoalController`:
  - `GET /api/v1/goals` — все цели пользователя (с фильтром по category)
  - `POST /api/v1/goals` — создать
  - `PATCH /api/v1/goals/{id}/status` — сменить колонку
  - `POST /api/v1/goals/{id}/deposits` — пополнить накопление
  - `DELETE /api/v1/goals/{id}` — удалить

**Frontend:**
- [ ] `KanbanBoard` виджет с тремя колонками
- [ ] `GoalCard` — три визуальных варианта по category
- [ ] `ProgressBar` для SAVING карточек
- [ ] Drag-and-drop через `@hello-pangea/dnd`
- [ ] `CreateGoalModal` с выбором category
- [ ] `AddDepositModal` для пополнения SAVING

**Готово когда:** Карточку можно создать, перетащить между колонками, пополнить накопление — всё сохраняется в БД.

---

### Фаза 4 — Заметки (2–3 дня)

**Цель:** Заметки привязаны к любой сущности, отображаются везде где нужно.

**Backend:**
- [ ] `V5__create_notes_table.sql`
- [ ] `Note` entity с полиморфной привязкой
- [ ] `NoteController`:
  - `GET /api/v1/notes` — все заметки (с фильтром по entity_type)
  - `POST /api/v1/notes` — создать с привязкой
  - `DELETE /api/v1/notes/{id}` — удалить

**Frontend:**
- [ ] `NotesPage` со списком и фильтрами
- [ ] `NotesBadge` — иконка на карточках транзакций и целей
- [ ] `CreateNoteModal` с выбором привязки

---

### Фаза 5 — Аналитика (3–4 дня)

**Цель:** Три графика с фильтром по периоду.

**Backend:**
- [ ] `AnalyticsController`:
  - `GET /api/v1/analytics/income-expense` — доходы/расходы по месяцам
  - `GET /api/v1/analytics/by-category` — расходы по категориям
  - `GET /api/v1/analytics/balance-trend` — динамика баланса

Все эндпоинты принимают `dateFrom` и `dateTo` query params.
Запросы через `@Query` с нативным SQL или JPQL — не в сервисе.

**Frontend:**
- [ ] `AnalyticsPage` с `PeriodSelector`
- [ ] `IncomeExpenseChart` (Recharts BarChart)
- [ ] `CategoryPieChart` (Recharts PieChart)
- [ ] `BalanceTrendChart` (Recharts LineChart)

---

### Фаза 6 — Dashboard (1–2 дня)

**Цель:** Сборка сводной страницы из уже готовых компонентов.

- [ ] `BalanceCard` — текущий баланс месяца
- [ ] `RecentTransactions` — последние 5 (переиспользуем `TransactionCard`)
- [ ] `SavingsProgress` — топ-3 активных SAVING цели (переиспользуем `ProgressBar`)
- [ ] `UpcomingReminders` — REMINDER карточки на ближайшие 7 дней
- [ ] `MiniSpendingChart` — маленький Recharts LineChart

Dashboard собирается на 80% из уже готовых компонентов — поэтому эта фаза последняя.

---

### Фаза 7 — Профиль и Полировка (2–3 дня)

**Цель:** Профиль пользователя, мобайл-адаптация, финальная полировка.

- [ ] `ProfilePage`: смена имени, пароля, валюты, аватара
- [ ] Мобайл-адаптация: Sidebar → нижняя навигация на мобайле
- [ ] Loading skeleton состояния
- [ ] Empty state экраны (канбан без карточек, транзакции без записей)
- [ ] Error boundary
- [ ] Toast уведомления (успех / ошибка)

---

### Фаза 8 — Deploy (1–2 дня)

- [ ] Backend → Railway или Render (бесплатный тир, Docker)
- [ ] Frontend → Vercel (автодеплой из GitHub)
- [ ] PostgreSQL → Railway managed или Supabase (бесплатно до 500MB)
- [ ] Redis → Upstash (бесплатный тир)
- [ ] Настроить переменные окружения в продакшне
- [ ] HTTPS автоматически на Vercel и Railway

---

### Итоговый timeline

| Фаза | Содержание | Дней |
|---|---|---|
| 0 | Окружение и инфраструктура | 1–2 |
| 1 | Auth | 3–4 |
| 2 | Транзакции | 3–4 |
| 3 | Канбан / Цели | 4–5 |
| 4 | Заметки | 2–3 |
| 5 | Аналитика | 3–4 |
| 6 | Dashboard | 1–2 |
| 7 | Профиль и полировка | 2–3 |
| 8 | Deploy | 1–2 |
| **Итого** | | **~20–29 дней** |

---

## 8. Подводные камни

### Backend

**IDOR атаки — самая частая ошибка джунов**
Всегда проверяй: `goal.getUserId().equals(currentUserId)` перед любой операцией.
Иначе пользователь A может удалить данные пользователя B, зная его ID.

**`ddl-auto=create` в продакшне**
Никогда. Только `ddl-auto=validate`. Схема управляется исключительно Flyway.
`create` удалит все данные при рестарте.

**Транзакционность пополнения цели**
`addDeposit` должен быть `@Transactional`:
обновление `current_amount` в `goals` + создание записи в `goal_deposits` — это одна атомарная операция.

**N+1 проблема**
Если грузишь список транзакций и для каждой отдельным запросом тянешь данные — БД умирает.
Используй `@EntityGraph` или `JOIN FETCH` в репозитории.

**JWT в localStorage**
Уязвимо к XSS. Лучше хранить в `httpOnly cookie`.
Для учебного проекта localStorage допустим, но знай о риске.

### Frontend

**FSD нарушения**
`shared/ui/Button` не должен знать про `entities/transaction`.
Если поймал себя на импорте из слоя выше — что-то пошло не так.

**Drag-and-drop и оптимистичные обновления**
При перетаскивании карточки — сразу обновляй UI (optimistic update), потом шли запрос.
Если ждать ответа сервера — интерфейс будет "залипать".

**Recharts и ResponsiveContainer**
Всегда оборачивай графики в `<ResponsiveContainer width="100%" height={300}>`.
Иначе на мобайле график выйдет за пределы экрана.

**Zustand и сброс стейта при logout**
При выходе вызывай `useUserStore.getState().reset()` — иначе данные предыдущего пользователя остаются в памяти.

### Архитектурные

**Не пытайся строить всё параллельно**
Auth должен быть готов до начала любого другого модуля — всё зависит от `userId`.

**Аналитические запросы дорогие**
Группировки по датам на больших таблицах — медленно.
Добавь индексы: `CREATE INDEX idx_transactions_user_date ON transactions(user_id, date)`.

**Канбан sort_order**
Если не хранить порядок карточек в БД — после перезагрузки страницы они перемешаются.
При drag-and-drop обновляй `sort_order` всех затронутых карточек в одном запросе.
