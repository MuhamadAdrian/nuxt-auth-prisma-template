# Template: Nuxt + Nuxt Auth Local + Prisma + MySQL

This template combines Nuxt, Prisma, and MySQL to provide a robust starter kit for building modern web applications. It includes authentication with Nuxt Auth, a refresh token schema, and basic login, register, and token refresh APIs. The UI uses ShadCN components.

Learn more about Nuxt at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction).

---

## Features

- **Nuxt Auth Local**: Authentication module for handling user login and registration.
- **Refresh Token Schema**: Supports secure token refresh functionality.
- **Login / Register / Refresh Token API**: Prebuilt endpoints for user authentication flows.
- **Prisma Integration**: ORM for managing your MySQL database schema and queries.
- **ShadCN Components**: Styled components for building a modern UI.

---

## Setup

Follow the steps below to set up and run the project:

### 1. Install Dependencies

Make sure you have Node.js and npm installed. Then, run the following command:

```bash
npm install
```

### 2. Configure the Database
Ensure you have a local MySQL database running on port 3306. Update the database connection string in the .env file:
```bash
DATABASE_URL="mysql://<username>:<password>@localhost:3306/<database_name>"
```
Replace `<username>`, `<password>`, and `<database_name>` with your actual database credentials.

### 3. Run Prisma Migrations and Seed
After installing dependencies, initialize your database with the following commands:
```bash
npm run prisma:migrate
npm run prisma:seed
```

### 4. Development Server
Start the development server on http://localhost:3000:
```bash
npm run dev
```

### 5. Production
Build the application for production:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```
Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Notes

1. **Database Requirement**:  
   Before running any Prisma commands, ensure your local MySQL database server is running and accessible on port `3306`.

2. **Prisma Commands**:  
   - `npm run prisma:migrate`: Applies pending migrations to the database.  
   - `npm run prisma:seed`: Populates the database with initial seed data (optional, depending on your configuration).
