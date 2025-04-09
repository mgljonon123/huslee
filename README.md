# Portfolio Website

A modern portfolio website built with Next.js, TypeScript, Tailwind CSS, and Prisma with MongoDB.

## Features

- Responsive design with dark/light mode
- Admin panel for managing content
- Project showcase
- Skills display
- About me section
- Contact form
- Secure authentication

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- pnpm (or npm/yarn)
- MongoDB database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   DATABASE_URL="your-mongodb-connection-string"
   JWT_SECRET="your-secret-key-for-jwt-tokens"
   ```

4. Generate Prisma client:
   ```bash
   pnpm prisma generate
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Panel

Access the admin panel at `/admin/login`. You'll need to create an admin user in the database first.

## Deployment

This project can be deployed on Vercel, Netlify, or any other platform that supports Next.js applications.

## License

This project is licensed under the MIT License.
