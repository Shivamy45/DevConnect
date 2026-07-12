# DevConnect Database Design

> Version: 1.0
>
> Status: Draft
>
> Last Updated: July 2026

---

# 1. Overview

DevConnect uses MongoDB as its primary database. Data is organized into collections that represent users, projects, collaborations, conversations, and other core resources. Relationships are maintained using document references.

---

# 2. Collections

| Collection             | Purpose                          |
| ---------------------- | -------------------------------- |
| Users                  | Store user accounts and profiles |
| Skills                 | List available skills            |
| Projects               | Store project information        |
| Collaboration Requests | Manage project join requests     |
| Collaborations         | Track accepted collaborators     |
| Conversations          | Chat conversations               |
| Messages               | Conversation messages            |
| Reviews                | Collaboration feedback           |
| Notifications          | User notifications               |
| Sessions               | Manage user sessions             |

---

# 3. Collection Relationships

```text
User
 │
 ├── Sessions
 ├── Projects
 ├── Collaboration Requests
 ├── Collaborations
 ├── Conversations
 ├── Reviews
 └── Notifications

Project
 │
 ├── Required Skills
 ├── Collaboration Requests
 ├── Collaborations
 └── Conversation

Conversation
 └── Messages
```

---

# 4. Collection Schemas

### Users

| Field           | Type       | Notes            |
| --------------- | ---------- | ---------------- |
| publicId        | String     | Unique, Required |
| username        | String     | Unique, Required |
| email           | String     | Unique, Required |
| password        | String     | Hashed, Required |
| bio             | String     | Optional         |
| githubUrl       | String     | Optional         |
| experienceLevel | String     | Enum, Required   |
| availability    | String     | Enum, Required   |
| skills          | ObjectId[] | Ref[], Optional  |
| createdAt       | Date       | Auto             |
| updatedAt       | Date       | Auto             |

### Sessions

| Field                | Type     | Notes            |
| -------------------- | -------- | ---------------- |
| user                 | ObjectId | Ref, Required    |
| Hashed Refresh Token | String   | Hashed, Required |
| device               | String   | Optional         |
| ipAddress            | String   | Optional         |
| userAgent            | String   | Optional         |
| expiresAt            | Date     | Required         |
| createdAt            | Date     | Auto             |
| updatedAt            | Date     | Auto             |

### Skills

| Field    | Type   | Notes    |
| -------- | ------ | -------- |
| name     | String | Required |
| category | String | Optional |

### Projects

| Field          | Type       | Notes           |
| -------------- | ---------- | --------------- |
| owner          | ObjectId   | Ref, Required   |
| title          | String     | Required        |
| description    | String     | Required        |
| requiredSkills | ObjectId[] | Ref[], Optional |
| status         | String     | Enum, Required  |

### Collaboration Requests

| Field   | Type     | Notes          |
| ------- | -------- | -------------- |
| sender  | ObjectId | Ref, Required  |
| project | ObjectId | Ref, Required  |
| status  | String   | Enum, Required |

### Collaborations

| Field   | Type     | Notes          |
| ------- | -------- | -------------- |
| project | ObjectId | Ref, Required  |
| user    | ObjectId | Ref, Required  |
| role    | String   | Enum, Required |

### Conversations

| Field        | Type                | Notes           |
| ------------ | ------------------- | --------------- |
| participants | ObjectId[]          | Ref[], Required |
| project      | ObjectId (optional) | Ref, Optional   |

### Messages

| Field        | Type     | Notes         |
| ------------ | -------- | ------------- |
| conversation | ObjectId | Ref, Required |
| sender       | ObjectId | Ref, Required |
| content      | String   | Required      |

### Reviews

| Field    | Type     | Notes         |
| -------- | -------- | ------------- |
| reviewer | ObjectId | Ref, Required |
| reviewee | ObjectId | Ref, Required |
| rating   | Number   | Required      |

### Notifications

| Field     | Type     | Notes          |
| --------- | -------- | -------------- |
| recipient | ObjectId | Ref, Required  |
| type      | String   | Enum, Required |
| isRead    | Boolean  | Required       |

---

# 5. Indexes

| Collection             | Indexed Fields                                  |
| ---------------------- | ----------------------------------------------- |
| Users                  | username, email, publicId                       |
| Skills                 | name                                            |
| Projects               | owner, status, title (text), description (text) |
| Collaboration Requests | project, sender, status                         |
| Conversations          | participants                                    |
| Notifications          | recipient, isRead                               |
| Sessions               | user, expiresAt                                 |

---

# 6. Search Strategy

| Collection | Search Fields      |
| ---------- | ------------------ |
| Users      | username, bio      |
| Projects   | title, description |
| Skills     | name               |

Text indexes are used for project titles and descriptions to support keyword search.

---

# 7. Design Principles

- Every collection uses MongoDB ObjectIds.
- Public identifiers are exposed instead of internal IDs where appropriate.
- References are preferred over deeply nested documents.
- Automatic timestamps are enabled on all major collections.
- Indexes are added for commonly queried fields.
- Refresh tokens are stored as hashed values in the Sessions collection to support multiple active devices.

---

# 8. Enumerations

- **Project.status**: Draft, Open, In Progress, Completed, Archived
- **CollaborationRequest.status**: Pending, Accepted, Rejected, Withdrawn
- **Collaboration.role**: Owner, Maintainer, Contributor
- **Notification.type**: CollaborationRequest, RequestAccepted, RequestRejected, Message, Review
- **ExperienceLevel**: Beginner, Intermediate, Advanced
- **Availability**: Available, Busy, Not Looking

---

# 9. ER Diagram

```text
Users
 │
 ├── Sessions
 │
 ├────< Projects
 │          │
 │          ├────< Collaboration Requests
 │          ├────< Collaborations
 │          └──── Conversation ────< Messages
 │
 ├────< Reviews
 └────< Notifications
```

---

# 10. Summary

The database is designed around a small set of collections with clear relationships and efficient indexing. The structure supports authentication, project collaboration, messaging, reviews, and future feature expansion while keeping the schema simple and maintainable. Session management supports multiple concurrent device logins.
