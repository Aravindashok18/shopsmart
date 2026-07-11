# ShopEase — MERN E-Commerce Platform

A full-stack e-commerce web app that lets customers browse products, manage a cart, and place orders, with role-based accounts for customers, sellers, and admins. Built with MongoDB, Express, React, and Node.js.

## Features

- Product catalog with search, category, and price filtering
- Cart and checkout flow with shipping address collection
- JWT authentication with role-based access control (customer / seller / admin)
- Sellers can create, edit, and delete their own product listings
- Admins can view all orders and update order status
- REST API with input validation, centralized error handling, rate limiting, and security headers

## Tech stack

- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Auth:** JSON Web Tokens, bcrypt password hashing

## Project structure

```
ecommerce-app/
  server/   Express REST API
  client/   React frontend
```

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB connection string (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Backend

```bash
cd server
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev             # starts on http://localhost:5000
```

### Frontend

```bash
cd client
cp .env.example .env    # optional: point at a deployed API
npm install
npm run dev              # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so no `.env` is required for local development.

## API overview

| Method | Route                     | Access          | Description                  |
| ------ | -------------------------- | --------------- | ----------------------------- |
| POST   | `/api/auth/register`       | Public          | Create an account             |
| POST   | `/api/auth/login`          | Public          | Log in and receive a JWT      |
| GET    | `/api/auth/me`              | Authenticated   | Get current user              |
| GET    | `/api/products`             | Public          | List/search products          |
| GET    | `/api/products/:id`         | Public          | Get product details           |
| POST   | `/api/products`             | Seller/Admin    | Create a product              |
| PUT    | `/api/products/:id`         | Owning seller/Admin | Update a product          |
| DELETE | `/api/products/:id`         | Owning seller/Admin | Delete a product          |
| POST   | `/api/orders`                | Authenticated   | Place an order                |
| GET    | `/api/orders/mine`           | Authenticated   | List your orders              |
| GET    | `/api/orders/:id`             | Owner/Admin     | Get order details              |
| GET    | `/api/orders`                | Admin           | List all orders                |
| PUT    | `/api/orders/:id/status`     | Admin           | Update order status            |

## Deployment

A `render.yaml` [Blueprint](https://render.com/docs/blueprint-spec) is included for deploying both services to [Render](https://render.com):

1. Push this repo to GitHub.
2. In Render, create a new **Blueprint** and point it at the repo.
3. Set the `MONGO_URI` and `CLIENT_URL` environment variables on the API service, and `VITE_API_URL` (pointing at the deployed API's `/api` path) on the client service.
