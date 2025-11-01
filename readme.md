
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Для работы с Prisma нужны пакеты:
npm install prisma
npm install @prisma/client

Создание шаблона для схем Prisma:
npx prisma init --output /prisma-entities

Создание или обновление Prisma Client на основе схем данных можно сделать через команду:
npx prisma generate

Устанавливаем open spec cli-инструмент кодирования с ИИ

npm install -g @fission-ai/openspec@latest

Проверяем, что cli успешно установлена
openspec --version

Инициализация спецификации (создание спецификации проекта)
openspec init


Next steps - Copy these prompts to Kilo Code:
────────────────────────────────────────────────────────────
1. Populate your project context:
   Please read openspec/project.md and help me fill it out
   with details about my project, tech stack, and conventions

   
Проект: AI Chat Graph

Описание
Приложение позволяет пользователям общаться с ИИ через чат-интерфейс, 
при этом каждая сессия чата сохраняется как направленный ациклический граф (DAG),
где каждый узел — это сообщение (пользовательское или от ИИ), 
а рёбра — возможные ветвления диалога. Пользователь может просматривать и 
навигироваться по графу, создавать новые ветви из любого узла и 
сравнивать альтернативные сценарии диалога.


Технический стек
Фронтенд: Next.js 14 (App Router)
Состояние: Zustand
UI Kit: Ant Design (v5+)
Визуализация графов: React Flow
Бэкенд: tRPC (v10+)
База данных: PostgreSQL через Prisma ORM
Аутентификация: Better Auth с Google OAuth
Хостинг: Vercel (рекомендуется)

Project Conventions
Code Style
Форматирование: Prettier + ESLint (TypeScript рекомендации)
Именование:
Компоненты: размещаются в собственной папке с index.tsx
Пример: modules/chat/ui/ChatNodeCard/index.tsx
Название папки — в PascalCase, файл — всегда index.tsx
Хуки: useCamelCase
Пример: modules/chat/lib/useGraphNavigation.ts
tRPC-роуты: camelCase
Пример: createMessage, getChatGraph, forkMessageBranch
Prisma-модели: PascalCase
Пример: ChatSession, MessageNode, User
Файловая структура: организована по принципу модульности (modules)
Каждый модуль отвечает за конкретную функциональную область и содержит всё необходимое внутри себя:
modules/
chat/
pages/ChatPage/index.tsx
ui/ChatInput/index.tsx
ui/ChatNodeCard/index.tsx
lib/useChatState.ts
api/chatRouter.ts
graph/
pages/GraphViewPage/index.tsx
ui/GraphCanvas/index.tsx
lib/graphUtils.ts
auth/
ui/LoginButton/index.tsx
lib/useAuth.ts
shared/
ui/ (общие компоненты: Button, Layout и т.д.)
lib/ (вспомогательные утилиты)
api/ (общие tRPC-клиентские настройки)


TypeScript строгость: strict: true, noImplicitAny: true
Architecture Patterns
Frontend:
Состояние разделено на:
Глобальное (Zustand): текущий чат, выбранный узел, режим просмотра/редактирования
Локальное: UI-состояние компонентов (например, открытое модальное окно)
Асинхронные операции: tRPC-мутации и запросы напрямую в компонентах или через кастомные хуки
Визуализация графа: React Flow + кастомные ноды на основе Ant Design
Backend (tRPC):
Разделение на routers: authRouter, chatRouter, graphRouter
Middleware для проверки аутентификации и принадлежности чата пользователю
Валидация входных данных через Zod
База данных (Prisma):
Модель User — из Better Auth
Модель ChatSession — корневой контейнер чата
Модель MessageNode — узел графа с полями: id, content, role (user/assistant), parentId, chatSessionId, createdAt
Отношения: один чат → много узлов; узел → один родитель (или null для корня)
Testing Strategy
Unit-тесты: Vitest + React Testing Library для:
Zustand-сторов
Утилит (например, функций для обхода графа)
Кастомных хуков
Интеграционные тесты: tRPC-роуты тестируются через @trpc/test
E2E: Playwright для критических путей:
Авторизация через Google
Создание чата → отправка сообщения → создание ветви → визуализация графа
Покрытие: минимум 70% для бизнес-логики, 100% для утилит
Git Workflow
Ветвление: Git Flow
main — стабильная версия
develop — интеграционная ветка
Фичи: feature/short-description
Багфиксы: fix/issue-description
Коммиты: Conventional Commits
feat(chat): add branching from node
fix(auth): handle Google OAuth redirect
refactor(graph): extract node rendering logic
PR: обязательный code review, passing CI (lint, typecheck, test)
Domain Context
Чат-граф: каждый чат — это дерево (или DAG), где пользователь может "развилить" диалог из любого узла, создав новую ветвь. Это полезно для:
Экспериментов с разными запросами к ИИ
Сравнения ответов на похожие формулировки
Образовательных/аналитических сценариев
Роли сообщений: user (от пользователя), assistant (от ИИ)
Корень чата: первое сообщение пользователя
Important Constraints
Безопасность:
Все tRPC-эндпоинты, работающие с чатами, должны проверять, что chatSession.userId === ctx.session.user.id
Запрещено удалять чужие чаты или узлы
Производительность:
Графы могут содержать до 500 узлов — React Flow должен лениво рендерить ноды при масштабировании
Загрузка графа — одним запросом через tRPC (getChatGraph)
UX:
Режим "чат" и "граф" переключаются без перезагрузки
При создании ветви фокус автоматически переходит на новую ноду
Совместимость: поддержка только современных браузеров (Chrome, Firefox, Safari ≥ 2022)
External Dependencies
Better Auth: аутентификация через Google OAuth (использует cookies + secure sessions)
OpenRouter API: для генерации ответов ИИ (токен передаётся через .env)
PostgreSQL: Linux машина в интернете (для dev — Docker-контейнер)
Linux машина в интернете (для dev — Docker-контейнер): для деплоя Next.js-приложения

2. Create your first change proposal:
   I want to add [YOUR FEATURE HERE]. Please create an
   OpenSpec change proposal for this feature

3. Learn the OpenSpec workflow:
   Please explain the OpenSpec workflow from openspec/AGENTS.md
   and how I should work with you on this project