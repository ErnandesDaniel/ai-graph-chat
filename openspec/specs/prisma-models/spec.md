# prisma-models Specification

## Purpose
TBD - created by archiving change add-prisma-models. Update Purpose after archive.
## Requirements
### Requirement: Define a Prisma model for User
The system SHALL define a Prisma model for User that integrates with Better Auth for Google OAuth authentication, storing user information including `id`, `name`, and `createdAt`.

#### Scenario: User data is stored via Google OAuth
- **WHEN** a user authenticates via Google OAuth
- **THEN** user information including `id`, `name`, and `createdAt` is stored in the database

### Requirement: Define a Prisma model for Chat
The system SHALL define a Prisma model for Chat that stores chat session information including `id`, `userId`, `name`, `isWriting`, `parentId`, `createdAt`, and `updatedAt`, supporting hierarchical chat structures and indicating whether data is currently being written to the chat.

#### Scenario: Chat data is stored with hierarchy and writing status
- **WHEN** a chat session is created
- **THEN** chat session information including `id`, `userId`, `name`, `isWriting`, `parentId`, `createdAt`, and `updatedAt` is stored in the database

### Requirement: Define a Prisma model for Message
The system SHALL define a Prisma model for Message that stores message information including `id`, `chatId`, `userId`, `content`, `createdAt`, and `updatedAt`.

#### Scenario: Message data is stored
- **WHEN** a message is sent
- **THEN** message information including `id`, `chatId`, `userId`, `content`, `createdAt`, and `updatedAt` is stored in the database

