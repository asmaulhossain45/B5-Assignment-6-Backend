# 💰 Digital Wallet API

A secure, scalable and role-based RESTful API system for a Digital Wallet service similar to Bkash or Nagad. Built using **Node.js**, **Express**, **TypeScript**, and **MongoDB**, the system supports user wallet operations, transaction history, agent-assisted cash-in/out and admin controls.

---

## 📌 Project Overview

This API enables wallet-based money transactions for **Users**, **Agents**, and **Admins**. It is designed with robust authentication, role-based access control, transaction history and wallet balance tracking.

---

## ✨ Features

### ✅ Authentication & Security

- JWT-based login with **access/refresh tokens**
- Password hashing with **bcrypt**
- Cookie-based auth (HTTP-only)
- **Role-based access control** (Admin, Agent, User)

### ✅ Users

- Register/login
- Automatic wallet creation with initial balance 50
- Add money, Withdraw, Transfer to another user
- View transaction history

### ✅ Agents

- Register/login
- Add money (Cash-In) to any user
- Withdraw money (Cash-Out) from any user
- View commission history

### ✅ Admins / Super Admins

- View all users, agents, admin, wallet and transactions
- Approve/reject agent status
- Block/unblock wallets

### ✅ Transactions & Wallet

- Transaction history for all operations
- Commission handling for agents

---

## 🛠️ Tech Stack

| Technology     | Description                   |
| -------------- | ----------------------------- |
| Node.js        | JavaScript runtime            |
| Express.js     | Web framework                 |
| TypeScript     | Static typing                 |
| MongoDB        | NoSQL Database                |
| Mongoose       | MongoDB ODM                   |
| Zod            | Request validation            |
| bcrypt         | Password hashing              |
| JSON Web Token | Auth strategy (JWT)           |
| dotenv         | Environment configuration     |
| cookie-parser  | Cookie handling               |
| CORS           | Cross-Origin Resource Sharing |

---

## 📡 API Endpoints

### ✅ Auth Routes

| Method | Endpoint                       | Description                       |
| ------ | ------------------------------ | --------------------------------- |
| POST   | `/api/v1/auth/login`           | Login with email and password     |
| POST   | `/api/v1/auth/refresh-token`   | Refresh access token              |
| POST   | `/api/v1/auth/change-password` | change password with old password |
| POST   | `/api/v1/auth/logout`          | Logout and clear cookies          |
| POST   | `/api/v1/auth/register/user`   | Register user with user           |
| POST   | `/api/v1/auth/register/agent`  | Register agent with agent         |
| POST   | `/api/v1/auth/register/admin`  | Register admin without admin      |
| POST | `/api/v1/auth/send-reset-otp` | reset password send otp |
| POST | `/api/v1/auth/verify-reset-otp` | verify reset otp |
| POST | `/api/v1/auth/reset-password` | reset password with new |
| POST | `/api/v1/auth/send-verify-otp` | send verify account otp |
| POST | `/api/v1/auth/verify-account` | verify account by otp   |

---

### 👤 User Routes

| Method | Endpoint                     | Description                |
| ------ | ---------------------------- | -------------------------- |
| GET    | `/api/v1/users/me`           | Get logged-in user details |
| PATCH  | `/api/v1/users/me`           | Update user profile        |
| GET    | `/api/v1/users/wallet`       | User's Wallet              |
| GET    | `/api/v1/users/transactions` | User's transaction history |
| POST   | `/api/v1/users/add-money`       | Add money (top up)         |
| POST   | `/api/v1/users/withdraw`     | Withdraw money from wallet |
| POST   | `/api/v1/users/send-monay`   | send money to another user |

---

### 🧑‍💼 Agent Routes

| Method | Endpoint                      | Description                           |
| ------ | ----------------------------- | ------------------------------------- |
| GET    | `/api/v1/agents/me`           | Get Looged in Agent profile           |
| PATCH  | `/api/v1/agents/me`           | Update logged in agent profile        |
| GET    | `/api/v1/agents/wallet`       | Agent's Wallet                        |
| GET    | `/api/v1/agents/transactions` | Agent's transaction history           |
| GET    | `/api/v1/agents/commission`   | Agent's commission history            |
| POST   | `/api/v1/agents/cash-in`      | Add money to a user (cash-in)         |
| POST   | `/api/v1/agents/cash-out`     | Withdraw money from a user (cash-out) |

