# Todo List Application - Implementation Details

This document outlines the technical details, setup instructions, design decisions, and features implemented for the Todo List assessment.

## Tech Stack

*   **Frontend:**
    *   Framework: Next.js (v13+ with App Router)
    *   Language: JavaScript (React)
    *   Styling: Tailwind CSS (Assumed based on class names)
*   **Backend:**
    *   Framework: Next.js API Routes (Route Handlers)
    *   Language: Node.js / JavaScript
    *   Database: PostgreSQL
    *   Database Client: `pg` (node-postgres)
*   **Development Environment:**
    *   Package Manager: npm (or yarn)
    *   Containerization: Docker (for PostgreSQL)

## How to Run the Application

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (or yarn)
*   Docker and Docker Compose (or just Docker Desktop) installed and running.

### 1. Start PostgreSQL Database (Docker)

Open your terminal in the project's root directory and run the following Docker command to start a PostgreSQL container. This uses default credentials matching the application's fallback settings.

```bash
docker run --name todo-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=tododb -p 5432:5432 -d postgres:latest

### 2. Apply Database Schema

Execute the following command to create the necessary tables in your PostgreSQL database:

```bash
docker exec -i todo-postgres psql -U admin -d tododb < schema.sql
```

### 3. Configure Environment (Optional)

The application reads database connection details from environment variables, with defaults provided in `src/lib/db.js`:

- **DB_USER** (default: 'admin')
- **DB_HOST** (default: 'localhost')
- **DB_NAME** (default: 'tododb')
- **DB_PASSWORD** (default: 'admin')
- **DB_PORT** (default: 5432)

If your database setup (from Step 1) uses different credentials, or if you changed the host port mapping (e.g., `-p 5433:5432`), create a `.env.local` file in the project root and set the corresponding variables:

```dotenv
# .env.local (Example)
DB_USER=your_db_user       # If different from 'admin'
DB_PASSWORD=your_db_password # If different from 'admin'
DB_NAME=your_db_name       # If different from 'tododb'
DB_HOST=localhost          # Usually 'localhost' when using docker port mapping
DB_PORT=5432               # The *host* port you mapped (e.g., 5433 if you used -p 5433:5432)
```

The `.env.local` file will override the default settings in `src/lib/db.js`.

### 4. Install Dependencies

Navigate to the project's root directory in your terminal and install the required Node.js packages:

```bash
npm install
```

Or, if you prefer using Yarn:

```bash
yarn install
```

### 5. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```


