# 🍳 Pantry Routes — Culinary Recipes Application

[![Next.js Version](https://img.shields.io/badge/Next.js-16.2.9--Turbopack-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![UI Library](https://img.shields.io/badge/UI_Library-HeroUI-pink?style=flat-square)](https://heroui.com/)
[![Linting](https://img.shields.io/badge/Linter-ESLint_100%25_Clean-blueviolet?style=flat-square&logo=eslint)](https://eslint.org/)

A modern, high-performance Next.js recipe web application featuring secure multi-cookie authentication, Cloudinary image optimization, dynamic detail views, a seamless favorites system, and automated SMTP email greetings.

Designed with **visual excellence**, **clean decoupled architecture**, and **performance optimizations** like Turbopack and Cloudinary.

---

## 🏛️ Architecture and Technical Requirements

### 1. Decoupled Service Layer
This application implements a clean **decoupled Service Layer** separating data-fetching and business logic from the routing and page rendering views. All interactions with the database flow through specialized service helpers to ensure a scalable and maintainable codebase.

* **Routing/API Layer:** `src/app/` (API Route Handlers & Server/Client Components)
* **Service Layer:** `src/services/` (Handles database queries, writes, and authentication helper connections)
* **Database Utility Layer:** `src/lib/mongodb.ts` (Connects and exposes collections dynamically)

### 2. Multi-Cookie Authentication & JWT Flow
The authentication framework implements a dual-token strategy for maximum security and seamless session lifetime:
* **Access Token Cookie** (`clockhub_access`): A short-lived (15 min), HTTP-only, secure cookie containing the user's identity, role, and details.
* **Refresh Token Cookie** (`clockhub_refresh`): A longer-lived (7 days), HTTP-only, secure cookie storing a session ID mapping to a MongoDB record.
* **Auto-Recovery:** If the access token expires, the client-side provider automatically attempts to call the rotation endpoint `/api/auth/refresh` to issue new tokens. If both tokens are invalid, the client state is immediately synchronized (`null` session) and invalid cookies are deleted.

---

## 🧭 Routes and Route Guarding

The application manages authentication routing through a centralized server-side routing layer in [src/proxy.ts](file:///home/cohorte6/Documentos/simulacro_typescript/src/proxy.ts):

| Route | Description | Authentication Required | Guard Behavior |
| :--- | :--- | :---: | :--- |
| `/` | Homepage & Recipe Catalog | **No** | Publicly accessible |
| `/recipes/[slug]` | Comprehensive dynamic recipe detail view | **No** | Publicly accessible |
| `/auth/login` | Secure User Sign-In panel | **No** | Client-side redirects to `/` if logged in |
| `/auth/register` | New User Registration form | **No** | Client-side redirects to `/` if logged in |
| `/favorites` | Bookmarked Recipe Collection | **Yes** | Server-side guarded. Redirects to `/auth/login` if unauthenticated |
| `/dashboard` | User Hub | **Yes** | Server-side guarded. Client redirects to `/` |

---

## 📂 Database Schema (MongoDB)

The application utilizes MongoDB to store application state across five principal collections:

* 👤 **`users`**: Contains authenticated user credentials (stored as salted hashes using `bcryptjs`) and profile metadata.
* 🍔 **`recipes`**: Stores the catalog of recipes, including standard list parameters and extended steps/tips shown in detail views.
* 🔖 **`favorites`**: Maps bookmarks connecting a `userId` to a `recipeSlug`.
* 🔑 **`refreshTokens`**: Tracks session IDs for token rotation, verification, and revocation on logout.
* 📝 **`auditLogs`**: Tracks administrative operations, login, and registration events.

---

## 🛠️ Installation and Local Setup

### 1. Clone & Install
```bash
git clone https://github.com/KamiKoni/Prueba_NextJS.git
cd simulacro_typescript
npm install
```

### 2. Configure Environment
Copy the environment template:
```bash
cp .env.example .env.local
```

Fill in your configuration details inside `.env.local`:

```ini
# MongoDB Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/
MONGO_DB_NAME=pantry_routes

# Authentication Secrets (minimum 24 characters)
JWT_ACCESS_SECRET=your_jwt_access_secret_key_minimum_24_characters
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_minimum_24_characters
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary (Optional - optimized recipe images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (SMTP) Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username@gmail.com
SMTP_PASS=your_smtp_app_password
SMTP_FROM=your_smtp_sender_email@gmail.com
```

> [!NOTE]
> In development, if `MONGO_URI` and JWT secrets are omitted, the application falls back automatically to secure local defaults. For production deployments, all required variables must be defined.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🚀 Key Commands

Ensure code standards and build optimizations are verified with these terminal commands:

* **Development Server**: `npm run dev`
* **Type Checking**: `npm run typecheck`
* **Code Linting**: `npm run lint`
* **Production Build**: `npm run build`
* **Cloudinary Verification**: `npm run cloudinary:onboard`

---

## 📧 SMTP Email Configurations
Since the app uses the SMTP protocol (via Nodemailer), you can plug in any mail provider by updating your `.env` variables:

### Gmail
Ensure you have generated an **App Password** from your Google account settings.
```text
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Mailtrap (for safe testing)
```text
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your_mailtrap_username
SMTP_PASS=your_mailtrap_password
SMTP_FROM=sandbox@example.com
```

### Resend
```text
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=resend
SMTP_PASS=your_resend_api_key
SMTP_FROM=onboarding@resend.dev
```

---

## 🎨 Design System & Aesthetics
* **Rich Aesthetics:** Combines vibrant, custom HSL palettes (`#f7f3ed`, `#1f4f46`, and `#7a4f32`) with clean, translucent cards using `backdrop-filter: blur(18px)` to deliver a cozy, premium kitchen vibe.
* **Modern Typography:** Styled with Outfit for readability and Fraunces for beautiful, warm serif headers.
* **Responsive Layout:** Grid layouts optimized for fluid screen width changes (Tailwind CSS v4 + HeroUI component styling integrations).

---

> [!NOTE]
> **User Management Routes:**
> User registration saves new user records directly to the `users` collection. However, user listing and modification routes (under `/api/users`) return `410 Gone` with the message `"User management is not part of this recipe app."`. This is intended behavior because user administration is handled implicitly by login/registration flows.

---
Developed by **[Argenis Flores](https://github.com/KamiKoni/Prueba_NextJS.git)** 👨‍🍳
