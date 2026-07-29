# DevConnect Progress

Last Updated: 2026-07-30

---

## Current Stage

### Project
DevConnect Backend

## Purpose

This file is the single source of truth for the current state of the DevConnect project.

At the start of every new ChatGPT conversation:
1. Upload this file.
2. Ask ChatGPT to read it before continuing.

At the end of every conversation:
1. Update this file with completed work.
2. Record any new architectural decisions.
3. Update the "Next Tasks" section.

### Current Feature
Authentication Stabilization & API Testing

### Current Status
- Authentication flow manually tested.
- Avatar upload endpoint implemented and tested.
- Global error handling updated to correctly return validation errors for avatar uploads.
- Refresh token endpoint tested (refresh token persistence still pending).
- Logout endpoint not yet implemented.
- Ready to implement refresh token persistence and logout.

---

## Progress

### Completed

#### Authentication
- Signup
- Login
- JWT Access Tokens
- JWT Refresh Tokens
- Secure Cookie Authentication
- Authentication Middleware

#### User Module
- User Profile APIs
- Avatar Upload
- Avatar Reset
- Cloudinary Integration
- Default Avatar Generation

#### Core Architecture
- Controller → Service architecture
- Global ApiError class
- Global Error Middleware
- Express 5 async error handling

#### Models
- User
- Skill
- Project

#### Validation
- Reusable Zod validation schemas
- Public ID validation helper
- ObjectId validation helper

---

## Architecture Decisions

### Express
- Using Express 5.
- No asyncHandler wrappers.
- Allow rejected promises to automatically reach the global error middleware.

### Error Handling
- Services throw new ApiError for expected/business errors.
- Unexpected framework/database errors bubble to the global middleware.
- Controllers remain thin and only return successful responses.
- One consistent JSON error response format across the API.

### File Upload Validation
- Multer file validation errors are converted into `ApiError` instances.
- Validation errors return appropriate 4xx responses instead of falling back to 500 Internal Server Error.

### User IDs
- Public IDs are exposed through APIs.
- MongoDB ObjectIds are used internally for relationships.

### Database Design
- High-growth data is stored in separate collections instead of embedding.

### Avatar Storage
- Stored as:
  ```js
  {
    publicId,
    url
  }
  ```
- Cloudinary folder: `avatars/<userPublicId>`.
- Existing avatar overwritten on update.

### Project Vision
- Developers can learn, mentor, collaborate and build projects together.
- Projects are collaboration hubs.
- Chat history remains available to new members (future filtering by joinedAt if required).

---

## Next Tasks

1. Persist refresh tokens in the User model.
2. Implement logout endpoint.
3. Implement refresh token rotation.
4. Re-test authentication flow.
5. Implement ProjectMember model.
6. Implement ProjectInvite model.

---

## Recently Learned

- Refresh token testing strategy.
- API endpoint testing methodology.
- Multer error propagation.
- Converting Multer validation errors into ApiError.
- Importance of distinguishing client validation errors from server errors.

---

## Session Notes

- Completed manual testing for registration, login, profile retrieval, refresh token, and avatar upload endpoints.
- Verified authentication and avatar upload edge cases.
- Identified that refresh token persistence is required before logout and token revocation can be fully implemented.
- Updated file upload validation to return proper client error responses.
- Next focus: refresh token persistence, logout, and token rotation.
