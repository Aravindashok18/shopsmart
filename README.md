# ShopSmart — MERN E-Commerce Platform

A full-stack e-commerce web app that lets customers browse products, manage a cart and wishlist, and place orders, with role-based accounts for customers, sellers, and admins. Built with MongoDB, Express, React, and Node.js.

## Features

- Product catalog with search, category, and price filtering, plus a dedicated category listing endpoint
- Cart and checkout flow with shipping address collection
- JWT authentication with role-based access control (customer / seller / admin)
- User profile management: update profile details, change password, wishlist
- Sellers can create, edit, and delete their own product listings, and view only their own catalog
- Product reviews and ratings, with automatic average-rating recalculation
- Admins can manage users (list, change role, remove), view all orders, update order status, and see aggregate order/revenue stats
- Customers can cancel pending orders, which restocks the reserved inventory
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

25 endpoints across auth, users, products, and orders.

### Auth — `/api/auth`

| Method | Route      | Access        | Description                          |
| ------ | ---------- | ------------- | ------------------------------------- |
| POST   | `/register`| Public        | Create an account                     |
| POST   | `/login`   | Public        | Log in and receive a JWT              |
| GET    | `/me`      | Authenticated | Get current user                      |
| PUT    | `/me`      | Authenticated | Update profile (name, address)        |
| PUT    | `/password`| Authenticated | Change password                       |

### Users — `/api/users`

| Method | Route                  | Access        | Description                    |
| ------ | ----------------------- | ------------- | -------------------------------- |
| GET    | `/wishlist`             | Authenticated | List your wishlist                |
| POST   | `/wishlist/:productId`  | Authenticated | Add a product to your wishlist    |
| DELETE | `/wishlist/:productId`  | Authenticated | Remove a product from your wishlist |
| GET    | `/`                     | Admin         | List all users                    |
| PUT    | `/:id/role`             | Admin         | Change a user's role              |
| DELETE | `/:id`                  | Admin         | Remove a user                     |

### Products — `/api/products`

| Method | Route             | Access               | Description                       |
| ------ | ------------------ | --------------------- | ----------------------------------- |
| GET    | `/`                 | Public                | List/search products with filters   |
| GET    | `/categories`       | Public                | List distinct product categories    |
| GET    | `/seller/mine`      | Seller/Admin          | List the current seller's products  |
| GET    | `/:id`               | Public                | Get product details                  |
| POST   | `/`                  | Seller/Admin          | Create a product                     |
| PUT    | `/:id`                | Owning seller/Admin    | Update a product                    |
| DELETE | `/:id`                | Owning seller/Admin    | Delete a product                    |
| POST   | `/:id/reviews`        | Authenticated          | Add a product review (one per user) |

### Orders — `/api/orders`

| Method | Route             | Access          | Description                                |
| ------ | ------------------ | --------------- | -------------------------------------------- |
| POST   | `/`                 | Authenticated   | Place an order                               |
| GET    | `/mine`             | Authenticated   | List your orders                             |
| GET    | `/stats`            | Admin           | Aggregate order counts, revenue, and status breakdown |
| GET    | `/`                 | Admin           | List all orders                              |
| GET    | `/:id`               | Owner/Admin     | Get order details                             |
| PUT    | `/:id/status`        | Admin           | Update order status                           |
| PUT    | `/:id/cancel`        | Owner/Admin     | Cancel a pending/processing order and restock |

### Misc

| Method | Route        | Access | Description        |
| ------ | ------------- | ------ | -------------------- |
| GET    | `/api/health` | Public | Service health check |

## Deployment

A `render.yaml` [Blueprint](https://render.com/docs/blueprint-spec) is included for deploying both services to [Render](https://render.com):

1. Push this repo to GitHub.
2. In Render, create a new **Blueprint** and point it at the repo.
3. Set the `MONGO_URI` and `CLIENT_URL` environment variables on the API service, and `VITE_API_URL` (pointing at the deployed API's `/api` path) on the client service.
