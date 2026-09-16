# Finance Tracker

Личный финансовый помощник с трекингом транзакций, канбан-доской целей/задач/напоминаний, полиморфными заметками и финансовой аналитикой.

## Стек технологий

### Backend
- **Java 21** + **Spring Boot 3.3**
- **Spring Security** + JWT аутентификация
- **Spring Data JPA** + **PostgreSQL 17**
- **Flyway** (миграции БД)
- **Redis** (JWT blacklist, кэширование)
- **Maven**

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4**
- **Feature-Sliced Design (FSD)** архитектура
- **Zustand** (стейт-менеджмент)
- **Axios** (HTTP клиент с перехватчиками)
- **@hello-pangea/dnd** (Drag-and-drop канбан)
- **Recharts** (интерактивные графики)
- **React Hook Form** + **Zod** (валидация форм)
- **Lucide React** (иконки)

## Структура проекта

```
finance-tracker/
├── backend/            # Spring Boot REST API
├── frontend/           # React 19 SPA
├── docker-compose.yml  # Локальный запуск всех сервисов в Docker
├── .gitignore
└── README.md
```
