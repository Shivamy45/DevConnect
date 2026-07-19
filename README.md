# DevConnect

> A platform where developers discover projects, find collaborators, and build real-world software together.

## Demo

- Live Demo: Coming Soon
- API: Coming Soon

---

## Overview

DevConnect is a developer collaboration platform where developers can discover projects, build professional connections, find collaborators, communicate with teammates, and gain real-world development experience. It combines developer networking with project-based collaboration in a single platform.

---

## Architecture

```text
React (Vite)
      │
      ▼
Express.js REST API
      │
      ▼
MongoDB
```

---

## Features

- User authentication
- Developer profiles
- Developer connections
- Project creation and discovery
- Collaboration requests
- Project member management
- Direct messaging
- Reviews and reputation
- Notifications
- Search and filtering

---

## Tech Stack

| Layer          | Technology                |
| -------------- | ------------------------- |
| Frontend       | React, Vite, Tailwind CSS |
| Backend        | Node.js, Express.js       |
| Database       | MongoDB, Mongoose         |
| Authentication | JWT, HTTP-only Cookies    |
| API Style      | REST                      |

---

## Project Structure

```text
client/     # React frontend
server/     # Express backend
docs/       # Project documentation
```

---

## Documentation

| Document                     | Purpose                                       |
| ---------------------------- | --------------------------------------------- |
| `01_PRODUCT.md`              | Product vision, scope, and features           |
| `02_API_SPECIFICATION.md`    | REST API reference                            |
| `03_DATABASE_DESIGN.md`      | Database schema and relationships             |
| `DEV_PROJECT_MASTER_PLAN.md` | Development roadmap and implementation phases |

---

## Getting Started

```bash
git clone <repository-url>
cd DevConnect

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

Then:

1. Configure the required environment variables.
2. Start the backend server.
3. Start the frontend development server.

### Environment Variables

Create a `.env` file inside the `server` directory and configure:

- MONGODB_URI
- JWT_SECRET
- JWT_REFRESH_SECRET
- CLIENT_URL

---

## Status

🚧 Under active development.

Current focus:

- Backend APIs
- Database implementation
- Frontend integration

---

## Roadmap

### MVP

- Authentication
- Developer profiles
- Developer connections
- Project management
- Collaboration requests
- Project member management
- Messaging
- Reviews
- Notifications
- Search and filtering

### Future

- Real-time messaging
- GitHub integration
- Team workspaces
- AI-powered recommendations

---

## Project Status

This project is currently in MVP development following a backend-first approach. Product requirements, API specifications, and database design are defined before implementation to ensure consistent architecture and production-quality engineering.

---

## License

MIT License.
