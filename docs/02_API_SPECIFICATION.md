# DevConnect API Specification

> Version: 1.0
>
> Status: Draft
>
> Last Updated: July 2026

---

# 1. Overview

The DevConnect backend exposes a REST API that enables user authentication, profile management, project collaboration, messaging, reviews, and notifications. All endpoints exchange JSON data over HTTPS.

---

# 2. API Conventions

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
| Projects       | Create, update, search and manage projects |
| Collaboration  | Collaboration requests and members         |
| Conversations  | Create and fetch conversations             |
| Messages       | Send and receive messages                  |
| Reviews        | Submit and view reviews                    |
| Notifications  | User notifications                         |

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

| Method | Endpoint     | Auth | Description      | Notes              |
| ------ | ------------ | ---- | ---------------- | ------------------ |
| GET    | `/users/:id` | No   | Get user profile | Public endpoint    |
| PATCH  | `/users/:id` | Yes  | Update profile   | Owner only         |
| GET    | `/users`     | No   | Search users     | Paginated response |

## Projects

| Method | Endpoint                        | Auth | Description                | Notes                     |
| ------ | ------------------------------- | ---- | -------------------------- | ------------------------- |
| POST   | `/projects`                     | Yes  | Create project             | Authenticated user        |
| GET    | `/projects`                     | No   | List projects              | Returns paginated results |
| GET    | `/projects/:id`                 | No   | Get project                | Public endpoint           |
| PATCH  | `/projects/:id`                 | Yes  | Update project             | Owner only                |
| DELETE | `/projects/:id`                 | Yes  | Delete project             | Owner only                |
| GET    | `/projects/:id/members`         | No   | List project members       | Public project only       |
| DELETE | `/projects/:id/members/:userId` | Yes  | Remove member from project | Owner only                |

## Collaboration Requests & Members

| Method | Endpoint                 | Auth | Description                | Notes                           |
| ------ | ------------------------ | ---- | -------------------------- | ------------------------------- |
| POST   | `/projects/:id/requests` | Yes  | Send collaboration request | Authenticated user              |
| PATCH  | `/requests/:id/accept`   | Yes  | Accept request             | Project owner only              |
| PATCH  | `/requests/:id/reject`   | Yes  | Reject request             | Project owner only              |
| DELETE | `/requests/:id`          | Yes  | Cancel or remove request   | Request sender or project owner |

## Conversations

| Method | Endpoint             | Auth | Description         | Notes                     |
| ------ | -------------------- | ---- | ------------------- | ------------------------- |
| GET    | `/conversations`     | Yes  | List conversations  | Returns paginated results |
| POST   | `/conversations`     | Yes  | Create conversation | Project members only      |
| GET    | `/conversations/:id` | Yes  | Get conversation    | Project members only      |

## Messages

| Method | Endpoint                      | Auth | Description   | Notes                     |
| ------ | ----------------------------- | ---- | ------------- | ------------------------- |
| GET    | `/conversations/:id/messages` | Yes  | List messages | Returns paginated results |
| POST   | `/conversations/:id/messages` | Yes  | Send message  | Project members only      |

## Reviews

| Method | Endpoint             | Auth | Description      | Notes              |
| ------ | -------------------- | ---- | ---------------- | ------------------ |
| POST   | `/reviews`           | Yes  | Create review    | Collaborators only |
| GET    | `/users/:id/reviews` | No   | Get user reviews | Public endpoint    |

## Notifications

| Method | Endpoint                  | Auth | Description                    | Notes                     |
| ------ | ------------------------- | ---- | ------------------------------ | ------------------------- |
| GET    | `/notifications`          | Yes  | List notifications             | Returns paginated results |
| PATCH  | `/notifications/:id/read` | Yes  | Mark notification as read      | Authenticated user        |
| PATCH  | `/notifications/read-all` | Yes  | Mark all notifications as read | Authenticated user        |

## Sessions

| Method | Endpoint            | Auth | Description             | Notes                      |
| ------ | ------------------- | ---- | ----------------------- | -------------------------- |
| GET    | `/sessions`         | Yes  | List active sessions    | Current authenticated user |
| DELETE | `/sessions/:id`     | Yes  | Remove a device session | Current authenticated user |
| DELETE | `/sessions/current` | Yes  | Logout current device   | Current authenticated user |
| DELETE | `/sessions`         | Yes  | Logout all devices      | Current authenticated user |

---

# 5. Authorization

| Resource/Action         | Access             |
| ----------------------- | ------------------ |
| Public Profiles         | Public             |
| User Profile Update     | Owner              |
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
- `fields` : username

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

---

# 9. Versioning

- **Base URL:** `/api/v1`
- Breaking API changes will be introduced through versioned endpoints (e.g., `/api/v2`).

---

# 10. API Naming Conventions

- Use lowercase letters and hyphens to separate words in endpoint paths (e.g., `/user-profiles`).
- Use plural nouns for resource names (e.g., `/users`, `/projects`).
- Use HTTP methods to represent actions (e.g., `GET` for retrieval, `POST` for creation).
- Use nested routes to represent resource relationships (e.g., `/projects/:id/members`).

---

# 11. API Design Principles

- RESTful endpoints
- JSON request/response
- Consistent error format
- JWT authentication
- HTTP status codes
- Resource-based URLs
