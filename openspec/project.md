# Project Context

## Purpose
AI Chat Graph is an application that allows users to communicate with AI through a chat interface. Each chat session is saved as a directed acyclic graph (DAG), where each node represents a message (either from the user or the AI), and edges represent possible dialog branches. Users can navigate through the graph, create new branches from any node, and compare alternative dialog scenarios.

## Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **State Management**: Zustand
- **UI Kit**: Ant Design (v5+)
- **Graph Visualization**: React Flow
- **Backend**: tRPC (v10+)
- **Database**: PostgreSQL through Prisma ORM
- **Authentication**: Better Auth with Google OAuth
- **Hosting**: Vercel (recommended)

## Project Conventions

### Code Style
- **Formatting**: Prettier + ESLint (TypeScript recommendations)
- **Naming**:
  - **Components**: Placed in their own folder with `index.tsx`
    - Example: `modules/chat/ui/ChatNodeCard/index.tsx`
    - Folder name: PascalCase, file: always `index.tsx`
  - **Hooks**: `useCamelCase`
    - Example: `modules/chat/lib/useGraphNavigation.ts`
  - **tRPC Routes**: camelCase
    - Example: `createMessage`, `getChatGraph`, `forkMessageBranch`
  - **Prisma Models**: PascalCase
    - Example: `ChatSession`, `MessageNode`, `User`
- **File Structure**: Organized by modularity (modules)
  - Each module is responsible for a specific functional area and contains everything necessary inside itself:
    - `modules/`
      - `chat/`
        - `pages/ChatPage/index.tsx`
        - `ui/ChatInput/index.tsx`
        - `ui/ChatNodeCard/index.tsx`
        - `lib/useChatState.ts`
        - `api/chatRouter.ts`
      - `graph/`
        - `pages/GraphViewPage/index.tsx`
        - `ui/GraphCanvas/index.tsx`
        - `lib/graphUtils.ts`
      - `auth/`
        - `ui/LoginButton/index.tsx`
        - `lib/useAuth.ts`
      - `shared/`
        - `ui/` (common components: Button, Layout, etc.)
        - `lib/` (utility helpers)
        - `api/` (common tRPC client settings)
- **TypeScript Strictness**: `strict: true`, `noImplicitAny: true`

### Architecture Patterns
- **Frontend**:
  - State is divided into:
    - **Global (Zustand)**: current chat, selected node, view/edit mode
    - **Local**: UI state of components (e.g., open modal)
  - Asynchronous operations: tRPC mutations and queries directly in components or through custom hooks
  - Graph visualization: React Flow + custom nodes based on Ant Design
- **Backend (tRPC)**:
  - Split into routers: `authRouter`, `chatRouter`, `graphRouter`
  - Middleware for authentication and chat ownership check
  - Input validation through Zod
- **Database (Prisma)**:
  - **User Model**: from Better Auth
  - **ChatSession Model**: root container of chat
  - **MessageNode Model**: node of the graph with fields: `id`, `content`, `role` (user/assistant), `parentId`, `chatSessionId`, `createdAt`
  - Relationships: one chat → many nodes; node → one parent (or null for root)

### Testing Strategy
- **Unit Tests**: Vitest + React Testing Library for:
  - Zustand stores
  - Utilities (e.g., functions for graph traversal)
  - Custom hooks
- **Integration Tests**: tRPC routes tested through `@trpc/test`
- **E2E**: Playwright for critical paths:
  - Authorization through Google
  - Create chat → send message → create branch → visualize graph
- **Coverage**: minimum 70% for business logic, 100% for utilities

### Git Workflow
- **Branching**: Git Flow
  - `main` — stable version
  - `develop` — integration branch
  - Features: `feature/short-description`
  - Bugfixes: `fix/issue-description`
- **Commits**: Conventional Commits
  - Example: `feat(chat): add branching from node`
  - Example: `fix(auth): handle Google OAuth redirect`
  - Example: `refactor(graph): extract node rendering logic`
- **PR**: mandatory code review, passing CI (lint, typecheck, test)

## Domain Context
- **Chat Graph**: Each chat is a tree (or DAG) where users can "branch" the dialog from any node, creating a new branch. This is useful for:
  - Experimenting with different requests to AI
  - Comparing responses to similar formulations
  - Educational/analytical scenarios
- **Message Roles**: `user` (from user), `assistant` (from AI)
- **Chat Root**: the first user message

## Important Constraints
- **Security**:
  - All tRPC endpoints working with chats must verify that `chatSession.userId === ctx.session.user.id`
  - Deleting other users' chats or nodes is prohibited
- **Performance**:
  - Graphs can contain up to 500 nodes — React Flow should lazily render nodes on scaling
  - Graph loading — one request through tRPC (`getChatGraph`)
- **UX**:
  - Chat and graph modes switch without reloading
  - Focus automatically shifts to the new node when creating a branch
- **Compatibility**: Supports only modern browsers (Chrome, Firefox, Safari ≥ 2022)

## External Dependencies
- **Better Auth**: Authentication through Google OAuth (uses cookies + secure sessions)
- **OpenRouter API**: For generating AI responses (token passed through `.env`)
- **PostgreSQL**: Linux machine in the internet (for dev — Docker container)
- **Linux Machine**: For deploying Next.js application (for dev — Docker container)