---

### 🛠️ Admin - Super Admin Routes

| Method | Endpoint                                 | Description                      |
| ------ | ---------------------------------------- | -------------------------------- |
| GET    | `/api/v1/admins/me`                      | Get Looged in admin profile      |
| PATCH  | `/api/v1/admins/me`                      | Update logged in admin profile   |
| GET    | `/api/v1/admins`                         | Get all Admin                    |
| GET    | `/api/v1/admins/users`                   | Get all users                    |
| GET    | `/api/v1/admins/agents`                  | Get all agents                   |
| GET    | `/api/v1/admins/wallets`                 | Get all wallet                   |
| GET    | `/api/v1/admins/transactions`            | Get all Transaction history      |
| PATCH  | `/api/v1/admins/users/:userId/status`    | Update user, agent, admin status |
| PATCH  | `/api/v1/admins/agents/:agentId/approval`| Update Agent Approval Status     |
| PATCH  | `/api/v1/admins/wallets/:walletId/status`| Update wallet Status             |

---

### Query

```
?searchTerm=transfer&type=transfer&sort=-createdAt&fields=type,amount,createdAt&page=2&limit=5
```

## 🧪 Sample Payload

### Login (POST `/api/v1/auth/login`)

```json
{
  "email": "demoemail@gmail.com",
  "password": "123456789"
}
```

### Change Password (POST `/api/v1/auth/change-password`)

```json
{
  "oldPassword": "123456789",
  "newPassword": "12345678"
}
```

### Create Account (POST `/api/v1/auth/register/user|agent|admin`)

```json
{
  "name": "demo User",
  "email": "demoemail@gmail.com",
  "password": "123456789"
}
```

### Update User | Admin (PATCH `/api/v1/users/me | /api/v1/admins/me`)

```json
{
  "name": "demo User",
  "dob": "2025-07-31T15:15:21.935+00:00",
  "phone": "+880123456789",
  "gender": "male",
  "location": {
    "division": "rajshahi",
    "districts": "chapainawabganj",
    "address": "sadar"
  }
}
```

### Update Agent (PATCH `/api/v1/agents/me`)

```json
{
  "name": "demo User",
  "dob": "2025-07-31T15:15:21.935+00:00",
  "phone": "+880123456789",
  "gender": "male",
  "businessName": "demo shop",
  "location": {
    "division": "rajshahi",
    "districts": "chapainawabganj",
    "address": "sadar"
  }
}
```

### User Add Money (top up) & withdraw (POST `/api/v1/users/add-money` & `/api/v1/users/withdraw`)

```json
{
  "amount": 10000,
  "reference": "bank"
}
```

### User send money (POST `/api/v1/users/send-money`)

```json
{
  "amount": 10000,
  "receiver": "demouser6@gmail.com"
}
```

### Agent Add money to user (cash-in) (POST `/api/v1/agents/cash-in`)

```json
{
  "amount": 10000,
  "receiver": "demouser6@gmail.com"
}
```

### Agent withdraw money from user (cash-out) (POST `/api/v1/agents/cash-out`)

```json
{
  "amount": 10000,
  "sender ": "demouser6@gmail.com"
}
```

### Update user, agent, admin status (PATCH `/api/v1/admins/users/:userId/status`)

```json
{
  "status": "active"
}
```

### Update Agent Approval Status (PATCH `/api/v1/admins/agents/:agentId/approval`)

```json
{
  "isApproved": true
}
```

### Update wallet Status (PATCH `/api/v1/admins/wallets/:walletId/status`)

```json
{
  "status": "active"
}
```

## 📦 Clone The Repo

```bash
git clone https://github.com/asmaulhossain45/B5-Assignment-6-Backend.git
```

## 📥 Intall Dependencies

```bash
pnpm install
```

## 🚀 Start the server

```bash
pnpm run dev
```

This Project is built for Assignment 6 — Digital Wallet
