# DevConnect API Specification

> Version: 1.0
>
> Status: Draft
>
> Last Updated: July 2026

---

# 1. Overview

The DevConnect backend exposes a REST API that enables user authentication, developer networking, profile management, project management, collaboration, messaging, reviews, notifications, and session management. All endpoints exchange JSON data over HTTPS.

---

# 2. API Conventions

> **Identifier Convention:** All route parameters named `:publicId` refer to nanoid-generated public identifiers. MongoDB ObjectIds are never exposed through the public API.

| Item           | Standard         |
| -------------- | ---------------- |
| Protocol       | HTTPS            |
| Format         | JSON             |
| Authentication | JWT Access Token |
| Base URL       | `/api/v1`        |
| Time Format    | ISO 8601         |

| CRUD Operation     | HTTP Method |
| ------------------ | ----------- |
| Create             | POST        |
| Read               | GET         |
| Partial Update     | PATCH       |
| Replace (Reserved) | PUT         |
| Delete             | DELETE      |

### Authentication Requirements

| Access Type | Authentication Method    |
| ----------- | ------------------------ |
| Public      | None                     |
| Protected   | JWT Access Token         |
| Refresh     | HTTP-only Refresh Cookie |

### Authentication

| Token         | Storage                                | Purpose                                                      |
| ------------- | -------------------------------------- | ------------------------------------------------------------ |
| Access Token  | `Authorization: Bearer <token>` header | Authenticate protected API requests                          |
| Refresh Token | HTTP-only Cookie                       | Obtain new access tokens and manage multiple active sessions |

**Token Lifetime**

- Access Token: 15 minutes
- Refresh Token: 30 days

**Cookie Configuration**

- HttpOnly
- Secure (production)
- SameSite=Lax

### Standard Response

```json
{
	"success": true,
	"message": "Operation completed successfully.",
	"data": {}
}
```

### Paginated Response

```json
{
	"success": true,
	"data": [],
	"pagination": {
		"page": 1,
		"limit": 10,
		"total": 100
	}
}
```

### Error Response

```json
{
	"success": false,
	"message": "Descriptive error message"
}
```

---

# 3. API Modules

| Module         | Purpose                                    |
| -------------- | ------------------------------------------ |
| Authentication | Register, login, logout, refresh token     |
| Users          | Profile, skills, account management        |
| Connections    | Developer connection requests and professional network |
| Projects       | Create, update, search and manage projects |
| Collaboration  | Collaboration requests and members         |
| Conversations  | Create and fetch conversations             |
| Messages       | Send and receive messages                  |
| Reviews        | Submit and view reviews                    |
| Notifications  | User notifications                         |
| Sessions       | Manage active login sessions               |

---

# 4. Endpoints

## Authentication

| Method | Endpoint         | Auth | Description          | Notes                      |
| ------ | ---------------- | ---- | -------------------- | -------------------------- |
| POST   | `/auth/register` | No   | Register a new user  | Public endpoint            |
| POST   | `/auth/login`    | No   | Log in               | Public endpoint            |
| POST   | `/auth/logout`   | Yes  | Log out              | Current authenticated user |
| POST   | `/auth/refresh`  | No   | Refresh access token | Uses refresh token         |
| GET    | `/auth/me`       | Yes  | Get current user     | Current authenticated user |

## Users

| Method | Endpoint             | Auth | Description                 | Notes              |
| ------ | -------------------- | ---- | --------------------------- | ------------------ |
| GET    | `/users/:publicId`   | No   | Get user profile            | Public endpoint    |
| PATCH  | `/users/me`          | Yes  | Update profile              | Owner only         |
| GET    | `/users/me/projects` | Yes  | Get current user's projects | Authenticated user |
| GET    | `/users`             | No   | Search users                | Paginated response |

## Connections

| Method | Endpoint | Auth | Description | Notes |
| ------ | -------- | ---- | ----------- | ----- |
| POST | `/connections/:publicId` | Yes | Send connection request | Authenticated user |
| GET | `/connections/incoming` | Yes | List incoming requests | Authenticated user |
| GET | `/connections/outgoing` | Yes | List outgoing requests | Authenticated user |
| GET | `/connections` | Yes | List accepted connections | Authenticated user |
| PATCH | `/connections/:publicId/accept` | Yes | Accept connection request | Recipient only |
| PATCH | `/connections/:publicId/reject` | Yes | Reject connection request | Recipient only |
| PATCH | `/connections/:publicId/cancel` | Yes | Cancel sent request | Sender only |
| DELETE | `/connections/:publicId` | Yes | Remove connection | Either connected user |

## Projects

| Method | Endpoint                                           | Auth | Description                | Notes                                                           |
| ------ | -------------------------------------------------- | ---- | -------------------------- | --------------------------------------------------------------- |
| POST   | `/projects`                                        | Yes  | Create project             | Authenticated user                                              |
| GET    | `/projects`                                        | No   | List projects              | Supports pagination, search, status, visibility and tag filters |
| GET    | `/projects/:publicId`                              | No   | Get project                | Public endpoint                                                 |
| PATCH  | `/projects/:publicId`                              | Yes  | Update project             | Owner only                                                      |
| DELETE | `/projects/:publicId`                              | Yes  | Delete project             | Owner only                                                      |
| GET    | `/projects/:publicId/members`                      | No   | List project members       | Public project only                                             |
| DELETE | `/projects/:projectPublicId/members/:userPublicId` | Yes  | Remove member from project | Owner only                                                      |

