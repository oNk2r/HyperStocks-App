# HyperStocks

A stock market dashboard built with Next.js, React, TypeScript, and Tailwind CSS. It integrates TradingView widgets for chart analysis, Finnhub for market quotes and news, Better-Auth for authentication, and Inngest with Nodemailer for automated price alert emails.

## Features

- Real-time stock charts and market overviews using TradingView widgets
- User authentication with session management via Better-Auth and MongoDB
- Personal watchlist to track stocks and related company news
- Symbol search with auto-complete
- Price alert system with scheduled background checks via Inngest and email delivery via Nodemailer
- Responsive dark UI built with Tailwind CSS

## Tech Stack

- Framework: Next.js (App Router)
- Frontend: React, Tailwind CSS, Radix UI, Lucide React
- Language: TypeScript
- Database: MongoDB via Mongoose
- Authentication: Better-Auth
- Market Data: Finnhub API, TradingView Widgets
- Background Jobs: Inngest
- Email: Nodemailer

## Project Structure

```text
HyperStocks-App/
├── app/
│   ├── (auth)/             # Authentication routes (sign-in, sign-up)
│   ├── (root)/             # Application routes (dashboard, stocks, watchlist)
│   └── api/                # API route handlers (auth, inngest)
├── components/             # Reusable UI and feature components
├── database/               # Mongoose connection and data models
├── hooks/                  # Custom React hooks
├── lib/                    # Server actions, external clients, utilities
├── proxy.ts                # Route protection and auth redirects (Next.js 16 proxy)
└── types/                  # TypeScript definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- MongoDB instance (local or MongoDB Atlas)
- Finnhub API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Paras-8028/HyperStocks-App.git
   cd HyperStocks-App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:
   - `BETTER_AUTH_SECRET`: Secret key for session encryption
   - `BETTER_AUTH_URL`: Base URL of the application (e.g., `http://localhost:3000`)
   - `MONGODB_URI`: MongoDB connection string
   - `FINNHUB_API_KEY`: Finnhub API key
   - `NEXT_PUBLIC_FINNHUB_API_KEY`: Finnhub API key for client-side requests
   - `EMAIL_USER`: SMTP email address for alert delivery
   - `EMAIL_PASS`: SMTP application password
   - `INNGEST_EVENT_KEY`: Inngest event key
   - `INNGEST_SIGNING_KEY`: Inngest signing key

4. Start the development server:
   ```bash
   npm run dev
   ```

5. (Optional) Run the Inngest Dev Server for background alerts:
   ```bash
   npx inngest-cli@latest dev
   ```

The application will be running at [http://localhost:3000](http://localhost:3000).

## Preview

![Dashboard Preview](./public/assets/images/dashboard-preview.png)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Maharudra Patil
- LinkedIn: https://linkedin.com/in/maharudra-patil
- GitHub: https://github.com/Paras-8028
