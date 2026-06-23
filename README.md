# Culinary Recipes Application

A Next.js kitchen recipe web application featuring user authentication, MongoDB integration, and automated email services. This project is built as an exam evaluation submission.

## Architecture and Technical Requirements

### Project Architecture
This application implements a decoupled Service Layer to separate data-fetching and business logic from the routing and page rendering views. All interactions with the database flow through this dedicated layer to ensure a clean, organized, and scalable codebase.

### Database Schema (MongoDB)
The application integrates with MongoDB using three main collections:
- **users**: Stores registered user credentials and profile information.
- **recipes**: Stores the catalog of recipes, including standard list data and extended fields visible only on the detail view.
- **favorites**: Maps favorite recipe relations per authenticated user.

### UI Component Library
The user interface is built using a component library (such as Material UI or HeroUI) to handle core interactive elements like buttons, form inputs, and layout grids.

### External Services
- **Automated Emails**: Connects to an external email service provider to automatically dispatch a welcome email to new users upon successful registration.

## Functional Features

1. **Recipe Catalog**: The homepage displays a list of available recipes using a reusable component. Each recipe card presents an image, name, preparation time, and difficulty level. This catalog is publicly accessible.
2. **Dynamic Detail View**: A dynamic route handles individual recipe pages. It renders extended data not present in the catalog layout, such as ingredients, step-by-step preparation guidelines, and serving sizes.
3. **Authentication Framework**: Dedicated login and registration interfaces. Authenticated users will see their username displayed in the global navigation bar.
4. **Favorites Management**: Authenticated users can toggle recipes into their favorites list via a bookmark icon on the components. A protected view displays only their saved recipes.

## Route and Authentication Mapping

| Route | Description | Authentication Required |
| :--- | :--- | :--- |
| `/` | Main recipe catalog listing | No |
| `/recipes/[slug]` | Comprehensive dynamic recipe detail view | No |
| `/auth/login` | User authentication sign-in form | No |
| `/auth/register` | New user account registration form | No |
| `/favorites` | Curated list of marked favorite recipes | Yes |

## Installation and Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/KamiKoni/Prueba_NextJS.git
   cd simulacro_typescript
   ```

2. Install the project dependencies:
   ```bash
   npm install
   ```

3. Copy the environment template and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

   Minimum required variables in `.env.local`:
   ```text
   # MongoDB Configuration
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/
   MONGO_DB_NAME=pantry_routes

   # Authentication Secret keys (needs to be secure strings, min 24 chars)
   JWT_ACCESS_SECRET=your_jwt_access_secret_key_minimum_24_characters
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_minimum_24_characters
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   # Cloudinary (optional — enables optimized recipe images)
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

   In development, if `MONGO_URI` and JWT secrets are missing, safe local defaults are used automatically. For production, all required variables must be set explicitly.

4. Run the local development server:
   ```bash
   npm run dev
   ```

### Cloudinary image optimization

Recipe card and detail images are delivered through Cloudinary's fetch API when `CLOUDINARY_CLOUD_NAME` is set. Only the cloud name is required for read-only optimization; API key and secret are needed for uploads.

To verify your Cloudinary credentials:

```bash
npm run cloudinary:onboard
```

### Configuring Alternative Email Providers (Non-Gmail)
Since the app uses standard SMTP protocol (via Nodemailer), you can configure any email service provider by updating the SMTP variables in `.env`:

* **Mailtrap (for testing):**
  ```text
  SMTP_HOST=sandbox.smtp.mailtrap.io
  SMTP_PORT=2525
  SMTP_SECURE=false
  SMTP_USER=your_mailtrap_username
  SMTP_PASS=your_mailtrap_password
  SMTP_FROM=sandbox@example.com
  ```
* **Resend:**
  ```text
  SMTP_HOST=smtp.resend.com
  SMTP_PORT=587
  SMTP_SECURE=false
  SMTP_USER=resend
  SMTP_PASS=your_resend_api_key
  SMTP_FROM=onboarding@resend.dev
  ```
* **SendGrid:**
  ```text
  SMTP_HOST=smtp.sendgrid.net
  SMTP_PORT=587
  SMTP_SECURE=false
  SMTP_USER=apikey
  SMTP_PASS=your_sendgrid_api_key
  SMTP_FROM=your_sender@example.com
  ```

## Database Collections & Administration

The application utilizes MongoDB to store application state across these collections:
* **`recipes`**: Contains the recipes catalog data (pre-loaded with six starter recipes including Lemon Herb Risotto, Smoky Chickpea Tacos, Berry Oat Skillet, Miso Glazed Salmon Bowl, Rustic Tomato Gnocchi, and Chocolate Lava Mug Cake).
* **`users`**: Contains authenticated user credentials (stored as salted hashes).
* **`auditLogs`**: Tracks user actions and administrative logs.
* **`favorites`**: Tracks relationships mapping users to their bookmarked recipes.

> [!NOTE]
> **User Management Pages & APIs:**
> User registration saves new user records directly to the `users` collection. However, user listing and modification routes (under `/api/users`) return `410 Gone` with the message `"User management is not part of this recipe app."`. This is intended behavior because user administration is handled implicitly by login/registration flows.

---
Developed by [Argenis Flores](https://github.com/KamiKoni/Prueba_NextJS.git)
