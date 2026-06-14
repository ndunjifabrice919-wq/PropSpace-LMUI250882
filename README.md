# PropSpace 🏡

A full-stack real-time property listing web application where users can discover, list, update, and remove properties for rent or sale.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (custom design system) |
| Backend | Node.js + Express 5 |
| Database | MongoDB Atlas (via Mongoose) |
| Auth | JWT (JSON Web Tokens) + bcrypt |

## Features

### Public
- 🔍 Browse all property listings (no login required)
- 🏙️ Filter by city, price range, property type, and listing status (Rent/Sale)
- 📋 View full property details including owner contact info

### Authenticated Users
- 🔐 Register & login with hashed passwords (bcrypt, salt rounds: 12)
- 📊 Personal dashboard showing your listings
- ➕ Create new listings (title, description, price, bedrooms, city, country, type, status, images)
- ✏️ Edit your own listings
- 🗑️ Delete your own listings
- 👤 Update your profile (display name, phone, avatar, bio)
- 🔒 Change password (with current password verification)

### 3. SEO & Standards
- Updated `index.html` with title tags, description, keywords, and Open Graph tags.
- Fully documented the project structure, features, API routes, and setup instructions in `README.md`.

### 4. Localization for Cameroon
- Changed all currency symbols and inputs across the app from USD (`$`) to CFA (`CFA` / `FCFA`).
- Updated the search filter and property input city placeholders to reference Cameroonian cities like **Douala** and **Yaoundé**.

## Architecture

```
backend/
  controllers/        ← Business logic layer
  repositories/       ← Data access layer (DB queries)
  middleware/         ← Auth guard + global error handler
  models/             ← Mongoose schemas
  routes/             ← Thin RESTful routers
  server.js
frontend/
  src/
    components/       ← Reusable UI components
    context/          ← Global auth state (React Context)
    pages/            ← Route-level page components
```

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT |
| GET | `/api/properties` | No | List all properties (with filters) |
| GET | `/api/properties/:id` | No | Get single property |
| GET | `/api/properties/my-listings` | Yes | Get current user's listings |
| POST | `/api/properties` | Yes | Create a listing |
| PUT | `/api/properties/:id` | Yes (owner) | Update a listing |
| DELETE | `/api/properties/:id` | Yes (owner) | Delete a listing |
| GET | `/api/users/profile` | Yes | Get user profile |
| PUT | `/api/users/profile` | Yes | Update profile |
| PUT | `/api/users/security` | Yes | Change password |

## Environment Variables

See `backend/.env.example` for required variables.