## Collaboration

| Method | Endpoint                       | Auth | Description                    | Notes                           |
| ------ | ------------------------------ | ---- | ------------------------------ | ------------------------------- |
| POST   | `/projects/:publicId/requests` | Yes  | Send collaboration request     | Authenticated user              |
| GET    | `/projects/:publicId/requests` | Yes  | List collaboration requests    | Project owner only              |
| GET    | `/users/me/requests`           | Yes  | List my collaboration requests | Authenticated user              |
| PATCH  | `/requests/:publicId/accept`   | Yes  | Accept request                 | Project owner only              |
| PATCH  | `/requests/:publicId/reject`   | Yes  | Reject request                 | Project owner only              |
| DELETE | `/requests/:publicId`          | Yes  | Cancel or remove request       | Request sender or project owner |

## Conversations

| Method | Endpoint                   | Auth | Description         | Notes                     |
| ------ | -------------------------- | ---- | ------------------- | ------------------------- |
| GET    | `/conversations`           | Yes  | List conversations  | Returns paginated results |
| POST   | `/conversations`           | Yes  | Create conversation | Project members only      |
| GET    | `/conversations/:publicId` | Yes  | Get conversation    | Project members only      |

## Messages

| Method | Endpoint                            | Auth | Description   | Notes                     |
| ------ | ----------------------------------- | ---- | ------------- | ------------------------- |
| GET    | `/conversations/:publicId/messages` | Yes  | List messages | Returns paginated results |
| POST   | `/conversations/:publicId/messages` | Yes  | Send message  | Project members only      |

## Reviews

| Method | Endpoint                   | Auth | Description      | Notes              |
| ------ | -------------------------- | ---- | ---------------- | ------------------ |
| POST   | `/reviews`                 | Yes  | Create review    | Collaborators only |
| GET    | `/users/:publicId/reviews` | No   | Get user reviews | Public endpoint    |

## Notifications

| Method | Endpoint                        | Auth | Description                    | Notes                     |
| ------ | ------------------------------- | ---- | ------------------------------ | ------------------------- |
| GET    | `/notifications`                | Yes  | List notifications             | Returns paginated results |
| PATCH  | `/notifications/:publicId/read` | Yes  | Mark notification as read      | Authenticated user        |
| PATCH  | `/notifications/read-all`       | Yes  | Mark all notifications as read | Authenticated user        |

## Sessions

| Method | Endpoint              | Auth | Description             | Notes                      |
| ------ | --------------------- | ---- | ----------------------- | -------------------------- |
| GET    | `/sessions`           | Yes  | List active sessions    | Current authenticated user |
| DELETE | `/sessions/:publicId` | Yes  | Remove a device session | Current authenticated user |
| DELETE | `/sessions/current`   | Yes  | Logout current device   | Current authenticated user |
| DELETE | `/sessions`           | Yes  | Logout all devices      | Current authenticated user |

---

# 5. Authorization

| Resource/Action         | Access             |
| ----------------------- | ------------------ |
| Public Profiles         | Public             |
| User Profile Update     | Owner              |
| Send Connection Request   | Authenticated User |
| Manage Connection Request | Request Participants |
| Remove Connection         | Connected Users |
| Project Update          | Owner              |
| Project Delete          | Owner              |
| Collaboration Request   | Authenticated User |
| Sessions                | Authenticated User |
| Accept / Reject Request | Project Owner      |
| Messaging               | Project Members    |
| Reviews                 | Collaborators      |

---

# 6. Standard Query Parameters

- `page`: Page number for paginated results
- `limit`: Number of results per page
- `sort`: Sort order (e.g., `createdAt:desc`, `title:asc`, `rating:desc`)
- `search`: Search string (where applicable)
- `fields`: Comma-separated fields to include in the response (where supported)

### Common Resource Filters

**Users**

- username
- skills
- availability
- experienceLevel

**Projects**

- status
- visibility
- tags
- owner
- requiredSkills

---

# 7. Authentication Flow

```text
Client
   │
   ▼
Login
   │
   ▼
Access Token + Refresh Cookie
   │
   ▼
Authenticated Requests
   │
   ▼
Access Token Expires
   │
   ▼
POST /auth/refresh (refresh cookie sent automatically)
   │
   ▼
New Access Token
```

---

# 8. HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Resource created      |
| 204  | No Content            |
| 400  | Invalid request       |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Resource not found    |
| 409  | Conflict              |
| 422  | Validation failed     |
| 500  | Internal server error |

### Standard Error Types

- VALIDATION_ERROR
- UNAUTHORIZED
- FORBIDDEN
- NOT_FOUND
- CONFLICT
- INTERNAL_SERVER_ERROR

---

# 9. Versioning

- **Base URL:** `/api/v1`
- Breaking API changes will be introduced through versioned endpoints (e.g., `/api/v2`).

---

# 10. API Naming Conventions

- Use lowercase letters and hyphens to separate words in endpoint paths (e.g., `/user-profiles`).
- Use plural nouns for resource names (e.g., `/users`, `/projects`).
- Use HTTP methods to represent actions (e.g., `GET` for retrieval, `POST` for creation).
- Use nested routes to represent resource relationships (e.g., `/projects/:publicId/members`).

---

# 11. API Design Principles

- RESTful endpoints
- JSON request/response
- Consistent error format
- JWT authentication
- HTTP status codes
- Resource-based URLs
