# DevConnect Database Design

> Version: 1.0
>
> Status: Draft
>
> Last Updated: July 2026

---

# 1. Overview

DevConnect uses MongoDB as its primary database. Data is organized into collections that support developer networking, project collaboration, communication, reviews, notifications, and authentication. Relationships are maintained using document references.

---

# 2. Collections

| Collection             | Purpose                          |
| ---------------------- | -------------------------------- |
| Users                  | Store user accounts and profiles |
| Connections            | Store developer connection requests and accepted connections |
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
 ├── Connections
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

### Connections

| Field     | Type     | Notes            |
| --------- | -------- | ---------------- |
| publicId  | String   | Unique, Required |
| sender    | ObjectId | Ref(User), Required |
| receiver  | ObjectId | Ref(User), Required |
| status    | String   | Enum, Required |
| createdAt | Date     | Auto |
| updatedAt | Date     | Auto |

### Sessions

| Field              | Type     | Notes            |
| ------------------ | -------- | ---------------- |
| publicId           | String   | Unique, Required |
| user               | ObjectId | Ref, Required    |
| hashedRefreshToken | String   | Hashed, Required |
| device             | String   | Optional         |
| ipAddress          | String   | Optional         |
| userAgent          | String   | Optional         |
| expiresAt          | Date     | Required         |
| lastUsedAt         | Date     | Auto             |
| revokedAt          | Date     | Optional         |
| createdAt          | Date     | Auto             |
| updatedAt          | Date     | Auto             |

### Skills

| Field    | Type   | Notes    |
| -------- | ------ | -------- |
| name     | String | Required |
| category | String | Optional |

### Projects

| Field          | Type       | Notes            |
| -------------- | ---------- | ---------------- |
| publicId       | String     | Unique, Required |
| owner          | ObjectId   | Ref, Required    |
| title          | String     | Required         |
| description    | String     | Required         |
| requiredSkills | ObjectId[] | Ref[], Optional  |
| maxMembers     | Number     | Required         |
| visibility     | String     | Enum, Required   |
| tags           | String[]   | Optional         |
| status         | String     | Enum, Required   |
| createdAt      | Date       | Auto             |
| updatedAt      | Date       | Auto             |

### Collaboration Requests

| Field    | Type     | Notes            |
| -------- | -------- | ---------------- |
| publicId | String   | Unique, Required |
| sender   | ObjectId | Ref, Required    |
| project  | ObjectId | Ref, Required    |
| status   | String   | Enum, Required   |

### Collaborations

| Field   | Type     | Notes          |
| ------- | -------- | -------------- |
| project | ObjectId | Ref, Required  |
| user    | ObjectId | Ref, Required  |
| role    | String   | Enum, Required |

### Conversations

| Field        | Type                | Notes            |
| ------------ | ------------------- | ---------------- |
| publicId     | String              | Unique, Required |
| participants | ObjectId[]          | Ref[], Required  |
| project      | ObjectId (optional) | Ref, Optional    |

### Messages

| Field        | Type     | Notes         |
| ------------ | -------- | ------------- |
| conversation | ObjectId | Ref, Required |
| sender       | ObjectId | Ref, Required |
| content      | String   | Required      |
| createdAt    | Date     | Auto          |

### Reviews

| Field     | Type     | Notes         |
| --------- | -------- | ------------- |
| reviewer  | ObjectId | Ref, Required |
| reviewee  | ObjectId | Ref, Required |
| project   | ObjectId | Ref, Required |
| rating    | Number   | Required      |
| comment   | String   | Optional      |
| createdAt | Date     | Auto          |

### Notifications

| Field     | Type     | Notes            |
| --------- | -------- | ---------------- |
| publicId  | String   | Unique, Required |
| recipient | ObjectId | Ref, Required    |
| actor     | ObjectId | Ref, Optional    |
| type      | String   | Enum, Required   |
| title     | String   | Required         |
| message   | String   | Required         |
| link      | String   | Optional         |
| isRead    | Boolean  | Default: false   |
| createdAt | Date     | Auto             |

---

# 5. Indexes

| Collection             | Indexed Fields                                  |
| ---------------------- | ----------------------------------------------- |
| Users                  | username, email, publicId                       |
| Connections           | sender + receiver (compound unique), status     |
| Skills                 | name                                            |
| Projects               | owner, status, title (text), description (text) |
| Collaboration Requests | project, sender (unique while pending), status  |
| Collaborations         | project + user (unique), user                   |
| Conversations          | participants                                    |
| Notifications          | recipient, isRead, createdAt                    |
| Sessions               | user, expiresAt                                 |
| Reviews                | reviewer + reviewee + project (unique)          |

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

- Every collection uses MongoDB ObjectIds internally for relationships.
- User-facing resources expose nanoid-generated publicIds instead of MongoDB ObjectIds.
- References are preferred over deeply nested documents.
- Automatic timestamps are enabled on all major collections.
- Indexes are added for commonly queried fields.
- Compound unique indexes are used where duplicate relationships must be prevented.
- Refresh tokens are stored as hashed values in the Sessions collection to support multiple active devices.

---

# 8. Enumerations

- **Connection.status**: Pending, Accepted, Rejected, Cancelled
- **Project.status**: Draft, Open, In Progress, Completed, Archived
- **Project.visibility**: Public, Private
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
 ├────< Connections
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

The database is organized around developer networking, project collaboration, and communication. Collections remain loosely coupled through references, expose public identifiers for external APIs, and use indexes for efficient lookups. The schema supports both one-to-one developer connections and one-to-many project collaboration while remaining extensible for future features.
