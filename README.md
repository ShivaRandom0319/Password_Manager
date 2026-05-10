# Secure Password Vault - Full Stack Application

Full-stack secure password vault using Spring Boot, H2, JWT authentication, BCrypt password hashing, AES-GCM encryption, and Angular.

## Features

- User registration and login with JWT authentication.
- BCrypt hashing for account passwords.
- AES-GCM encryption for saved vault passwords.
- User-specific password records.
- Add, view, edit, delete, and search password records by name.
- Angular protected routes, JWT interceptor, and logout.
- Responsive UI built with HTML, CSS, and TypeScript/JavaScript.

## Tech Stack

- Backend: Spring Boot, Spring Security, Spring Data JPA
- Frontend: Angular, HTML, CSS, TypeScript/JavaScript
- Database: H2 Database
- Security: JWT, BCrypt, AES-GCM
- Build tools: Maven, npm

## Requirements

- Java 17 or newer
- Maven
- Node.js and npm

## Default Ports

```text
Backend:  http://localhost:8080
Frontend: http://localhost:4200
H2:       http://localhost:8080/h2-console
```

## Run Backend

From the project root:

```powershell
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

H2 console:

```text
http://localhost:8080/h2-console
```

H2 login values:

```text
JDBC URL: jdbc:h2:mem:password_vault
Username: sa
Password:
```

The `password_records` table stores `encrypted_password`. The API request/response uses `password`, and the backend encrypts/decrypts it in the service layer for the logged-in user only.

## Run Frontend

From the project root:

```powershell
cd frontend
npm install
npm start
```

Frontend URL:

```text
http://localhost:4200
```

Build frontend:

```powershell
npm run build
```

## Test Credentials Format

Use any valid email and a password matching this policy:

```text
minimum 8 characters, one uppercase, one lowercase, one number, one special character
```

Example:

```text
Name: Shiva
Email: shiva@example.com
Password: Password@123
```

## API Samples

Register:

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Shiva",
  "email": "shiva@example.com",
  "password": "Password@123",
  "confirmPassword": "Password@123"
}
```

Register response:

```json
{
  "token": "JWT_TOKEN_HERE",
  "username": "shiva@example.com"
}
```

Login:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "shiva@example.com",
  "password": "Password@123"
}
```

Login response:

```json
{
  "token": "JWT_TOKEN_HERE",
  "username": "shiva@example.com"
}
```

Use the JWT on protected requests:

```text
Authorization: Bearer JWT_TOKEN_HERE
```

Create password record:

```http
POST /api/passwords
Authorization: Bearer JWT_TOKEN_HERE
Content-Type: application/json

{
  "name": "Gmail",
  "username": "shiva@gmail.com",
  "password": "GmailPassword@123"
}
```

Password record response:

```json
{
  "id": 1,
  "name": "Gmail",
  "username": "shiva@gmail.com",
  "password": "GmailPassword@123"
}
```

Other password APIs:

```http
GET /api/passwords
GET /api/passwords/1
PUT /api/passwords/1
DELETE /api/passwords/1
GET /api/passwords/search?name=gmail
```

Update body:

```json
{
  "name": "Gmail Updated",
  "username": "new-user@gmail.com",
  "password": "NewPassword@123"
}
```

Delete response:

```json
{
  "message": "Password record deleted successfully"
}
```

Logout:

```http
POST /api/auth/logout
Authorization: Bearer JWT_TOKEN_HERE
```

Logout response:

```json
{
  "message": "Logout successful. Please remove the JWT token on the frontend."
}
```

## Final Checklist

- Registration works with name, email, password, and confirm password.
- Login returns a JWT and stores it in Angular `localStorage`.
- JWT interceptor attaches `Authorization: Bearer <token>` to backend API calls.
- Protected Angular routes require a valid, non-expired token.
- Password policy is enforced on both frontend and backend.
- User passwords are hashed with BCrypt.
- Saved vault passwords are encrypted with AES-GCM in H2 as `encrypted_password`.
- Saved vault passwords are decrypted only in responses for the logged-in user.
- Password record API request fields are exactly `name`, `username`, and `password`.
- Users can add, view, edit, delete, and search only their own records.
- Search uses only the `name` field.
- Password list supports show/hide, copy username, copy password, edit, and delete.
- Logout clears the frontend token/session.
