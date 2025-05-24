# 🛒 E-Commerce Backend API

A scalable and secure e-commerce backend built using Node.js, Express, MongoDB, Redis, and JWT-based authentication. It supports product management, user authentication, cart operations, and order checkout.

## 🏗️ Architecture Overview

```
                   HTTP
               +----------+
               | Backend  |
               | (Express)|
               +----------+
                    |
         +---------------------------+
         |      JWT Authentication   |
         +---------------------------+
                    |
         +---------------------------+
         |   Checkout Controller     |
         +---------------------------+
            /                   \
     Redis Lock PX/NX        MongoDB Ops
        +---------+       +------------------+
        |  Redis  |       |     MongoDB      |
        |  (Lock) |       | (Users, Orders,  |
        +---------+       |  Products, Cart) |
                          +------------------+
```

---

## 📦 Features

* 🔐 JWT-based User Authentication
* 🛍️ Product Management (CRUD)
* 🛒 Shopping Cart with Quantity Control
* 📦 Atomic Order Checkout with Stock Validation
* 🔄 Redis-based Locking for Safe Concurrent Transactions

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repo-url>
cd <repo-name>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Create a `.env` file and configure:

```dotenv
PORT=3000
MONGO_URI=mongodb://localhost:27017/cart
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

### 4. Start the Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

---

## 📁 Project Structure

```
ecommerce-backend/
├── src/
│   ├── controllers/       # Route handlers for auth, cart, products, checkout
│   ├── models/            # Mongoose schemas: User, Product, Cart, Order
│   ├── routes/            # Express routers grouped by domain
│   ├── middleware/        # Custom middlewares like JWT authentication
│   └── server.ts          # App entry point and setup
├── .env                   # Environment variables
├── package.json           # Node project manifest
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

---

## 📘 API Endpoints

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register new user   |
| POST   | `/api/auth/login`    | Login and get token |

### Products

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| GET    | `/api/products` | List all products    |
| POST   | `/api/products` | Create a new product |

### Cart

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| GET    | `/api/cart/:userId` | Get user's cart    |
| POST   | `/api/cart/:userId` | Update user's cart |

### Checkout

| Method | Endpoint        | Description       |
| ------ | --------------- | ----------------- |
| POST   | `/api/checkout` | Complete an order |

---

## 🗃️ Database Models

### User

```ts
email: string (unique)
password: string (hashed)
```

### Product

```ts
title: string
price: number
stock: number
```

### Cart

```ts
userId: string
items: [{
  productId: ObjectId,
  quantity: number
}]
```

### Order

```ts
userId: string
items: [{
  productId: ObjectId,
  quantity: number,
  price: number
}]
total: number
createdAt: Date
```

---

## ✅ Best Practices Followed

* Hashing passwords using bcrypt
* JWT-based stateless authentication
* Mongoose Transactions for order atomicity
* Redis locking to prevent checkout race conditions

---

## 📌 TODO

* Add validation middleware (e.g. `express-validator`)
* Swagger API Documentation
* Email notifications on checkout

---

## 📄 License

MIT - feel free to reuse this architecture for other event-driven systems!!
