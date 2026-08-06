# DevConnect Database Design

> Version: 1.1
>
> Status: Draft
>
> Last Updated: August 2026

---

# 1. Overview

DevConnect uses MongoDB as its primary database. Data is organized into collections that support developer networking, project collaboration, communication, reviews, notifications, and authentication. Relationships are maintained using document references.

---

# 2. Collections

| Collection             | Purpose                                                      |
| ---------------------- | ------------------------------------------------------------ |
| Users                  | Store user accounts and profiles                             |
| Connections            | Store developer connection requests and accepted connections |
| Skills                 | List available skills                                        |
| Projects               | Store project information and team members                   |
| Collaboration Requests | Manage project join requests and invitations                 |
| Conversations          | Chat conversations                                           |
| Messages               | Conversation messages                                        |
| Reviews                | Collaboration feedback                                       |
| Notifications          | User notifications                                           |
| Sessions               | Manage user sessions                                         |

---

# 3. Collection Relationships

```text
User
 │
 ├── Sessions
 ├── Connections
 ├── Projects
 ├── Collaboration Requests
 ├── Conversations
 ├── Reviews
 └── Notifications

Project
 │
 ├── Required Skills
 ├── Members
 ├── Collaboration Requests
 └── Conversation

Conversation
 └── Messages
```

---

# 4. Collection Schemas

### Users

| Field           | Type                                    | Notes                |
| --------------- | --------------------------------------- | -------------------- |
| publicId        | String                                  | Unique, Required     |
| username        | String                                  | Unique, Required     |
| email           | String                                  | Unique, Required     |
| password        | String                                  | Hashed, Required     |
| bio             | String                                  | Optional             |
| githubUrl       | String                                  | Optional             |
| experienceLevel | String                                  | Enum, Required       |
| skills          | Array<{ skill: ObjectId, level: Enum }> | Ref(Skill), Optional |
| wantToLearn     | Array<{ skill: ObjectId, level: Enum }> | Ref(Skill), Optional |
| createdAt       | Date                                    | Auto                 |
| updatedAt       | Date                                    | Auto                 |

### Connections

| Field     | Type     | Notes               |
| --------- | -------- | ------------------- |
| publicId  | String   | Unique, Required    |
| sender    | ObjectId | Ref(User), Required |
| receiver  | ObjectId | Ref(User), Required |
| status    | String   | Enum, Required      |
| createdAt | Date     | Auto                |
| updatedAt | Date     | Auto                |

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

| Field    | Type   | Notes            |
| -------- | ------ | ---------------- |
| publicId | String | Unique, Required |
| name     | String | Required         |
| category | String | Optional         |
| icon     | String | Optional         |

### Projects

| Field          | Type                                        | Notes                                                              |
| -------------- | ------------------------------------------- | ------------------------------------------------------------------ | --- |
| publicId       | String                                      | Unique, Required                                                   |
| owner          | ObjectId                                    | Ref(User), Required                                                |     |
| title          | String                                      | Required                                                           |
| description    | String                                      | Required                                                           |
| requiredSkills | ObjectId[]                                  | Array of Ref(Skill), Optional                                      |
| maxMembers     | Number                                      | Required                                                           |
| members        | Array<{ userId: ObjectId, joinedAt: Date }> | Array of Ref(User); owner is stored separately                     |
| visibility     | String                                      | Enum, Required                                                     |
| tags           | String[]                                    | Optional                                                           |
| status         | String                                      | Enum: OPEN, IN_PROGRESS, COMPLETED; auto-managed except completion |
| createdAt      | Date                                        | Auto                                                               |
| updatedAt      | Date                                        | Auto                                                               |

### Collaboration Requests

| Field      | Type     | Notes                                        |
| ---------- | -------- | -------------------------------------------- |
| publicId   | String   | Unique, Required                             |
| projectId  | ObjectId | Ref(Project), Required                       |
| senderId   | ObjectId | Ref(User), Required                          |
| receiverId | ObjectId | Ref(User), Required                          |
| type       | String   | Enum: APPLICATION, INVITATION                |
| status     | String   | Enum: PENDING, ACCEPTED, REJECTED, CANCELLED |
| message    | String   | Optional, max 500 characters                 |
| createdAt  | Date     | Auto                                         |
| updatedAt  | Date     | Auto                                         |

### Conversations

| Field        | Type       | Notes                  |
| ------------ | ---------- | ---------------------- |
| publicId     | String     | Unique, Required       |
| participants | ObjectId[] | Ref[], Required        |
| project      | ObjectId   | Ref(Project), Optional |

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

| Collection             | Indexed Fields                                          |
| ---------------------- | ------------------------------------------------------- |
| Users                  | username, email, publicId                               |
| Connections            | sender + receiver (compound unique), status             |
| Skills                 | publicId, name                                          |
| Projects               | owner, status, title (text), description (text)         |
| Collaboration Requests | projectId, senderId, receiverId, type, status, publicId |
| Conversations          | participants                                            |
| Notifications          | recipient, isRead, createdAt                            |
| Sessions               | user, expiresAt                                         |
| Reviews                | reviewer + reviewee + project (unique)                  |

---

# 6. Search Strategy

| Collection | Search Fields      |
| ---------- | ------------------ |
| Users      | username, bio      |
| Projects   | title, description |
| Skills     | name               |

Developer and project searches use structured POST request bodies. Skill publicIds are resolved to MongoDB ObjectIds in the service layer before querying.

---

# 7. Design Principles

- Every collection uses MongoDB ObjectIds internally for relationships.
- User-facing resources expose nanoid-generated publicIds instead of MongoDB ObjectIds.
- Skills are referenced internally by MongoDB ObjectIds while clients use Skill publicIds.
- Service layers resolve publicIds before querying or persisting related documents.
- References are preferred over deeply nested documents.
- Automatic timestamps are enabled on all major collections.
- Indexes are added for commonly queried fields.
- Compound unique indexes are used where duplicate relationships must be prevented.
- Refresh tokens are stored as hashed values in the Sessions collection to support multiple active devices.

---

# 8. Enumerations

- **Connection.status**: Pending, Accepted, Rejected, Cancelled
- **Project.status**: OPEN, IN_PROGRESS, COMPLETED
    - OPEN: accepting collaboration requests and invitations
    - IN_PROGRESS: team is full; no new collaboration requests or invitations
    - COMPLETED: finished; no team management allowed
- **Project.visibility**: Public, Private
- **CollaborationRequest.type**: APPLICATION, INVITATION
- **CollaborationRequest.status**: PENDING, ACCEPTED, REJECTED, CANCELLED
- **Notification.type**: CollaborationRequest, RequestAccepted, RequestRejected, Message, Review
- **ExperienceLevel**: Beginner, Intermediate, Advanced
- **Skill.level**: Beginner, Intermediate, Advanced

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
 │          ├── members[]
 │          ├────< Collaboration Requests
 │          └──── Conversation ────< Messages
 │
 ├────< Reviews
 └────< Notifications
```

---

# 10. Summary

The database is organized around developer networking, project collaboration, and communication. Collections remain loosely coupled through references, expose public identifiers for external APIs, and use indexes for efficient lookups. The schema supports both one-to-one developer connections and one-to-many project collaboration while remaining extensible for future features.
